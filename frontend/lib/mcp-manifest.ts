/**
 * MCP manifest builder -- pure utility, no Next.js server imports.
 *
 * Exports buildMcpManifest() for use by the /.well-known/mcp.json route.
 * Kept in lib/ so tests can import it without pulling in the Next.js
 * server runtime.
 *
 * EMERGING CONVENTION: as of 2026-08, /.well-known/mcp.json is an emerging
 * convention for MCP server discovery. The field shape may evolve.
 *
 * References:
 *   - MCP spec: https://spec.modelcontextprotocol.io/
 *   - Well-known proposal: https://github.com/modelcontextprotocol/specification/discussions/129
 *   - Anthropic MCP docs: https://docs.anthropic.com/en/docs/mcp
 */

import { siteConfig } from "@/site.config";

/** Build the MCP manifest payload from siteConfig + env. */
export function buildMcpManifest(): Record<string, unknown> {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const crAgentUrl = process.env.NEXT_PUBLIC_CR_AGENT_URL || null;

  // ContextRocket serves the MCP endpoint under /api/mcp relative to the
  // CR agent base URL. Forks using a different MCP provider should update
  // this URL convention.
  const mcpUrl = crAgentUrl ? `${crAgentUrl.replace(/\/$/, "")}/api/mcp` : null;

  return {
    // Schema identifier for this manifest format (emerging convention).
    schema: "mcp-manifest/0.1",
    name: `${siteConfig.companyName} MCP server`,
    description:
      `MCP endpoint for ${siteConfig.companyName} brand knowledge. ` +
      "Powered by ContextRocket -- your brand's verified context becomes " +
      "tools and resources for any MCP-compatible agent.",
    // url is null when the CR endpoint is not configured.
    url: mcpUrl,
    transport: "http",
    capabilities: {
      tools: true,
      resources: true,
      prompts: false,
    },
    provider: {
      name: "ContextRocket",
      url: "https://contextrocket.com",
      docs: "https://docs.contextrocket.com/api/mcp",
    },
    // Site origin for discovery / CORS.
    siteOrigin: origin,
    // Spec status note for discovery tooling.
    note:
      "This manifest follows an emerging convention; the field shape may " +
      "evolve as the MCP well-known standard matures. " +
      "Ref: https://github.com/modelcontextprotocol/specification/discussions/129",
  };
}
