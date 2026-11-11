import { describe, expect, it } from "vitest";
import { buildMcpManifest } from "../../src/lib/mcp-manifest";

describe("MCP manifest", () => {
  it("publishes the configured organization-scoped MCP URL", () => {
    const manifest = buildMcpManifest({
      agentUrl: "https://api.contextrocket.com",
      handle: "starter-demo",
    });

    expect(manifest.url).toBe("https://api.contextrocket.com/mcp/starter-demo");
  });

  it("does not advertise the shared MCP directory without an organization handle", () => {
    const manifest = buildMcpManifest({
      agentUrl: "https://api.contextrocket.com",
      handle: "",
    });

    expect(manifest.url).toBeNull();
  });
});
