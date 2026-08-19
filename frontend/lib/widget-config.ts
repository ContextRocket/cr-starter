/**
 * Compatibility parser for the optional `/embed` page.
 *
 * The primary widget is the standalone Shadow DOM bundle in
 * `clients/embed-widget`; this parser keeps the Next route useful for hosts
 * that prefer an iframe while using the same public naming and demo/live
 * modes.
 */

export interface WidgetConfig {
  mode: "demo" | "live";
  agentUrl: string | null;
  handle: string | null;
  apiKey: string | null;
  title: string | null;
}

export function parseWidgetConfig(params: {
  get(key: string): string | null;
}): WidgetConfig {
  const mode = params.get("mode") === "live" ? "live" : "demo";
  const agentUrl = params.get("agent-url");
  const handle = params.get("contextrocket-handle");
  const apiKey = params.get("api-key");
  return {
    mode,
    agentUrl: agentUrl ? agentUrl.replace(/\/$/, "") : null,
    handle: handle || null,
    apiKey: apiKey || null,
    title: params.get("title") || null,
  };
}

export function isAllowedAgentUrl(
  candidate: string,
  configuredAgentUrl: string | null | undefined,
): boolean {
  if (!configuredAgentUrl) return false;
  try {
    const candidateUrl = new URL(candidate);
    const configuredUrl = new URL(configuredAgentUrl);
    if (candidateUrl.protocol !== "http:" && candidateUrl.protocol !== "https:") {
      return false;
    }
    return candidateUrl.origin === configuredUrl.origin;
  } catch {
    return false;
  }
}
