import { buildMcpManifest } from "@/lib/mcp-manifest";

describe("buildMcpManifest()", () => {
  it("points at ContextRocket's Streamable HTTP MCP endpoint", () => {
    const manifest = buildMcpManifest();
    expect(manifest.url).toBe("https://app-api.contextrocket.com/mcp");
    expect(manifest.schema).toBe("mcp-manifest/0.1");
    expect(manifest.note).toEqual(expect.stringContaining("convenience"));
  });
});
