/**
 * MCP convenience manifest for /.well-known/mcp.json.
 */

import { siteConfig } from "@/config/site.config";

function env(name: string): string | undefined {
  const value = (import.meta as ImportMeta & { env?: Record<string, string> })
    .env?.[name];
  return value && value.trim() ? value.trim() : undefined;
}

export function buildMcpManifest(): Record<string, unknown> {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const crAgentUrl =
    env("PUBLIC_CR_AGENT_URL") || siteConfig.chat.agentUrl || null;
  const mcpUrl = crAgentUrl ? `${crAgentUrl.replace(/\/$/, "")}/mcp` : null;

  return {
    schema: "mcp-manifest/0.1",
    name: `${siteConfig.companyName} MCP server`,
    description:
      `MCP endpoint for ${siteConfig.companyName} brand knowledge. ` +
      "Powered by ContextRocket -- your brand's verified context becomes " +
      "tools and resources for any MCP-compatible agent.",
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
    siteOrigin: origin,
    note:
      "This is a ContextRocket convenience manifest, not a standardized MCP " +
      "well-known document. Use the hosted /mcp endpoint and its protected " +
      "resource metadata for protocol discovery. " +
      "Ref: https://github.com/modelcontextprotocol/specification/discussions/129",
  };
}
