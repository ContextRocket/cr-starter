/**
 * Robots meta route -- served at /robots.txt.
 *
 * Uses a centralized CRAWLER_CONFIG pattern so the AI-crawler stance is
 * documented and controllable from one object, not scattered across rules.
 *
 * Key controls:
 *   - CRAWLER_CONFIG.allowAiCrawlers (default true): set false in siteConfig
 *     to switch the AI tier to Disallow. Matches siteConfig.allowAiCrawlers.
 *   - CRAWLER_CONFIG.highValuePaths: paths surfaced to AI crawlers in their
 *     explicit Allow list so answer engines discover the best content first.
 *   - AI crawlers get llms.txt, llms-full.txt, and /.well-known/agent.json
 *     in their Allow list as AEO (Answer Engine Optimisation) signals.
 *
 * Adapted from cr-frontend/frontend/app/robots.ts (CRAWLER_CONFIG pattern).
 * Origin: context-rocket/frontend/app/robots.ts (AI crawler list).
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";


export const dynamic = "force-static";
// ── Global crawler policy ─────────────────────────────────────────────────────

const CRAWLER_CONFIG = {
  // Global rules applied to the wildcard User-agent catch-all.
  global: {
    allow: ["/"],
    disallow: [
      "/dashboard/",
      "/auth/",
      "/account/",
      "/admin/",
      "/api/",
      "/_next/",
    ] as string[],
  },

  // AI-crawler tier -- named list of agents that receive a curated Allow list.
  // Set allowAiCrawlers: false in siteConfig to block this tier.
  ai_crawlers: {
    /**
     * Whether to allow AI answer-engine crawlers.
     * Centralized in siteConfig so forking teams see the decision in one place.
     */
    allowAiCrawlers: siteConfig.allowAiCrawlers,

    /**
     * High-value paths surfaced explicitly to AI crawlers.
     * Add content pages, docs, and landing pages that best represent the site
     * for AI answer engines. AEO audit tools check these Allow entries.
     */
    highValuePaths: [
      "/",
      "/llms.txt",
      "/llms-full.txt",
      "/.well-known/agent.json",
      "/sitemap.xml",
    ] as string[],

    /** Paths that must never be indexed by any crawler, including AI. */
    sensitivePaths: [
      "/dashboard/",
      "/auth/",
      "/account/",
      "/admin/",
      "/api/",
      "/_next/",
    ] as string[],

    crawlDelay: 1,
  },

  // Traditional search crawlers -- full public surface access.
  search_crawlers: {
    disallow: [
      "/dashboard/",
      "/auth/",
      "/account/",
      "/admin/",
      "/api/",
      "/_next/",
    ] as string[],
  },

  // Social link-preview crawlers -- public surface, no private routes.
  social_crawlers: {
    disallow: [
      "/dashboard/",
      "/api/",
      "/admin/",
      "/account/",
      "/auth/",
    ] as string[],
  },
};

// ── Crawler name lists ────────────────────────────────────────────────────────

/**
 * Named AI answer-engine and training crawlers.
 * Grouped for the explicit Allow/crawlDelay tier.
 */
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Claude-SearchBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google AI
  "Google-Extended",
  "GeminiBot",
  // Apple
  "Applebot-Extended",
  // Other AI / answer engines
  "Bytespider",
  "Amazonbot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "DiffBot",
  "YouBot",
  "PhindBot",
  "CCBot",
] as const;

const SEARCH_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "Sogou",
] as const;

const SOCIAL_CRAWLERS = [
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot",
  "WhatsApp",
  "TelegramBot",
  "Discordbot",
  "Mastodon",
] as const;

// ── Rule generator ────────────────────────────────────────────────────────────

function buildRules(): MetadataRoute.Robots["rules"] {
  const rules: MetadataRoute.Robots["rules"] = [];

  // 1. Global catch-all.
  rules.push({
    userAgent: "*",
    allow: CRAWLER_CONFIG.global.allow,
    disallow: CRAWLER_CONFIG.global.disallow,
  });

  // 2. AI crawler tier.
  const aiConfig = CRAWLER_CONFIG.ai_crawlers;
  const aiAllow = aiConfig.allowAiCrawlers ? aiConfig.highValuePaths : [];
  const aiDisallow = aiConfig.allowAiCrawlers ? aiConfig.sensitivePaths : ["/"];

  for (const userAgent of AI_CRAWLERS) {
    rules.push({
      userAgent,
      allow: aiAllow,
      disallow: aiDisallow,
      crawlDelay: aiConfig.crawlDelay,
    });
  }

  // 3. Traditional search crawlers.
  for (const userAgent of SEARCH_CRAWLERS) {
    rules.push({
      userAgent,
      allow: ["/"],
      disallow: CRAWLER_CONFIG.search_crawlers.disallow,
    });
  }

  // 4. Social link-preview crawlers.
  for (const userAgent of SOCIAL_CRAWLERS) {
    rules.push({
      userAgent,
      allow: ["/"],
      disallow: CRAWLER_CONFIG.social_crawlers.disallow,
    });
  }

  return rules;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export default function robots(): MetadataRoute.Robots {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return {
    rules: buildRules(),
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
