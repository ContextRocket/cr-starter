/**
 * `contextrocket` -- the gcloud-style operator CLI (Node/TypeScript port).
 *
 *   contextrocket auth login                     # loopback + PKCE, opens browser
 *   contextrocket auth login --no-launch-browser # prints the URL instead
 *   contextrocket auth print-access-token        # prints a fresh access token
 *   contextrocket auth whoami                     # shows the signed-in context
 *   contextrocket auth logout                     # deletes stored credentials
 *   contextrocket content <cp|sync|ls|rm|cat|query>
 *   contextrocket admin <create-org|create-user>
 *   contextrocket sites publish --org <handle> --dir <built out/ dir>
 *   contextrocket sources <ls|upload|download|rm> --org <handle> ...
 *
 * The auth flow is RFC 8252 (native app + loopback redirect) against the MCP
 * OAuth 2.1 authorization server (/oauth/authorize -> /oauth/token). The browser
 * step signs the user in via the normal web session and approves the consent
 * screen; the loopback catches the resulting `code` and the CLI exchanges it
 * (with the PKCE `code_verifier`) for an MCP access + refresh token pair. Tokens
 * are stored under ~/.contextrocket/credentials.json (dir 0700 / file 0600).
 *
 * SECURITY: PKCE S256 is mandatory, the loopback binds 127.0.0.1 only, `state`
 * is verified against the redirect (CSRF), and tokens are never printed except
 * by `print-access-token`. Flow logic lives in the injectable-seam modules so it
 * is tested without a real browser or network.
 */

import { homedir } from "node:os";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

import * as branding from "./branding.js";
import { parseContentAddress, normalizeContentFolderPath } from "./address.js";
import { SiteDirError, tarStaticExport } from "./site-tar.js";
import * as creds from "./credentials.js";
import * as oauthFlow from "./oauth-flow.js";
import * as session from "./session.js";
import {
  ApiRequestError,
  AuthenticatedApiClient,
  NotLoggedInError,
  type RestTransportPort,
} from "./api-client.js";
import {
  FetchRestTransport,
  FetchTransport,
  LoopbackListener,
  openSystemBrowser,
} from "./adapters.js";

// The CLI targets PRODUCTION by default; `--local` switches to the dev backend.
const PRODUCTION_API_BASE = "https://app-api.contextrocket.com";
const LOCAL_API_BASE = "http://localhost:8000";
const CLIENT_NAME = "ContextRocket CLI";
const ENV_API_BASE = "CONTEXTROCKET_API_BASE";
// Non-interactive (CI / GitHub Actions) auth: a `crk_` org machine credential
// used directly as the REST bearer, bypassing the OAuth credential store. OAuth
// loopback cannot run headless, so this is how `contextrocket sites publish`
// (+ content routes) authorize in CI. See buildApiClient.
const ENV_API_KEY = "CONTEXTROCKET_API_KEY";

const { println, eprintln, printFooter } = branding;

/** Injectable so tests never open a socket. Production builds a FetchRestTransport. */
export let buildRestTransport: () => RestTransportPort = () => new FetchRestTransport();

/** Test seam: override the REST transport factory. */
export function setRestTransportFactory(fn: () => RestTransportPort): void {
  buildRestTransport = fn;
}

export interface GlobalOpts {
  apiBase?: string;
  /** `--local`: target the localhost dev backend instead of production. */
  local?: boolean;
}

/**
 * Resolve the backend target. Precedence (highest first):
 *   1. explicit `--api-base <url>`
 *   2. `CONTEXTROCKET_API_BASE` env
 *   3. `--local` (localhost:8000)
 *   4. default (production)
 * An explicit base (flag or env) always wins over `--local`. Trailing slash trimmed.
 */
export function resolveApiBase(opts: GlobalOpts): string {
  const base =
    opts.apiBase ||
    process.env[ENV_API_BASE] ||
    (opts.local ? LOCAL_API_BASE : PRODUCTION_API_BASE);
  return base.replace(/\/+$/, "");
}

function home(): string {
  return process.env.CONTEXTROCKET_HOME || homedir();
}

// ── Token-plane: mcp_access OAuth token -> fastapi-users USER JWT exchange ────

export class OAuthCliExchangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OAuthCliExchangeError";
  }
}

/**
 * Exchange a fresh mcp_access token for a fastapi-users USER JWT via
 * `POST /api/auth/oauth-cli-exchange`. Throws `OAuthCliExchangeError` on any
 * non-2xx / malformed response -- the caller decides how to surface it.
 */
export async function exchangeForApiToken(args: {
  apiBase: string;
  accessToken: string;
  transport?: RestTransportPort;
}): Promise<string> {
  const transport = args.transport ?? buildRestTransport();
  const resp = await transport.request(
    "POST",
    `${args.apiBase.replace(/\/+$/, "")}/api/auth/oauth-cli-exchange`,
    { headers: { Authorization: `Bearer ${args.accessToken}` } },
  );
  if (!(resp.statusCode >= 200 && resp.statusCode < 300)) {
    const detail = resp.jsonBody?.detail;
    throw new OAuthCliExchangeError(
      `HTTP ${resp.statusCode}: ${typeof detail === "string" ? detail : "exchange failed"}`,
    );
  }
  const token = resp.jsonBody?.access_token;
  if (typeof token !== "string" || !token) {
    throw new OAuthCliExchangeError("exchange response missing access_token");
  }
  return token;
}

// ── auth login ───────────────────────────────────────────────────────────────

export async function cmdAuthLogin(
  opts: GlobalOpts & { noLaunchBrowser?: boolean },
  deps?: {
    transport?: oauthFlow.HttpTransportPort;
    listener?: { allocate(): Promise<number>; waitForCallback(): Promise<oauthFlow.CallbackResult> };
    exchange?: typeof exchangeForApiToken;
    /** Browser-open seam -- injected so tests can assert it is NOT called on --no-launch-browser. */
    browserOpener?: (url: string) => void;
    /** Test hook: observe the authorize URL AFTER it is presented (e.g. to capture `state`). */
    onAuthorizeUrl?: (url: string) => void;
    now?: number;
  },
): Promise<number> {
  const apiBase = resolveApiBase(opts);
  const transport = deps?.transport ?? new FetchTransport();
  const listener = deps?.listener ?? new LoopbackListener();
  const browserOpener = deps?.browserOpener ?? openSystemBrowser;

  // Reserve the ephemeral loopback port FIRST so the redirect_uri we register is
  // byte-for-byte the one the server exact-matches on token exchange.
  const port = await listener.allocate();
  const redirectUri = `http://127.0.0.1:${port}${oauthFlow.CALLBACK_PATH}`;

  const openAuthorizeUrl = (url: string) => {
    if (opts.noLaunchBrowser) {
      // --no-launch-browser: print the URL, do NOT auto-open the browser.
      println(
        "Open this URL in your browser to authorize the ContextRocket CLI:\n\n" +
          `    ${url}\n\n` +
          "Waiting for you to complete sign-in...",
      );
    } else {
      eprintln("Opening your browser to authorize the ContextRocket CLI...");
      eprintln(`If it does not open, visit:\n\n    ${url}\n`);
      browserOpener(url);
    }
    deps?.onAuthorizeUrl?.(url);
  };

  let result: oauthFlow.LoginResult;
  try {
    result = await oauthFlow.runLoginFlow({
      transport,
      apiBase,
      redirectUri,
      clientName: CLIENT_NAME,
      openAuthorizeUrl,
      waitForCallback: () => listener.waitForCallback(),
    });
  } catch (err) {
    eprintln(`Login failed: ${(err as Error).message}`);
    return 1;
  }

  const now = deps?.now ?? session.buildDefaultClock()();

  // Two-token plane: exchange the mcp_access token for a USER JWT for the /api
  // content + admin routes. A failed exchange is surfaced (no silent fallback)
  // but does not discard the successful OAuth login -- the MCP surface still works.
  let apiToken = "";
  const exchange = deps?.exchange ?? exchangeForApiToken;
  try {
    apiToken = await exchange({ apiBase, accessToken: result.tokens.accessToken });
  } catch (err) {
    eprintln(
      `Warning: signed in, but could not obtain an API token for the content/admin surface: ${(err as Error).message}\n` +
        "The MCP surface still works; re-run 'contextrocket auth login' to retry the API-token exchange.",
    );
  }

  const stored: creds.StoredCredentials = {
    apiBase,
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken,
    expiresAt: now + result.tokens.expiresIn,
    tokenType: result.tokens.tokenType,
    scope: result.tokens.scope,
    clientId: result.clientId,
    apiToken,
  };
  const path = creds.saveCredentials(home(), stored);

  const claims = session.decodeUnverifiedClaims(stored.accessToken);
  const orgId = claims.org_id;
  // Signing in the operator/agent principal is a Lobster (🦞) moment.
  eprintln(`\n${branding.success(`${branding.LOBSTER} Login successful.`)}`);
  eprintln(`  API base: ${apiBase}`);
  if (orgId) eprintln(`  Org:      ${String(orgId)}`);
  if (stored.scope) eprintln(`  Scope:    ${stored.scope}`);
  eprintln(`  ${branding.KEY} Stored:   ${path}`);
  printFooter();
  return 0;
}

// ── auth print-access-token ────────────────────────────────────────────────

export async function cmdAuthPrintAccessToken(
  opts: GlobalOpts,
  deps?: { transport?: oauthFlow.HttpTransportPort; now?: number },
): Promise<number> {
  const h = home();
  let loaded: creds.StoredCredentials;
  try {
    loaded = creds.loadCredentials(h);
  } catch (err) {
    eprintln((err as Error).message);
    return 1;
  }

  const transport = deps?.transport ?? new FetchTransport();
  const now = deps?.now ?? session.buildDefaultClock()();
  let fresh: creds.StoredCredentials;
  try {
    fresh = await session.ensureFreshAccessToken({ creds: loaded, transport, now, home: h });
  } catch (err) {
    eprintln(
      `Could not refresh the access token: ${(err as Error).message}\n` +
        "Run 'contextrocket auth login' again.",
    );
    return 1;
  }

  // The ONE command that intentionally prints the token. stdout stays the RAW
  // token only (scripts capture it); branding goes to stderr.
  println(fresh.accessToken);
  printFooter();
  return 0;
}

// ── auth whoami ──────────────────────────────────────────────────────────────

export function cmdAuthWhoami(opts: GlobalOpts, deps?: { now?: number }): number {
  const h = home();
  let loaded: creds.StoredCredentials;
  try {
    loaded = creds.loadCredentials(h);
  } catch (err) {
    eprintln((err as Error).message);
    return 1;
  }

  const claims = session.decodeUnverifiedClaims(loaded.accessToken);
  const now = deps?.now ?? session.buildDefaultClock()();
  const expired = creds.isAccessExpired(loaded, now, 0.0);

  // The base captured at login vs. the target THIS invocation resolves to
  // (default production, or `--local` / `--api-base` / env override) -- surface
  // the resolved target when it differs so the user sees which backend they hit.
  const target = resolveApiBase(opts);

  eprintln(`${branding.LOBSTER} Signed in to the ContextRocket CLI.`);
  eprintln(`  API base:      ${loaded.apiBase}`);
  if (target !== loaded.apiBase) eprintln(`  Target:        ${target} (this invocation)`);
  if (loaded.clientId) eprintln(`  Client:        ${loaded.clientId}`);
  const orgId = claims.org_id;
  if (orgId) eprintln(`  Org:           ${String(orgId)}`);
  if (loaded.scope) eprintln(`  Scope:         ${loaded.scope}`);
  eprintln(`  Access token:  ${expired ? "expired (refresh on next use)" : "valid"}`);
  return 0;
}

// ── auth logout ──────────────────────────────────────────────────────────────

export function cmdAuthLogout(_opts: GlobalOpts): number {
  const removed = creds.deleteCredentials(home());
  eprintln(removed ? "Logged out. Stored credentials removed." : "Already logged out (no stored credentials).");
  return 0;
}

// ── content <cp|sync|ls|rm|cat|query> ────────────────────────────────────────

function buildApiClient(opts: GlobalOpts): AuthenticatedApiClient {
  // An EXPLICIT target selection (`--api-base` or `--local`) overrides the base
  // captured at login; with neither, content/admin calls hit the base you logged
  // into (the stored creds' apiBase). This keeps `--local` honest -- it redirects
  // content/admin calls to localhost, not just the OAuth plane.
  const explicitBase =
    opts.apiBase || opts.local ? resolveApiBase(opts) : null;

  // Non-interactive (CI) path: when CONTEXTROCKET_API_KEY is set, use the `crk_`
  // org machine credential directly and SKIP the OAuth credential store -- no
  // browser, no ~/.contextrocket/credentials.json needed. Fail-closed if the
  // env var is set-but-empty. When unset, fall through to the stored USER JWT
  // (which itself fails closed with NotLoggedInError if not logged in).
  const envKey = process.env[ENV_API_KEY];
  if (envKey !== undefined && envKey.trim() !== "") {
    return AuthenticatedApiClient.fromEnvKey({
      apiKey: envKey,
      apiBase: resolveApiBase(opts),
      transport: buildRestTransport(),
      apiBaseOverride: explicitBase,
    });
  }
  return AuthenticatedApiClient.fromStored(home(), {
    transport: buildRestTransport(),
    apiBaseOverride: explicitBase,
  });
}

function parseAddress(remote: string) {
  // ContentAddressError is already an Error subclass with an operator-facing
  // message; callers catch generic Error and read `.message`. Rethrow as-is.
  return parseContentAddress(remote);
}

export async function cmdContentCp(opts: GlobalOpts, source: string, dest: string): Promise<number> {
  const sourceRemote = source.toLowerCase().startsWith("cr://");
  const destRemote = dest.toLowerCase().startsWith("cr://");
  if (sourceRemote === destRemote) {
    eprintln("error: cp needs exactly one cr:// side (local->cr:// upload, or cr://->local download)");
    return 2;
  }

  const isUpload = destRemote;
  const remote = isUpload ? dest : source;
  let addr;
  try {
    addr = parseAddress(remote);
  } catch (err) {
    eprintln(`error: ${(err as Error).message}`);
    return 2;
  }
  if (addr.filename === null) {
    eprintln(`error: cp requires a filename in '${remote}' (not a folder)`);
    return 2;
  }

  let client: AuthenticatedApiClient;
  try {
    client = buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  const base = `api/orgs/${addr.bucket}/content`;
  try {
    if (isUpload) {
      const localPath = resolve(source);
      if (!existsSync(localPath) || !statSync(localPath).isFile()) {
        eprintln(`error: local file not found: ${localPath}`);
        return 2;
      }
      const resp = AuthenticatedApiClient.raiseForStatus(
        await client.postFile(base, {
          files: { file: [addr.filename, readFileSync(localPath)] },
          form: { folder_path: addr.folderPath, filename: addr.filename },
        }),
      );
      const body = resp.jsonBody;
      eprintln(
        `${branding.BRAIN} uploaded ${addr.filename} -> ${String(body.address)} ` +
          `(bytes=${String(body.byte_size)} chunks=${String(body.chunk_count)} created=${String(body.created)})`,
      );
      printFooter();
      return 0;
    }

    // download
    const resp = AuthenticatedApiClient.raiseForStatus(
      await client.get(`${base}/object`, { filename: addr.filename, folder_path: addr.folderPath }),
    );
    const outPath = resolve(dest);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, resp.content);
    eprintln(`${branding.BRAIN} downloaded ${remote} -> ${outPath} (bytes=${resp.content.length})`);
    printFooter();
    return 0;
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
}

export async function cmdContentCat(opts: GlobalOpts, address: string): Promise<number> {
  let addr;
  try {
    addr = parseAddress(address);
  } catch (err) {
    eprintln(`error: ${(err as Error).message}`);
    return 2;
  }
  if (addr.filename === null) {
    eprintln("error: cat requires a filename, not a folder");
    return 2;
  }

  let client: AuthenticatedApiClient;
  try {
    client = buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  let resp;
  try {
    resp = AuthenticatedApiClient.raiseForStatus(
      await client.get(`api/orgs/${addr.bucket}/content/object`, {
        filename: addr.filename,
        folder_path: addr.folderPath,
      }),
    );
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  // stdout stays the RAW bytes only (pipeable); branding to stderr.
  process.stdout.write(resp.content);
  printFooter();
  return 0;
}

export async function cmdContentLs(opts: GlobalOpts, address: string): Promise<number> {
  let addr;
  try {
    addr = parseAddress(address);
  } catch (err) {
    eprintln(`error: ${(err as Error).message}`);
    return 2;
  }

  let client: AuthenticatedApiClient;
  try {
    client = buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  const prefix = addr.folderPath || addr.filename || "";
  const params = prefix ? { prefix } : undefined;
  let resp;
  try {
    resp = AuthenticatedApiClient.raiseForStatus(await client.get(`api/orgs/${addr.bucket}/content`, params));
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  const objects = (resp.jsonBody.objects as Array<Record<string, unknown>>) ?? [];
  if (objects.length === 0) {
    eprintln(`(empty) ${address}`);
    return 0;
  }
  for (const obj of objects) {
    const size = String(obj.byte_size ?? 0).padStart(10);
    println(`${size}  ${String(obj.address)}`);
  }
  return 0;
}

export async function cmdContentRm(opts: GlobalOpts, address: string): Promise<number> {
  let addr;
  try {
    addr = parseAddress(address);
  } catch (err) {
    eprintln(`error: ${(err as Error).message}`);
    return 2;
  }

  let client: AuthenticatedApiClient;
  try {
    client = buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  const params: Record<string, string> = { folder_path: addr.folderPath };
  if (addr.filename !== null) params.filename = addr.filename;
  let resp;
  try {
    resp = AuthenticatedApiClient.raiseForStatus(await client.delete(`api/orgs/${addr.bucket}/content`, params));
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  const body = resp.jsonBody;
  eprintln(
    `${branding.BRAIN} removed ${String(body.rows_deleted)} object(s) at ${address}: ` +
      `bytes=${String(body.bytes_deleted)} chunks=${String(body.chunks_deleted)}`,
  );
  printFooter();
  return 0;
}

export async function cmdContentSync(opts: GlobalOpts, source: string, dest: string): Promise<number> {
  let addr;
  try {
    addr = parseAddress(dest);
  } catch (err) {
    eprintln(`error: ${(err as Error).message}`);
    return 2;
  }
  if (addr.filename !== null) {
    eprintln("error: sync dest must be a folder/prefix, not a filename");
    return 2;
  }

  const localDir = resolve(source);
  if (!existsSync(localDir) || !statSync(localDir).isDirectory()) {
    eprintln(`error: local dir not found: ${localDir}`);
    return 2;
  }

  let client: AuthenticatedApiClient;
  try {
    client = buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  const base = `api/orgs/${addr.bucket}/content`;
  const files = walkFiles(localDir).sort();
  let total = 0;
  let uploaded = 0;
  let failed = 0;
  for (const path of files) {
    total += 1;
    const rel = path.slice(localDir.length + 1);
    const relParts = rel.split("/");
    const relFolder = relParts.slice(0, -1).join("/");
    const folder = normalizeContentFolderPath(
      relFolder ? `${addr.folderPath}/${relFolder}` : addr.folderPath,
    );
    try {
      const resp = await client.postFile(base, {
        files: { file: [relParts[relParts.length - 1], readFileSync(path)] },
        form: { folder_path: folder, filename: relParts[relParts.length - 1] },
      });
      AuthenticatedApiClient.raiseForStatus(resp);
      uploaded += 1;
      println(`  ${"ok".padEnd(6)} ${rel}  ->  ${String(resp.jsonBody.address ?? "-")}`);
    } catch (err) {
      failed += 1;
      const code = err instanceof ApiRequestError ? err.errorCode : (err as Error).message;
      eprintln(`  ${"FAIL".padEnd(6)} ${rel}  ->  ${code}`);
    }
  }
  eprintln(`sync complete: total=${total} uploaded=${uploaded} failed=${failed}`);
  printFooter();
  return failed === 0 ? 0 : 1;
}

export function cmdContentQuery(_opts: GlobalOpts): number {
  // No authenticated REST endpoint for semantic content search yet. Fail loudly
  // with a typed message rather than silently dropping to a DB path.
  eprintln(
    "error: 'contextrocket content query' is not yet available over the authenticated API " +
      "(no REST search route). Use the operator CLI 'python -m commands.content query ...' for a " +
      "DB-backed search, or file a request to expose /api/orgs/{org}/content/query.",
  );
  return 2;
}

// ── sources <ls|upload|download|rm> ─────────────────────────────────────────

/** The source types accepted by ContextRocket's file-upload route. */
export const SOURCE_TYPES = [
  "uploaded_document",
  "uploaded_asset",
  "profile_export",
  "cv",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];
export type SourceContextScope = "company" | "personal";

function isSourceType(value: string): value is SourceType {
  return (SOURCE_TYPES as readonly string[]).includes(value);
}

function sourceArgError(message: string): number {
  eprintln(`error: ${message}`);
  return 2;
}

function requireSourceClient(opts: GlobalOpts): AuthenticatedApiClient | null {
  try {
    return buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return null;
    }
    throw err;
  }
}

/** List source records. stdout is intentionally line-oriented and scriptable. */
export async function cmdSourcesLs(
  opts: GlobalOpts,
  args: { org: string; limit?: string; offset?: string },
): Promise<number> {
  const client = requireSourceClient(opts);
  if (!client) return 1;
  const params: Record<string, string> = {};
  if (args.limit) params.limit = args.limit;
  if (args.offset) params.offset = args.offset;
  try {
    const response = AuthenticatedApiClient.raiseForStatus(
      await client.get(`api/orgs/${args.org}/sources`, params),
    );
    const items = Array.isArray(response.jsonBody.items) ? response.jsonBody.items : [];
    for (const item of items) {
      if (typeof item !== "object" || item === null) continue;
      const source = item as Record<string, unknown>;
      println(
        [source.id, source.source_type, source.title ?? source.normalized_url ?? "-"]
          .map((value) => String(value ?? "-"))
          .join("\t"),
      );
    }
    return 0;
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
}

/** Upload a local file into the source ingestion pipeline. */
export async function cmdSourcesUpload(
  opts: GlobalOpts,
  args: {
    org: string;
    file: string;
    sourceType: string;
    contextScope: string;
    description?: string;
  },
): Promise<number> {
  if (!isSourceType(args.sourceType)) {
    return sourceArgError(
      `unsupported source type '${args.sourceType}'; choose one of ${SOURCE_TYPES.join(", ")}`,
    );
  }
  if (args.contextScope !== "company" && args.contextScope !== "personal") {
    return sourceArgError("source context scope must be 'company' or 'personal'");
  }
  const localPath = resolve(args.file);
  if (!existsSync(localPath) || !statSync(localPath).isFile()) {
    return sourceArgError(`local file not found: ${localPath}`);
  }
  const client = requireSourceClient(opts);
  if (!client) return 1;
  const form: Record<string, string> = {
    source_type: args.sourceType,
    context_scope: args.contextScope,
  };
  if (args.description !== undefined) form.description = args.description;
  try {
    const response = AuthenticatedApiClient.raiseForStatus(
      await client.postFile(`api/orgs/${args.org}/sources/uploads/file`, {
        files: { file: [basename(localPath), readFileSync(localPath)] },
        form,
      }),
    );
    const source = response.jsonBody;
    const sourceId = String(source.id ?? "");
    eprintln(
      `${branding.BRAIN} uploaded ${basename(localPath)} ` +
        `(source_id=${sourceId || "-"}, type=${args.sourceType}, scope=${args.contextScope})`,
    );
    println(sourceId);
    printFooter();
    return sourceId ? 0 : 1;
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
}

/** Download the stored artifact for one uploaded source. */
export async function cmdSourcesDownload(
  opts: GlobalOpts,
  args: { org: string; id: string; out: string },
): Promise<number> {
  if (!args.id || args.id.includes("/") || args.id.includes("\\")) {
    return sourceArgError("source id must be a single path-safe identifier");
  }
  const client = requireSourceClient(opts);
  if (!client) return 1;
  try {
    const response = AuthenticatedApiClient.raiseForStatus(
      await client.get(`api/orgs/${args.org}/sources/documents/${args.id}`),
    );
    const output = resolve(args.out);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, response.content);
    eprintln(`${branding.BRAIN} downloaded source ${args.id} -> ${output} (bytes=${response.content.length})`);
    printFooter();
    return 0;
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
}

/** Delete one uploaded source and its stored artifact. */
export async function cmdSourcesRm(
  opts: GlobalOpts,
  args: { org: string; id: string },
): Promise<number> {
  if (!args.id || args.id.includes("/") || args.id.includes("\\")) {
    return sourceArgError("source id must be a single path-safe identifier");
  }
  const client = requireSourceClient(opts);
  if (!client) return 1;
  try {
    const response = AuthenticatedApiClient.raiseForStatus(
      await client.delete(`api/orgs/${args.org}/sources/${args.id}`),
    );
    eprintln(`${branding.BRAIN} removed source ${args.id} (bytes=${String(response.jsonBody.bytes_deleted ?? "?")})`);
    printFooter();
    return 0;
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
}

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

// ── sites publish ─────────────────────────────────────────────────────────────

/**
 * `contextrocket sites publish --org <handle> --dir <out>`
 *
 * Tars the built static export `<dir>` (sanity-checked to look like a static
 * `out/`: has `index.html`, no `_next/server`) and streams it to the GOVERNED
 * backend endpoint `POST /api/orgs/<handle>/sites/publish` with the stored Bearer
 * token. The backend -- which holds the AWS creds -- syncs it to the CDN so it
 * serves at `<handle>.cdn.contextrocket.com`. The customer never gets direct
 * CDN/S3 write access.
 *
 * Progress goes to stderr; the resulting site URL is the only stdout line
 * (scriptable). Fail-closed on not-logged-in / bad dir / non-2xx.
 */
export async function cmdSitesPublish(
  opts: GlobalOpts,
  args: { org: string; dir: string },
): Promise<number> {
  // 1) Build + validate the tarball locally (no network / auth needed yet).
  let archive: { bytes: Buffer; fileCount: number };
  try {
    eprintln(`${branding.BRAIN} archiving static export ${args.dir} ...`);
    archive = tarStaticExport(args.dir);
  } catch (err) {
    if (err instanceof SiteDirError) {
      eprintln(`error: ${err.message}`);
      return 2;
    }
    throw err;
  }
  eprintln(
    `  ${archive.fileCount} file(s) → ${archive.bytes.length} bytes (gzip)`,
  );

  // 2) Authenticated upload -- fail closed if not logged in.
  let client: AuthenticatedApiClient;
  try {
    client = buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  eprintln(`  uploading to ${args.org}.cdn.contextrocket.com via the backend ...`);
  let resp;
  try {
    resp = AuthenticatedApiClient.raiseForStatus(
      await client.postFile(`api/orgs/${args.org}/sites/publish`, {
        files: { tarball: ["site.tar.gz", archive.bytes] },
      }),
    );
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  const body = resp.jsonBody;
  const url = typeof body.url === "string" ? body.url : `https://${args.org}.cdn.contextrocket.com`;
  eprintln(
    `${branding.OK} published ${String(body.files ?? archive.fileCount)} file(s) ` +
      `(${String(body.bytes ?? "?")} bytes, invalidation=${String(body.invalidation_id ?? "-")})`,
  );
  // stdout: the site URL only (scriptable).
  println(url);
  printFooter();
  return 0;
}

// ── admin <create-org|create-user> ───────────────────────────────────────────

export async function cmdAdminCreateOrg(opts: GlobalOpts, slug: string, name: string): Promise<number> {
  let client: AuthenticatedApiClient;
  try {
    client = buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  let resp;
  try {
    resp = AuthenticatedApiClient.raiseForStatus(await client.postJson("api/admin/orgs", { slug, name }));
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  const body = resp.jsonBody;
  const verb = body.created ? "created" : "reused (idempotent)";
  eprintln(`${branding.OK} ${branding.BRAIN} org ${verb}: id=${String(body.org_id)} slug=${String(body.slug)}`);
  printFooter();
  return 0;
}

export async function cmdAdminCreateUser(
  opts: GlobalOpts,
  args: { orgSlug: string; email: string; password?: string; role: string },
): Promise<number> {
  let client: AuthenticatedApiClient;
  try {
    client = buildApiClient(opts);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }

  // Resolve the org slug -> id via the idempotent create-org route so the
  // user-create route (keyed by org_id) can be called AS the signed-in principal.
  let orgResp;
  try {
    orgResp = AuthenticatedApiClient.raiseForStatus(
      await client.postJson("api/admin/orgs", { slug: args.orgSlug, name: args.orgSlug }),
    );
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  const orgId = orgResp.jsonBody.org_id;

  let resp;
  try {
    const payload: Record<string, unknown> = { email: args.email, role: args.role };
    if (args.password !== undefined) payload.password = args.password;
    resp = AuthenticatedApiClient.raiseForStatus(
      await client.postJson(`api/admin/orgs/${String(orgId)}/users`, payload),
    );
  } catch (err) {
    if (err instanceof ApiRequestError) {
      eprintln(`error: ${err.message}`);
      return 1;
    }
    throw err;
  }
  const body = resp.jsonBody;
  const verb = body.created ? "created" : "reused (idempotent)";
  eprintln(
    `${branding.OK} ${branding.LOBSTER} user ${verb}: id=${String(body.user_id)} ` +
      `email=${String(body.email)} role=${String(body.role)} org_id=${String(body.org_id)}`,
  );
  printFooter();
  return 0;
}
