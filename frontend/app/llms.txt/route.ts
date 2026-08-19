/**
 * /llms.txt route -- AI-readable site context (llmstxt.org convention).
 *
 * llms.txt gives AI assistants and answer engines a curated,
 * Markdown-formatted map of a site. ContextRocket's taxonomy checks for
 * this file as a positive AI-readiness signal.
 *
 * Content is generated from site.config so forks stay consistent with
 * their own brand identity without editing this file.
 *
 * Spec: https://llmstxt.org
 */

import { siteConfig } from "@/config/site.config";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return [
    `# ${siteConfig.companyName}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Core pages",
    `- [Homepage](${origin}/): ${siteConfig.tagline}`,
    `- [FAQ](${origin}/faq): Common questions about this site, the chat agent, data handling, and customization.`,
    `- [Impressum](${origin}/impressum): Legal notice (required for DE/EU sites).`,
    `- [Privacy Policy](${origin}/privacy): How user data is handled.`,
    "",
    "## Machine-readable resources",
    `- [Sitemap](${origin}/sitemap.xml): Full page index.`,
    `- [Robots policy](${origin}/robots.txt): Crawler access rules.`,
    `- [Agent card](${origin}/.well-known/agent.json): A2A discovery endpoint (Google A2A spec).`,
    `- [MCP manifest](${origin}/.well-known/mcp.json): MCP server discovery (emerging convention).`,
    "",
    "## SEO and AEO posture",
    `${siteConfig.companyName} follows the same discipline it recommends to`,
    "customers: indexable public pages, canonical URLs, a clear robots policy,",
    "sitemap coverage, JSON-LD structured data (Organization + WebSite), and",
    "curated AI-readable context through llms.txt.",
    "",
    "## MCP (Model Context Protocol)",
    "- The site's brand knowledge is available as MCP tools and resources via ContextRocket.",
    "- MCP endpoint convention: <CR_AGENT_URL>/api/mcp -- see agent.json for the configured URL.",
    "- Ref: https://spec.modelcontextprotocol.io/ and https://google.github.io/A2A/",
    "",
    "## Optional",
    `- Email: ${siteConfig.contactEmail}`,
    `- Legal entity: ${siteConfig.legalName}`,
  ].join("\n");
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "cache-control": "public, max-age=3600",
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}
