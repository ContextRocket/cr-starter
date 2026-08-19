/**
 * Authenticated REST client for the `contextrocket content` / `admin` CLI.
 *
 * The umbrella runs the content + admin subcommands AS the signed-in principal
 * by calling the org-scoped `/api` REST routes with the stored fastapi-users
 * USER JWT (`StoredCredentials.apiToken` -- the two-token plane; see
 * `credentials` and the backend `oauth_cli_exchange`). This is the thin,
 * testable HTTP seam:
 *
 *   - RestTransportPort -- the minimal request surface (inject a fake in tests;
 *     the production adapter binds redirects OFF).
 *   - AuthenticatedApiClient -- loads the stored credential, ATTACHES
 *     `Authorization: Bearer <apiToken>` on every call, and maps typed error
 *     codes back to operator-facing messages.
 *
 * OpenAPI reuse: the org-scoped content/admin routes are NOT part of the
 * cr-starter template `openapi.json` (which ships only the auth/users/operator
 * surface), so the hey-api generated SDK does not cover them. This module is a
 * small typed fetch wrapper for exactly those routes. When a deployment's
 * `openapi.json` DOES include `/api/orgs/{org}/content*` + `/api/admin/*`, the
 * generated `types.gen.ts` can be imported to type the request/response bodies;
 * the transport seam and the bearer-attach contract stay the same.
 *
 * Fail-closed: a missing credential file OR a login that predates the two-token
 * plane (empty `apiToken`) raises `NotLoggedInError` telling the operator to run
 * `contextrocket auth login` -- never a silent DB fallback.
 */

import {
  CredentialError,
  loadCredentials,
} from "./credentials.js";

/** Raised when no usable API credential is stored (operator-facing, no token). */
export class NotLoggedInError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotLoggedInError";
  }
}

/**
 * Raised when a REST call fails (non-2xx). Carries the typed code + status.
 * The message never includes token material or server internals beyond the
 * typed error code the API already deems public.
 */
export class ApiRequestError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  constructor(statusCode: number, errorCode: string | null) {
    const code = errorCode || "ERROR_REQUEST_FAILED";
    super(`API request failed (HTTP ${statusCode}): ${code}`);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.errorCode = code;
  }
}

export interface RestResponse {
  statusCode: number;
  jsonBody: Record<string, unknown>;
  content: Buffer;
}

/** A multipart file part: [filename, bytes]. */
export type FilePart = [string, Buffer];

/**
 * Minimal HTTP surface the authenticated client needs. Every method takes an
 * explicit `headers` dict so the Bearer attach is visible + assertable in tests.
 */
export interface RestTransportPort {
  request(
    method: string,
    url: string,
    opts: {
      headers: Record<string, string>;
      params?: Record<string, string>;
      jsonBody?: Record<string, unknown>;
      files?: Record<string, FilePart>;
      form?: Record<string, string>;
    },
  ): Promise<RestResponse>;
}

/** Attach the stored USER JWT bearer to REST calls against the API base. */
export class AuthenticatedApiClient {
  private readonly apiBase: string;
  private readonly apiToken: string;
  private readonly transport: RestTransportPort;

  constructor(args: { apiBase: string; apiToken: string; transport: RestTransportPort }) {
    this.apiBase = args.apiBase.replace(/\/+$/, "");
    this.apiToken = args.apiToken;
    this.transport = args.transport;
  }

  /**
   * Build a client that authenticates with an explicit org machine credential
   * (a `crk_` key), bypassing the OAuth credential store entirely.
   *
   * This is the NON-INTERACTIVE (CI / GitHub Actions) path: OAuth loopback
   * cannot run headless, so `CONTEXTROCKET_API_KEY=crk_...` is used directly as
   * the REST bearer. The backend tiered-principal layer accepts a `crk_`
   * credential via `Authorization: Bearer` (the same header this client already
   * attaches) and org-scopes it fail-closed.
   *
   * The key is trimmed; an empty/whitespace-only key is a caller error (the
   * caller decides whether to fall back to the stored token).
   */
  static fromEnvKey(args: {
    apiKey: string;
    apiBase: string;
    transport: RestTransportPort;
    apiBaseOverride?: string | null;
  }): AuthenticatedApiClient {
    const key = args.apiKey.trim();
    if (!key) {
      throw new NotLoggedInError(
        "CONTEXTROCKET_API_KEY is set but empty. Provide a 'crk_' org machine credential.",
      );
    }
    return new AuthenticatedApiClient({
      apiBase: args.apiBaseOverride || args.apiBase,
      apiToken: key,
      transport: args.transport,
    });
  }

  /**
   * Load the stored credential and build a bearer-attaching client.
   *
   * Throws `NotLoggedInError` when no credential is stored or the stored
   * credential predates the two-token plane (empty apiToken).
   */
  static fromStored(
    home: string,
    args: { transport: RestTransportPort; apiBaseOverride?: string | null },
  ): AuthenticatedApiClient {
    let creds;
    try {
      creds = loadCredentials(home);
    } catch (err) {
      if (err instanceof CredentialError) {
        throw new NotLoggedInError(err.message);
      }
      throw err;
    }
    if (!creds.apiToken) {
      throw new NotLoggedInError(
        "No API token stored for the content/admin surface. Run 'contextrocket auth login' to obtain one.",
      );
    }
    return new AuthenticatedApiClient({
      apiBase: args.apiBaseOverride || creds.apiBase,
      apiToken: creds.apiToken,
      transport: args.transport,
    });
  }

  private headers(extra?: Record<string, string>): Record<string, string> {
    return { Authorization: `Bearer ${this.apiToken}`, ...(extra ?? {}) };
  }

  private url(path: string): string {
    return `${this.apiBase}/${path.replace(/^\/+/, "")}`;
  }

  get(path: string, params?: Record<string, string>): Promise<RestResponse> {
    return this.transport.request("GET", this.url(path), { headers: this.headers(), params });
  }

  postJson(path: string, jsonBody: Record<string, unknown>): Promise<RestResponse> {
    return this.transport.request("POST", this.url(path), { headers: this.headers(), jsonBody });
  }

  postFile(
    path: string,
    args: { files: Record<string, FilePart>; form?: Record<string, string> },
  ): Promise<RestResponse> {
    return this.transport.request("POST", this.url(path), {
      headers: this.headers(),
      files: args.files,
      form: args.form,
    });
  }

  delete(path: string, params?: Record<string, string>): Promise<RestResponse> {
    return this.transport.request("DELETE", this.url(path), { headers: this.headers(), params });
  }

  /** Return `resp` on 2xx, else throw `ApiRequestError` with the typed code. */
  static raiseForStatus(resp: RestResponse): RestResponse {
    if (resp.statusCode >= 200 && resp.statusCode < 300) return resp;
    const detail = resp.jsonBody?.detail;
    throw new ApiRequestError(resp.statusCode, typeof detail === "string" ? detail : null);
  }
}
