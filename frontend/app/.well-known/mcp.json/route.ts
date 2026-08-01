/**
 * /.well-known/mcp.json -- MCP (Model Context Protocol) manifest.
 *
 * EMERGING CONVENTION: as of 2026-08, the /.well-known/mcp.json path is an
 * emerging convention for exposing an MCP server manifest. Not yet formally
 * standardized; field shape may evolve.
 *
 * References:
 *   - MCP spec: https://spec.modelcontextprotocol.io/
 *   - Well-known proposal: https://github.com/modelcontextprotocol/specification/discussions/129
 *   - Anthropic MCP docs: https://docs.anthropic.com/en/docs/mcp
 *
 * This manifest describes the ContextRocket-hosted MCP endpoint for this
 * site's org. The platform serves /api/mcp per org -- your brand's verified
 * context becomes tools/resources any MCP-compatible agent can connect to.
 *
 * The manifest builder lives in lib/mcp-manifest.ts (pure, no server imports).
 *
 * See also: /.well-known/agent.json (A2A card), /llms.txt (LLM context).
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
