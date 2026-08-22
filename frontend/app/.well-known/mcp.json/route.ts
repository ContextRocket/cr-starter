/**
 * /.well-known/mcp.json -- MCP (Model Context Protocol) manifest.
 *
 * CONVENIENCE MANIFEST: /.well-known/mcp.json is not itself an MCP standard.
 * The hosted ContextRocket server owns the actual /mcp protocol endpoint and
 * protected-resource metadata.
 *
 * References:
 *   - MCP spec: https://spec.modelcontextprotocol.io/
 *   - Well-known proposal: https://github.com/modelcontextprotocol/specification/discussions/129
 *   - Anthropic MCP docs: https://docs.anthropic.com/en/docs/mcp
 *
 * This manifest describes the ContextRocket-hosted /mcp endpoint for this
 * site's organization. ContextRocket owns MCP authorization, policy, and
 * tenant resolution.
 *
 * The manifest builder lives in lib/mcp-manifest.ts (pure, no server imports).
 *
 * See also: /.well-known/agent-card.json (A2A card), /llms.txt (LLM context).
 */

import { NextResponse } from "next/server";
import { buildMcpManifest } from "@/lib/mcp-manifest";

export const dynamic = "force-static";

export function GET() {
  const manifest = buildMcpManifest();

  return NextResponse.json(manifest, {
    headers: {
      "cache-control": "public, max-age=3600",
      "access-control-allow-origin": "*",
    },
  });
}
