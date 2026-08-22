/**
 * MCP manifest builder -- pure utility, no Next.js server imports.
 *
 * Exports buildMcpManifest() for use by the /.well-known/mcp.json route.
 * Kept in lib/ so tests can import it without pulling in the Next.js
 * server runtime.
 *
 * CONVENIENCE MANIFEST: as of 2026-08, /.well-known/mcp.json is a project
 * convention for MCP server discovery. The field shape may evolve.
 *
 * References:
 *   - MCP spec: https://spec.modelcontextprotocol.io/
 *   - Well-known proposal: https://github.com/modelcontextprotocol/specification/discussions/129
 *   - Anthropic MCP docs: https://docs.anthropic.com/en/docs/mcp
 */

import { siteConfig } from "@/config/site.config";

/** Build the MCP manifest payload from siteConfig + env. */
export function buildMcpManifest(): Record<string, unknown> {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const crAgentUrl =
    process.env.NEXT_PUBLIC_CR_AGENT_URL || siteConfig.chat.agentUrl || null;

  // ContextRocket serves Streamable HTTP MCP at /mcp relative to its API base.
  // This manifest is a convenience pointer, not an MCP standards claim.
  const mcpUrl = crAgentUrl ? `${crAgentUrl.replace(/\/$/, "")}/mcp` : null;

  return {
    // Schema identifier for this project convenience manifest.
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
    // Keep the status explicit so consumers do not mistake this for a
    // standardized MCP discovery document.
    note:
      "This is a ContextRocket convenience manifest, not a standardized MCP " +
      "well-known document. Use the hosted /mcp endpoint and its protected " +
      "resource metadata for protocol discovery. " +
      "Ref: https://github.com/modelcontextprotocol/specification/discussions/129",
  };
}
