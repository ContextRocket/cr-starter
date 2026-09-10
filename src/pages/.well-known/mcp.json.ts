import { buildMcpManifest } from "@/lib/mcp-manifest";

/** /.well-known/mcp.json -- ContextRocket MCP convenience manifest. */
export async function GET() {
  return new Response(JSON.stringify(buildMcpManifest(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
