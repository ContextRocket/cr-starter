/**
 * /llms-full.txt route -- extended AI-readable context.
 *
 * A longer, richer complement to /llms.txt intended for agents and LLMs
 * that can process more context. Describes the product, its public surface,
 * SEO/AEO posture, and recommended content policies.
 *
 * ContextRocket's taxonomy reads this file to assess AI-readiness depth.
 * Keeping it accurate and informative is a measurable positive signal.
 *
 * Adapted from context-rocket/frontend/app/llms-full.txt/route.ts.
 */

import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

function buildLlmsFullTxt(): string {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return [
    `# ${siteConfig.companyName} -- full public context`,
    "",
    siteConfig.description,
    "",
    "## Public boundaries",
    "Public pages describe the product, its capabilities, pricing, and legal",
    "posture. They must not expose private user data, org records, API keys,",
    "raw prompts, or operator configuration.",
    "",
    "## Public surface",
    `- Homepage: ${origin}/`,
    `- Impressum (legal notice): ${origin}/impressum`,
    `- Privacy policy: ${origin}/privacy`,
    `- Sitemap: ${origin}/sitemap.xml`,
    `- Robots policy: ${origin}/robots.txt`,
    `- AI context (short): ${origin}/llms.txt`,
    `- AI context (full): ${origin}/llms-full.txt`,
    "",
    "## SEO and AEO posture",
    `${siteConfig.companyName} follows the same discipline it recommends to`,
    "customers: indexable public pages, canonical URLs, a clear robots policy,",
    "sitemap coverage, JSON-LD structured data (Organization + WebSite), and",
    "curated AI-readable context through llms.txt.",
    "",
    "## Contact",
    `- Email: ${siteConfig.contactEmail}`,
    `- Legal entity: ${siteConfig.legalName}`,
  ].join("\n");
}

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "cache-control": "public, max-age=3600",
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}
