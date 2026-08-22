/**
 * Public ContextRocket configuration for the Next/static starter.
 *
 * The starter never provisions a local user or stores an auth token. Browser
 * chat is either deterministic canned data (`demo`, the default) or a direct
 * A2A connection (`live`) to ContextRocket.
 */

export type CRChatMode = "demo" | "live";

export interface CRConfig {
  /** Base URL of the ContextRocket A2A API. */
  agentUrl: string;
  /** Public organization handle sent as metadata.handle. */
  handle: string | undefined;
  /** Website API key, never a server-side secret. */
  apiKey: string | undefined;
  /** `demo` keeps static exports self-contained; `live` uses browser A2A. */
  mode: CRChatMode;
}

function readEnv(name: string): string {
  return typeof process !== "undefined" ? (process.env[name] ?? "") : "";
}

export function resolveCRConfig(): CRConfig {
  const mode = readEnv("NEXT_PUBLIC_CR_CHAT_MODE");
  const handle = readEnv("NEXT_PUBLIC_CONTEXTROCKET_HANDLE") || "contextrocket";
  return {
    agentUrl: (
      readEnv("NEXT_PUBLIC_CR_AGENT_URL") || "https://app-api.contextrocket.com"
    ).replace(/\/$/, ""),
    handle: handle || undefined,
    apiKey: readEnv("NEXT_PUBLIC_CONTEXTROCKET_API_KEY") || undefined,
    mode: mode === "live" ? "live" : "demo",
  };
}
