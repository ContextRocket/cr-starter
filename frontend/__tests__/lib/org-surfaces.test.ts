import { describe, expect, it } from "vitest";

import { resolveOrgSurfaces } from "@/lib/org-surfaces";

describe("resolveOrgSurfaces", () => {
  const HANDLE = "contextrocket";
  const API = "https://app-api.contextrocket.com";

  it("uses the organization handle as the single identity key across surfaces", () => {
    const s = resolveOrgSurfaces(HANDLE, API);
    expect(s.handle).toBe(HANDLE);
    expect(s.chat.handle).toBe(HANDLE);
    expect(s.a2a.handle).toBe(HANDLE);
  });

  it("derives FIXED endpoints from the API base (handle never in the path)", () => {
    const s = resolveOrgSurfaces(HANDLE, API);
    expect(s.a2a.endpoint).toBe(
      "https://app-api.contextrocket.com/api/agent/a2a",
    );
    expect(s.mcp.endpoint).toBe("https://app-api.contextrocket.com/mcp");
    // The ID travels in the body, never the URL path (the domain may itself
    // legitimately contain the brand name, so assert on the pathname).
    expect(new URL(s.a2a.endpoint).pathname).toBe("/api/agent/a2a");
    expect(new URL(s.mcp.endpoint).pathname).toBe("/mcp");
  });

  it("trims a trailing slash on the API base", () => {
    const s = resolveOrgSurfaces(HANDLE, "https://app-api.contextrocket.com/");
    expect(s.a2a.endpoint).toBe(
      "https://app-api.contextrocket.com/api/agent/a2a",
    );
  });

  it("returns a same-origin agent-card path by default, absolute with an appOrigin", () => {
    expect(resolveOrgSurfaces(HANDLE, API).agentCardUrl).toBe(
      "/.well-known/agent-card.json",
    );
    expect(
      resolveOrgSurfaces(HANDLE, API, "https://www.contextrocket.ai/")
        .agentCardUrl,
    ).toBe("https://www.contextrocket.ai/.well-known/agent-card.json");
  });

  it("tags form ingress payloads with the organization handle", () => {
    const s = resolveOrgSurfaces(HANDLE, API);
    const waitlist = s.formIngress("waitlist");
    expect(waitlist.meta?.handle).toBe(HANDLE);
    // Preserves the configured form meta (e.g. source) while adding identity.
    expect(waitlist.meta?.source).toBe("waitlist");
  });

  it("still tags identity for a form with no configured endpoint", () => {
    const s = resolveOrgSurfaces(HANDLE, API);
    const contact = s.formIngress("contact");
    expect(contact.meta?.handle).toBe(HANDLE);
  });
});
