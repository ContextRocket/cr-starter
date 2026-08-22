/**
 * lib/org-surfaces.ts -- one organization handle → every public surface.
 *
 * The organization handle is the SINGLE public identity key for a
 * fork/tenant's public surfaces. Endpoints are FIXED single URLs; the handle is a
 * request-BODY param (metadata.handle), NEVER a path segment. This helper
 * makes forms.config, siteConfig.chat, and .well-known/agent-card.json projections of
 * ONE identity instead of independently-hardcoded config. Per-fork override
 * stays the exception, not the rule.
 *
 * Grounded in the real schemes already in this repo:
 *   - A2A:   POST {apiBase}/api/agent/a2a, handle in metadata.handle
 *            (lib/a2a-client.ts A2A_ENDPOINT + the handle body param).
 *   - MCP:   fixed {apiBase}/mcp -- org resolved by the handle/API key,
 *            no per-ID path.
 *   - Card:  {appOrigin}/.well-known/agent-card.json (lib/agent-card.ts / the route).
 *   - Forms: forms.config endpoints, with the handle tagged into payload metadata.
 */
import { forms, type FormEndpoint, type FormKey } from "@/config/site.config";

/** Fixed API paths -- the handle never appears here (it travels in the body). */
const A2A_PATH = "/api/agent/a2a";
const MCP_PATH = "/mcp";
const AGENT_CARD_PATH = "/.well-known/agent-card.json";

export interface OrgSurfaces {
  /** The single public organization handle. */
  handle: string;
  /** Chat binding: sent as `metadata.handle` on public turns. */
  chat: { handle: string };
  /** A2A: fixed endpoint + the handle that travels in the request body. */
  a2a: { endpoint: string; handle: string };
  /** MCP: fixed endpoint; org resolved by the ContextRocket credential. */
  mcp: { endpoint: string };
  /**
   * Agent-card discovery URL. Same-origin path when no appOrigin is given
   * (the card is served from the site's own origin); absolute when it is.
   */
  agentCardUrl: string;
  /** Form ingress for a given form, with the handle tagged into metadata. */
  formIngress: (kind: FormKey) => FormEndpoint;
}

function trimTrailingSlash(s: string): string {
  return s.replace(/\/+$/, "");
}

/**
 * Resolve every public surface for an org from its handle + API base.
 *
 * @param handle      the public organization handle
 * @param apiBase    the ContextRocket API/agent base (e.g. the value of
 *                   NEXT_PUBLIC_CR_AGENT_URL); the A2A and MCP endpoints derive
 *                   from it.
 * @param appOrigin  optional public website origin; when given, agentCardUrl is
 *                   absolute, otherwise it is a same-origin path.
 */
export function resolveOrgSurfaces(
  handle: string,
  apiBase: string,
  appOrigin?: string,
): OrgSurfaces {
  const base = trimTrailingSlash(apiBase);
  const cardBase = appOrigin ? trimTrailingSlash(appOrigin) : "";
  return {
    handle,
    chat: { handle },
    a2a: { endpoint: `${base}${A2A_PATH}`, handle },
    mcp: { endpoint: `${base}${MCP_PATH}` },
    agentCardUrl: `${cardBase}${AGENT_CARD_PATH}`,
    formIngress: (kind: FormKey): FormEndpoint => {
      const configured = forms[kind] ?? {};
      return {
        ...configured,
        meta: { ...(configured.meta ?? {}), handle },
      };
    },
  };
}
