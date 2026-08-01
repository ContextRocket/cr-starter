/**
 * cr-sdk -- configuration resolution.
 *
 * Reads the ContextRocket-specific env vars and returns a typed config
 * object consumed by createCRClient.  All values have safe defaults so the
 * module does not throw on import in test or build environments.
 *
 * Env vars (set in .env.example / .env.local):
 *   NEXT_PUBLIC_CR_AGENT_URL  -- A2A endpoint of the ContextRocket backend.
 *   NEXT_PUBLIC_CR_ORG_KEY    -- Machine credential key for the org (optional;
 *                                 omit to use guest auth).
 *   NEXT_PUBLIC_BACKEND_ENABLED -- "true" to enable the local fastapi-users
 *                                   backend for user management.
 *   NEXT_PUBLIC_BACKEND_URL   -- Base URL of the local backend (default 8100).
 */

export interface CRConfig {
  /** Base URL of the ContextRocket A2A agent endpoint. */
  agentUrl: string;
  /** Optional org machine credential key. */
  orgKey: string | undefined;
  /** Whether the local fastapi-users backend is enabled. */
  backendEnabled: boolean;
  /** Base URL of the local backend (used for guest auth, user management). */
  backendUrl: string;
}

const DEFAULT_BACKEND_URL = "http://localhost:8100";

/**
 * Resolve the CR config from environment variables.
 * Safe to call at module scope or inside a component.
 */
export function resolveCRConfig(): CRConfig {
  const agentUrl =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CR_AGENT_URL) ||
    "";
  const orgKey =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CR_ORG_KEY) ||
    undefined;
  const backendEnabled =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_BACKEND_ENABLED === "true";
  const backendUrl =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
    DEFAULT_BACKEND_URL;

  return {
    agentUrl: agentUrl.replace(/\/$/, ""),
    orgKey: orgKey || undefined,
    backendEnabled,
    backendUrl: backendUrl.replace(/\/$/, ""),
  };
}
