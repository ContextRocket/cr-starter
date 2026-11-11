/**
 * MCP convenience manifest for /.well-known/mcp.json.
 */

import { siteConfig } from "@/config/site.config";

export interface McpManifestOptions {
  siteUrl?: string;
  companyName?: string;
  agentUrl?: string | null;
  handle?: string;
}

function env(name: string): string | undefined {
  const value = (import.meta as ImportMeta & { env?: Record<string, string> })
    .env?.[name];
  return value && value.trim() ? value.trim() : undefined;
}

export function buildMcpManifest(
  options: McpManifestOptions = {},
): Record<string, unknown> {
  const origin = (options.siteUrl ?? siteConfig.siteUrl).replace(/\/$/, "");
  const companyName = options.companyName ?? siteConfig.companyName;
  const crAgentUrl = options.agentUrl === undefined
    ? env("PUBLIC_CR_AGENT_URL") || siteConfig.contextrocket.apiBaseUrl
    : options.agentUrl;
  const handle = options.handle ?? siteConfig.contextrocket.handle;
  const mcpUrl = crAgentUrl && handle
    ? `${crAgentUrl.replace(/\/$/, "")}/mcp/${encodeURIComponent(handle)}`
    : null;

  return {
    schema: "mcp-manifest/0.1",
    name: `${companyName} MCP server`,
    description:
      `MCP endpoint for ${companyName} brand knowledge. ` +
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
      "well-known document. Use the hosted organization-scoped /mcp/{handle} endpoint " +
      "and its protected " +
      "resource metadata for protocol discovery. " +
      "Ref: https://github.com/modelcontextprotocol/specification/discussions/129",
  };
}
