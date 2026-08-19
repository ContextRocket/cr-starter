/**
 * Local credential storage for the `contextrocket` CLI.
 *
 * Tokens persist to `~/.contextrocket/credentials.json` with strict permissions
 * (dir 0700, file 0600) so other local users cannot read the bearer material.
 * All I/O is confined here so callers stay testable with an injected home dir.
 *
 * SECURITY: tokens are never logged from this module. `toPublicDict()` redacts
 * so an accidental log of a credential does not leak the bearer.
 */

import {
  chmodSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeSync,
} from "node:fs";
import { join } from "node:path";

const CREDENTIALS_DIRNAME = ".contextrocket";
const CREDENTIALS_FILENAME = "credentials.json";

const DIR_MODE = 0o700;
const FILE_MODE = 0o600;

/** Thrown when stored credentials are missing or malformed (no token material). */
export class CredentialError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CredentialError";
  }
}

/**
 * The persisted OAuth token set plus the API base it was issued against.
 *
 * Two-token plane: `accessToken`/`refreshToken` are the MCP OAuth tokens
 * (audience-pinned to `/mcp`, scope `context_graph:read`) used for the MCP
 * surface and refresh. `apiToken` is the fastapi-users USER JWT obtained via
 * `POST /api/auth/oauth-cli-exchange` and sent as the REST bearer for the
 * content/admin subcommands. Empty `apiToken` means a login predating the
 * two-token plane -- subcommands raise a typed "re-run login", never a silent
 * fallback.
 */
export interface StoredCredentials {
  apiBase: string;
  accessToken: string;
  refreshToken: string;
  /** Absolute POSIX timestamp (seconds) at which accessToken expires. */
  expiresAt: number;
  tokenType: string;
  scope: string;
  clientId: string;
  apiToken: string;
}

/** Return True when the access token is at/near expiry (proactive-refresh leeway). */
export function isAccessExpired(
  creds: StoredCredentials,
  now: number,
  leewaySeconds = 30.0,
): boolean {
  return now >= creds.expiresAt - leewaySeconds;
}

/** A redacted, printable view -- never includes token material. */
export function toPublicDict(creds: StoredCredentials): Record<string, unknown> {
  return {
    apiBase: creds.apiBase,
    tokenType: creds.tokenType,
    scope: creds.scope,
    clientId: creds.clientId,
    expiresAt: creds.expiresAt,
  };
}

export function credentialsDir(home: string): string {
  return join(home, CREDENTIALS_DIRNAME);
}

export function credentialsPath(home: string): string {
  return join(credentialsDir(home), CREDENTIALS_FILENAME);
}

/**
 * Persist `creds` atomically with 0700 dir / 0600 file perms.
 *
 * The file is written to a temp sibling then renamed into place so a crash
 * mid-write never leaves a half-written credentials file. Perms are set BEFORE
 * the rename so the token bytes are never briefly world-readable.
 */
export function saveCredentials(home: string, creds: StoredCredentials): string {
  const directory = credentialsDir(home);
  mkdirSync(directory, { mode: DIR_MODE, recursive: true });
  // mkdir honours the umask on the mode; force the intended mode explicitly.
  chmodSync(directory, DIR_MODE);

  const target = credentialsPath(home);
  const tmp = target + ".tmp";

  const payload = {
    api_base: creds.apiBase,
    access_token: creds.accessToken,
    refresh_token: creds.refreshToken,
    expires_at: creds.expiresAt,
    token_type: creds.tokenType,
    scope: creds.scope,
    client_id: creds.clientId,
    api_token: creds.apiToken,
  };

  // Open with 0600 from the start; also chmod explicitly to be deterministic.
  const fd = openSync(tmp, "w", FILE_MODE);
  try {
    chmodSync(tmp, FILE_MODE);
    writeSync(fd, JSON.stringify(payload, Object.keys(payload).sort(), 2) + "\n");
  } catch (err) {
    try {
      closeSync(fd);
    } catch {
      /* ignore */
    }
    try {
      unlinkSync(tmp);
    } catch {
      /* ignore */
    }
    throw err;
  }
  closeSync(fd);

  renameSync(tmp, target);
  chmodSync(target, FILE_MODE);
  return target;
}

/**
 * Load and validate stored credentials.
 *
 * Throws `CredentialError` when the file is absent or malformed. The message is
 * safe to surface -- it carries no token material.
 */
export function loadCredentials(home: string): StoredCredentials {
  const path = credentialsPath(home);
  if (!existsSync(path)) {
    throw new CredentialError("Not logged in. Run 'contextrocket auth login' first.");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    throw new CredentialError(
      "Stored credentials are unreadable or corrupt; run 'contextrocket auth login' again.",
    );
  }

  if (typeof raw !== "object" || raw === null) {
    throw new CredentialError("Stored credentials are corrupt.");
  }

  const obj = raw as Record<string, unknown>;
  const apiBase = obj.api_base;
  const accessToken = obj.access_token;
  const refreshToken = obj.refresh_token;
  const expiresAt = obj.expires_at;
  if (
    typeof apiBase !== "string" ||
    typeof accessToken !== "string" ||
    typeof refreshToken !== "string" ||
    typeof expiresAt !== "number"
  ) {
    throw new CredentialError(
      "Stored credentials are missing required fields; run 'contextrocket auth login' again.",
    );
  }

  return {
    apiBase,
    accessToken,
    refreshToken,
    expiresAt,
    tokenType: typeof obj.token_type === "string" ? obj.token_type : "Bearer",
    scope: typeof obj.scope === "string" ? obj.scope : "",
    clientId: typeof obj.client_id === "string" ? obj.client_id : "",
    apiToken: typeof obj.api_token === "string" ? obj.api_token : "",
  };
}

/** Remove the credentials file. Returns True if a file was deleted. */
export function deleteCredentials(home: string): boolean {
  const path = credentialsPath(home);
  try {
    unlinkSync(path);
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw err;
  }
}

/** Return the permission bits of the credentials file (for verification). */
export function fileMode(home: string): number {
  return statSync(credentialsPath(home)).mode & 0o777;
}
