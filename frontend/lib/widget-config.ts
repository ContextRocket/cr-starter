/**
 * Widget configuration parser -- shared contract between the embed page and
 * the widget.js loader.
 *
 * This module is the canonical definition of widget config field names and
 * defaults. widget.js inlines an equivalent 5-line parse (to stay
 * dependency-free as a vanilla-JS loader), but both copies read the same
 * field names documented here.
 *
 * Supported data attributes (on the <script> tag that loads widget.js):
 *   data-cr-agent-url  -- required. The A2A agent base URL for this org.
 *   data-cr-site-key   -- optional. Public rate-limited org credential.
 *                         Carries no server-side privilege; the server
 *                         enforces origin binding. Never a secret.
 *   data-cr-title      -- optional. Override the default chat panel title.
 *
 * Embed page reads the same fields from URL search params (the loader passes
 * them via iframe src query string).
 *
 * SECURITY NOTE: site-key is a public credential class -- analogous to a
 * publishable API key. Origin binding and rate-limiting happen server-side
 * at ContextRocket. Do not treat it as a secret. Never put server-side secrets
 * in widget.js or in embed page query params.
 */

export interface WidgetConfig {
  /** Agent base URL -- required for the chat panel to connect. */
  agentUrl: string | null;
  /** Public rate-limited org credential. Optional. Never a secret. */
  siteKey: string | null;
  /** Chat panel title override. Falls back to the component default. */
  title: string | null;
}

/**
 * Parse widget config from a URLSearchParams-compatible object.
 *
 * Used by the embed page to read config from the iframe URL query string.
 * The param names match the data-attribute names (without the "data-cr-" prefix).
 *
 * @param params - Any object with a .get(key) method (URLSearchParams, ReadonlyURLSearchParams, etc.)
 */
export function parseWidgetConfig(params: {
  get(key: string): string | null;
}): WidgetConfig {
  return {
    agentUrl: params.get("agent-url") || null,
    siteKey: params.get("site-key") || null,
    title: params.get("title") || null,
  };
}

/**
 * Allowlist check for the embed page's agent-url parameter.
 *
 * The agent-url query param is attacker-controlled (any page can construct
 * the iframe src). The embed page therefore only accepts an agent-url whose
 * origin exactly matches the agent origin this deployment is configured for
 * (NEXT_PUBLIC_CR_AGENT_URL). Everything else -- foreign origins, non-http(s)
 * schemes, malformed values, or an unconfigured deployment -- is rejected and
 * the embed page renders its honest error state instead of connecting.
 */
export function isAllowedAgentUrl(
  candidate: string,
  configuredAgentUrl: string | null | undefined,
): boolean {
  if (!configuredAgentUrl) return false;

  let candidateUrl: URL;
  let configuredUrl: URL;
  try {
    candidateUrl = new URL(candidate);
    configuredUrl = new URL(configuredAgentUrl);
  } catch {
    return false;
  }

  if (candidateUrl.protocol !== "http:" && candidateUrl.protocol !== "https:") {
    return false;
  }

  return candidateUrl.origin === configuredUrl.origin;
}
