/**
 * PKCE (RFC 7636) helpers for the CLI native-app loopback flow.
 *
 * Standalone (no server imports) so the CLI has no runtime dependency on the
 * backend. The S256 derivation MUST match the server's
 * `compute_s256_challenge` -- the test suite pins both to the same known-answer
 * vector (`base64url(sha256(verifier))`, padding stripped).
 */

import { createHash, randomBytes } from "node:crypto";

/**
 * Return a URL-safe base64 string of `nBytes` random bytes, padding stripped --
 * the shape Python's `secrets.token_urlsafe` produces.
 */
function tokenUrlsafe(nBytes: number): string {
  return base64UrlNoPad(randomBytes(nBytes));
}

/** `base64url(bytes)` with `=` padding removed (RFC 7636 §4.2 / RFC 4648 §5). */
export function base64UrlNoPad(bytes: Buffer): string {
  return bytes
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * Return a high-entropy PKCE `code_verifier`.
 *
 * RFC 7636 §4.1 requires 43–128 unreserved characters; a URL-safe base64 of 64
 * random bytes yields ~86 characters of the right shape and entropy.
 */
export function generateCodeVerifier(nBytes = 64): string {
  return tokenUrlsafe(nBytes);
}

/**
 * Return `base64url(sha256(verifier))` with padding stripped (RFC 7636 §4.2).
 *
 * The verifier is hashed as ASCII bytes -- identical to the server's
 * `hashlib.sha256(code_verifier.encode("ascii"))`.
 */
export function computeS256Challenge(codeVerifier: string): string {
  const digest = createHash("sha256").update(codeVerifier, "ascii").digest();
  return base64UrlNoPad(digest);
}

/** Return a random, URL-safe CSRF `state` value. */
export function generateState(nBytes = 32): string {
  return tokenUrlsafe(nBytes);
}
