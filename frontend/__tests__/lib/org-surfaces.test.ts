import { describe, expect, it } from "vitest";

import { resolveOrgSurfaces } from "@/lib/org-surfaces";

describe("resolveOrgSurfaces", () => {
  const SLUG = "contextrocket";
  const API = "https://app-api.contextrocket.com";

  it("uses the slug as the single identity key across surfaces", () => {
    const s = resolveOrgSurfaces(SLUG, API);
    expect(s.publicSlug).toBe(SLUG);
    expect(s.chat.demoPublicSlug).toBe(SLUG);
    expect(s.a2a.publicSlug).toBe(SLUG);
  });

  it("derives FIXED endpoints from the API base (slug never in the path)", () => {
    const s = resolveOrgSurfaces(SLUG, API);
    expect(s.a2a.endpoint).toBe("https://app-api.contextrocket.com/api/agent/a2a");
    expect(s.mcp.endpoint).toBe("https://app-api.contextrocket.com/mcp");
    // The slug travels in the body, never the URL path (the domain may itself
    // legitimately contain the brand name, so assert on the pathname).
    expect(new URL(s.a2a.endpoint).pathname).toBe("/api/agent/a2a");
    expect(new URL(s.mcp.endpoint).pathname).toBe("/mcp");
  });

  it("trims a trailing slash on the API base", () => {
    const s = resolveOrgSurfaces(SLUG, "https://app-api.contextrocket.com/");
    expect(s.a2a.endpoint).toBe("https://app-api.contextrocket.com/api/agent/a2a");
  });

  it("returns a same-origin agent-card path by default, absolute with an appOrigin", () => {
    expect(resolveOrgSurfaces(SLUG, API).agentCardUrl).toBe(
      "/.well-known/agent.json",
    );
    expect(
      resolveOrgSurfaces(SLUG, API, "https://www.contextrocket.ai/").agentCardUrl,
    ).toBe("https://www.contextrocket.ai/.well-known/agent.json");
  });

  it("tags form ingress payloads with the org slug (projection of one identity)", () => {
    const s = resolveOrgSurfaces(SLUG, API);
    const waitlist = s.formIngress("waitlist");
    expect(waitlist.meta?.public_slug).toBe(SLUG);
    // Preserves the configured form meta (e.g. source) while adding identity.
    expect(waitlist.meta?.source).toBe("waitlist");
  });

  it("still tags identity for a form with no configured endpoint", () => {
    const s = resolveOrgSurfaces(SLUG, API);
    const contact = s.formIngress("contact");
    expect(contact.meta?.public_slug).toBe(SLUG);
  });
});
