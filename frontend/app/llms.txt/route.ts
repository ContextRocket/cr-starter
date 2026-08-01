/**
 * /llms.txt route -- concise AI-readable site context.
 *
 * llms.txt is a convention (llmstxt.org) that gives AI assistants and
 * answer engines a curated, Markdown-formatted map of a site. ContextRocket's
 * taxonomy checks for this file as a positive AI-readiness signal.
 *
 * Content is generated from site.config so forks stay consistent with
 * their own brand identity without editing this file.
 *
 * Adapted from context-rocket/frontend/app/llms.txt/route.ts.
 */

import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return [
    `# ${siteConfig.companyName}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Use this file for public product context. It excludes private user data,",
    "API internals, authentication flows, and operator configuration.",
    "",
    "## Core pages",
    `- [Homepage](${origin}/): ${siteConfig.tagline}`,
    `- [Impressum](${origin}/impressum): Legal notice (required for DE/EU sites).`,
    `- [Privacy Policy](${origin}/privacy): How user data is handled.`,
    "",
    "## Machine-readable resources",
    `- [Sitemap](${origin}/sitemap.xml): Full page index.`,
    `- [Robots policy](${origin}/robots.txt): Crawler access rules.`,
    `- [Full AI context](${origin}/llms-full.txt): Extended context for LLMs and agents.`,
    `- [Agent card](${origin}/.well-known/agent.json): A2A discovery endpoint (Google A2A spec).`,
    "",
    "## MCP (Model Context Protocol)",
    `- [MCP manifest](${origin}/.well-known/mcp.json): MCP server discovery (emerging convention).`,
    "- The site's brand knowledge is available as MCP tools and resources via ContextRocket.",
    "- MCP endpoint convention: <CR_AGENT_URL>/api/mcp -- see agent.json for the configured URL.",
    "- Ref: https://spec.modelcontextprotocol.io/ and https://google.github.io/A2A/",
    "",
    "## Contact",
    `- ${siteConfig.contactEmail}`,
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
