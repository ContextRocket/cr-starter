import { describe, expect, it } from "vitest";
import { buildMcpManifest } from "../../src/lib/mcp-manifest";

describe("MCP manifest", () => {
  it("publishes the configured organization-scoped MCP URL", () => {
    const manifest = buildMcpManifest({
      agentUrl: "https://api.contextrocket.com",
      handle: "starter-demo",
    });

    expect(manifest.url).toBe(
      "https://api.contextrocket.com/company/starter-demo/mcp",
    );
  });

  it("builds the person identity endpoint when configured", () => {
    const manifest = buildMcpManifest({
      agentUrl: "https://api.contextrocket.com/",
      handle: "mark macmahon",
      subjectKind: "person",
    });
    expect(manifest.url).toBe(
      "https://api.contextrocket.com/person/mark%20macmahon/mcp",
    );
  });

  it("does not advertise the shared MCP directory without an organization handle", () => {
    const manifest = buildMcpManifest({
      agentUrl: "https://api.contextrocket.com",
      handle: "",
    });

    expect(manifest.url).toBeNull();
  });
});
