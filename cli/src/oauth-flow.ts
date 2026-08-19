/**
 * RFC 8252 native-app OAuth loopback flow for the `contextrocket` CLI.
 *
 * Flow LOGIC with every side effect injected so it can be tested hermetically
 * (no real browser, no real socket, no real network):
 *
 *   - HttpTransportPort -- POST form / POST json / GET json against the OAuth server.
 *   - openAuthorizeUrl callable -- presents the authorize URL (browser or print).
 *   - waitForCallback callable -- blocks on the one-shot loopback and returns the
 *     query params the server received (code, state, error).
 *
 * SECURITY controls implemented here:
 *   - PKCE S256 mandatory -- a fresh verifier/challenge per login.
 *   - `state` (CSRF) generated per login and verified against the value the
 *     loopback received; a mismatch throws `OAuthFlowError` and NO token
 *     exchange happens.
 *   - The loopback listener binds 127.0.0.1 only (enforced in the production
 *     adapter, never here) and is one-shot.
 *   - The authorization-server error (`?error=...`) is surfaced, never swallowed.
 *   - Tokens are returned to the caller for storage; this module never logs them.
 */

import {
  computeS256Challenge,
  generateCodeVerifier,
  generateState,
} from "./pkce.js";

/** Fixed loopback callback path -- the ephemeral port is chosen at runtime. */
export const CALLBACK_PATH = "/callback";

export const DEFAULT_SCOPE = "context_graph:read";

/** Thrown on any flow failure (CSRF mismatch, server error, bad response). */
export class OAuthFlowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OAuthFlowError";
  }
}

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
}

export interface CallbackResult {
  code: string | null;
  state: string | null;
  error: string | null;
}

export interface HttpResponse {
  statusCode: number;
  jsonBody: Record<string, unknown>;
}

/**
 * Minimal HTTP surface the flow needs against the OAuth server. The production
 * adapter binds redirects OFF so no unexpected hop happens; tests inject a fake
 * that replays canned server responses without a socket.
 */
export interface HttpTransportPort {
  postForm(url: string, data: Record<string, string>): Promise<HttpResponse>;
  postJson(url: string, jsonBody: Record<string, unknown>): Promise<HttpResponse>;
  getJson(url: string, headers: Record<string, string>): Promise<HttpResponse>;
}

// ── Dynamic client registration (RFC 7591) ──────────────────────────────────

/**
 * Register a PUBLIC (no-secret, PKCE) CLI client and return its `client_id`.
 *
 * `token_endpoint_auth_method="none"` -- a CLI is a public native app and must
 * not embed a client secret (RFC 8252 §8.5). The server accepts a
 * `http://127.0.0.1[:port]/...` loopback redirect.
 */
export async function registerPublicClient(args: {
  transport: HttpTransportPort;
  apiBase: string;
  redirectUri: string;
  clientName: string;
  scope?: string;
}): Promise<string> {
  const scope = args.scope ?? DEFAULT_SCOPE;
  const resp = await args.transport.postJson(`${args.apiBase}/oauth/register`, {
    redirect_uris: [args.redirectUri],
    client_name: args.clientName,
    grant_types: ["authorization_code", "refresh_token"],
    token_endpoint_auth_method: "none",
    scope,
  });
  if (resp.statusCode !== 201) {
    throw new OAuthFlowError(
      `Client registration failed (HTTP ${resp.statusCode}): ${errorSummary(resp.jsonBody)}`,
    );
  }
  const clientId = resp.jsonBody.client_id;
  if (typeof clientId !== "string" || !clientId) {
    throw new OAuthFlowError("Client registration returned no client_id.");
  }
  return clientId;
}

// ── Authorize URL construction ──────────────────────────────────────────────

export function buildAuthorizeUrl(args: {
  apiBase: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state: string;
  scope?: string;
}): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: args.clientId,
    redirect_uri: args.redirectUri,
    code_challenge: args.codeChallenge,
    code_challenge_method: "S256",
    scope: args.scope ?? DEFAULT_SCOPE,
    state: args.state,
  });
  return `${args.apiBase}/oauth/authorize?${params.toString()}`;
}

// ── Token exchange ──────────────────────────────────────────────────────────

/**
 * Exchange an authorization `code` + PKCE `codeVerifier` for tokens via the
 * `authorization_code` grant at `POST /oauth/token`. Without the verifier the
 * server returns `invalid_grant`.
 */
export async function exchangeCodeForTokens(args: {
  transport: HttpTransportPort;
  apiBase: string;
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<TokenSet> {
  const resp = await args.transport.postForm(`${args.apiBase}/oauth/token`, {
    grant_type: "authorization_code",
    client_id: args.clientId,
    code: args.code,
    redirect_uri: args.redirectUri,
    code_verifier: args.codeVerifier,
  });
  return parseTokenResponse(resp);
}

/** Exchange a `refresh_token` for a fresh access+refresh pair. */
export async function refreshTokens(args: {
  transport: HttpTransportPort;
  apiBase: string;
  clientId: string;
  refreshToken: string;
}): Promise<TokenSet> {
  const resp = await args.transport.postForm(`${args.apiBase}/oauth/token`, {
    grant_type: "refresh_token",
    client_id: args.clientId,
    refresh_token: args.refreshToken,
  });
  return parseTokenResponse(resp);
}

function parseTokenResponse(resp: HttpResponse): TokenSet {
  if (resp.statusCode !== 200) {
    throw new OAuthFlowError(
      `Token exchange failed (HTTP ${resp.statusCode}): ${errorSummary(resp.jsonBody)}`,
    );
  }
  const body = resp.jsonBody;
  const accessToken = body.access_token;
  const refreshToken = body.refresh_token;
  const expiresIn = body.expires_in;
  if (typeof accessToken !== "string" || !accessToken) {
    throw new OAuthFlowError("Token response missing access_token.");
  }
  if (typeof refreshToken !== "string" || !refreshToken) {
    throw new OAuthFlowError("Token response missing refresh_token.");
  }
  if (typeof expiresIn !== "number" || !Number.isFinite(expiresIn)) {
    throw new OAuthFlowError("Token response missing a numeric expires_in.");
  }
  return {
    accessToken,
    refreshToken,
    expiresIn,
    tokenType: typeof body.token_type === "string" ? body.token_type : "Bearer",
    scope: typeof body.scope === "string" ? body.scope : "",
  };
}

function errorSummary(body: Record<string, unknown>): string {
  const error = body.error;
  const desc = body.error_description;
  if (error && desc) return `${String(error)}: ${String(desc)}`;
  if (error) return String(error);
  return "no error detail";
}

// ── Flow orchestration ──────────────────────────────────────────────────────

export interface LoginResult {
  tokens: TokenSet;
  clientId: string;
}

/**
 * Drive the full loopback + PKCE authorization-code flow.
 *
 *   1. Register a public client (unless clientId was supplied).
 *   2. Generate PKCE verifier/challenge + a CSRF `state`.
 *   3. Present the authorize URL via openAuthorizeUrl (browser or print).
 *   4. Block on waitForCallback for the loopback redirect.
 *   5. Verify `state` (CSRF) and surface any `?error=`.
 *   6. Exchange `code` + verifier at the token endpoint.
 *
 * A `state` mismatch throws `OAuthFlowError` BEFORE any token exchange -- this is
 * the CSRF control (RED-verified in the test suite).
 */
export async function runLoginFlow(args: {
  transport: HttpTransportPort;
  apiBase: string;
  redirectUri: string;
  clientName: string;
  openAuthorizeUrl: (url: string) => void | Promise<void>;
  waitForCallback: () => Promise<CallbackResult>;
  clientId?: string;
  scope?: string;
}): Promise<LoginResult> {
  const scope = args.scope ?? DEFAULT_SCOPE;

  let clientId = args.clientId;
  if (clientId === undefined) {
    clientId = await registerPublicClient({
      transport: args.transport,
      apiBase: args.apiBase,
      redirectUri: args.redirectUri,
      clientName: args.clientName,
      scope,
    });
  }

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = computeS256Challenge(codeVerifier);
  const state = generateState();

  const authorizeUrl = buildAuthorizeUrl({
    apiBase: args.apiBase,
    clientId,
    redirectUri: args.redirectUri,
    codeChallenge,
    state,
    scope,
  });

  await args.openAuthorizeUrl(authorizeUrl);

  const result = await args.waitForCallback();

  if (result.error) {
    throw new OAuthFlowError(`Authorization was denied or failed: ${result.error}`);
  }

  // CSRF: the state returned by the browser MUST equal the one we minted.
  if (result.state !== state) {
    throw new OAuthFlowError(
      "State mismatch on the loopback redirect -- possible CSRF; aborting without exchanging the code.",
    );
  }

  if (!result.code) {
    throw new OAuthFlowError("Authorization server returned no code.");
  }

  const tokens = await exchangeCodeForTokens({
    transport: args.transport,
    apiBase: args.apiBase,
    clientId,
    code: result.code,
    codeVerifier,
    redirectUri: args.redirectUri,
  });
  return { tokens, clientId };
}
