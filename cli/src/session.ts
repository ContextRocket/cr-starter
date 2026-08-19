/**
 * Session helpers: silent refresh + local token-claim inspection.
 *
 * `ensureFreshAccessToken` is the one place callers get a usable access token --
 * it transparently swaps an expired token via the refresh grant and re-persists
 * the rotated pair. `decodeUnverifiedClaims` reads the JWT payload for DISPLAY
 * only (whoami); it never trusts the signature -- the server is the sole
 * authority on token validity.
 */

import {
  isAccessExpired,
  saveCredentials,
  type StoredCredentials,
} from "./credentials.js";
import { refreshTokens, type HttpTransportPort } from "./oauth-flow.js";

/**
 * Return credentials with a non-expired access token, refreshing if needed.
 *
 * When the access token is expired (or within the refresh leeway) the
 * `refresh_token` grant is exchanged for a fresh pair, which is re-persisted
 * (dir 0700 / file 0600) unless `persist` is false. If the refresh itself fails
 * the underlying `OAuthFlowError` propagates -- there is NO silent fallback to
 * the stale token.
 */
export async function ensureFreshAccessToken(args: {
  creds: StoredCredentials;
  transport: HttpTransportPort;
  now: number;
  home: string;
  persist?: boolean;
}): Promise<StoredCredentials> {
  const { creds, transport, now, home } = args;
  const persist = args.persist ?? true;

  if (!isAccessExpired(creds, now)) {
    return creds;
  }

  const tokens = await refreshTokens({
    transport,
    apiBase: creds.apiBase,
    clientId: creds.clientId,
    refreshToken: creds.refreshToken,
  });
  const refreshed: StoredCredentials = {
    apiBase: creds.apiBase,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: now + tokens.expiresIn,
    tokenType: tokens.tokenType,
    scope: tokens.scope || creds.scope,
    clientId: creds.clientId,
    // A refresh does not re-mint the /api USER JWT; keep the stored one.
    apiToken: creds.apiToken,
  };
  if (persist) {
    saveCredentials(home, refreshed);
  }
  return refreshed;
}

/**
 * Return the JWT payload WITHOUT verifying the signature (display only).
 *
 * Used by `whoami` to show which org/scope/client a token was issued for.
 * Returns an empty object for a non-JWT / malformed token -- a display
 * convenience, never a trust decision.
 */
export function decodeUnverifiedClaims(token: string): Record<string, unknown> {
  const parts = token.split(".");
  if (parts.length !== 3) return {};
  const payloadB64 = parts[1];
  try {
    const decoded = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const claims = JSON.parse(decoded);
    return typeof claims === "object" && claims !== null ? claims : {};
  } catch {
    return {};
  }
}

/** Return a wall-clock POSIX-timestamp (seconds) callable (injectable for tests). */
export function buildDefaultClock(): () => number {
  return () => Date.now() / 1000;
}
