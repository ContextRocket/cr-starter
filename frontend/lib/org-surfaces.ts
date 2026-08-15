/**
 * lib/org-surfaces.ts — one org identity → every public surface.
 *
 * The public org slug (e.g. "contextrocket") is the SINGLE identity key for a
 * fork/tenant's public surfaces. Endpoints are FIXED single URLs; the slug is a
 * request-BODY param (metadata.public_slug), NEVER a path segment. This helper
 * makes forms.config, siteConfig.chat, and .well-known/agent.json projections of
 * ONE identity instead of independently-hardcoded config. Per-fork override
 * stays the exception, not the rule.
 *
 * Grounded in the real schemes already in this repo:
 *   - A2A:   POST {apiBase}/api/agent/a2a, slug in metadata.public_slug
 *            (lib/a2a-client.ts A2A_ENDPOINT + the demoPublicSlug body param).
 *   - MCP:   fixed {apiBase}/mcp — org resolved by the auth token, no per-slug path.
 *   - Card:  {appOrigin}/.well-known/agent.json (lib/agent-card.ts / the route).
 *   - Forms: forms.config endpoints, with the org slug tagged into the payload meta.
 */
import { forms, type FormEndpoint, type FormKey } from "@/forms.config";

/** Fixed API paths — the slug never appears here (it travels in the body). */
const A2A_PATH = "/api/agent/a2a";
const MCP_PATH = "/mcp";
const AGENT_CARD_PATH = "/.well-known/agent.json";

export interface OrgSurfaces {
  /** The single identity key (public org slug). */
  publicSlug: string;
  /** Chat FAB binding: sent as `metadata.public_slug` on anon A2A requests. */
  chat: { demoPublicSlug: string };
  /** A2A: fixed endpoint + the slug that travels in the request body. */
  a2a: { endpoint: string; publicSlug: string };
  /** MCP: fixed endpoint; org resolved by the auth token (no per-slug path). */
  mcp: { endpoint: string };
  /**
   * Agent-card discovery URL. Same-origin path when no appOrigin is given
   * (the card is served from the site's own origin); absolute when it is.
   */
  agentCardUrl: string;
  /** Form ingress for a given form, with the org slug tagged into meta.public_slug. */
  formIngress: (kind: FormKey) => FormEndpoint;
}

function trimTrailingSlash(s: string): string {
  return s.replace(/\/+$/, "");
}

/**
 * Resolve every public surface for an org from its slug + the API base.
 *
 * @param slug       the public org slug (identity key)
 * @param apiBase    the ContextRocket API/agent base (e.g. the value of
 *                   NEXT_PUBLIC_CR_AGENT_URL); the A2A and MCP endpoints derive
 *                   from it.
 * @param appOrigin  optional public website origin; when given, agentCardUrl is
 *                   absolute, otherwise it is a same-origin path.
 */
export function resolveOrgSurfaces(
  slug: string,
  apiBase: string,
  appOrigin?: string,
): OrgSurfaces {
  const base = trimTrailingSlash(apiBase);
  const cardBase = appOrigin ? trimTrailingSlash(appOrigin) : "";
  return {
    publicSlug: slug,
    chat: { demoPublicSlug: slug },
    a2a: { endpoint: `${base}${A2A_PATH}`, publicSlug: slug },
    mcp: { endpoint: `${base}${MCP_PATH}` },
    agentCardUrl: `${cardBase}${AGENT_CARD_PATH}`,
    formIngress: (kind: FormKey): FormEndpoint => {
      const configured = forms[kind] ?? {};
      return {
        ...configured,
        meta: { ...(configured.meta ?? {}), public_slug: slug },
      };
    },
  };
}
