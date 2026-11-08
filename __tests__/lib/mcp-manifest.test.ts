import { describe, expect, it } from "vitest";
import { buildMcpManifest } from "../../src/lib/mcp-manifest";

describe("MCP manifest", () => {
  it("publishes the configured organization-scoped MCP URL", () => {
    const manifest = buildMcpManifest();

    expect(manifest.url).toMatch(/\/mcp\/[^/]+$/);
    expect(manifest.url).not.toMatch(/\/mcp$/);
  });
});
