/**
 * Public-site discovery builders: robots, llms.txt, sitemap helpers.
 * Ported from the Next public-site seam; Astro routes stay thin wrappers.
 */

import { siteConfig, isSingleLocale } from "@/config/site.config";
import { getActiveLocales, getDefaultLocale } from "@/i18n/locales";
import {
  enabledPublicRoutes,
  routeHref,
  type PublicRoute,
} from "@/lib/public-routes";
import { absoluteUrl, blogPostHref } from "@/lib/paths";
import { listPosts } from "@/lib/blog";

export interface PublicSitemapEntry {
  loc: string;
  lastModified?: string;
  changeFrequency?: string;
  priority?: number;
  alternates?: Record<string, string>;
}

export interface PublicRobotsRule {
  userAgent: string;
  allow?: readonly string[];
  disallow?: readonly string[];
  crawlDelay?: number;
}

const BLOCKED_PUBLIC_ROBOT_PATHS = [
  "/dashboard/",
  "/auth/",
  "/account/",
  "/guest/",
  "/apps/",
  "/admin/",
  "/api/",
  "/s/",
  "/embed/",
  "/_astro/",
  "/images/private/",
] as const;

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Claude-Web",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GeminiBot",
  "Applebot-Extended",
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

function buildAiAllowList(): string[] {
  const locale = getDefaultLocale();
  const routePaths = enabledPublicRoutes()
    .filter((route) => route.indexable !== false)
    .filter((route) => route.path)
    .map((route) => routeHref(locale, route));
  return [
    "/",
    "/llms.txt",
    "/.well-known/agent-card.json",
    "/sitemap.xml",
    ...routePaths,
  ];
}

function formatRobotsRule(rule: PublicRobotsRule): string {
  const lines = [`User-agent: ${rule.userAgent}`];
  for (const path of rule.allow ?? []) lines.push(`Allow: ${path}`);
  for (const path of rule.disallow ?? []) lines.push(`Disallow: ${path}`);
  if (rule.crawlDelay != null) lines.push(`Crawl-delay: ${rule.crawlDelay}`);
  return lines.join("\n");
}

export function buildRobotsTxt(): string {
  const aiAllow = buildAiAllowList();
  const aiAllowed = siteConfig.allowAiCrawlers;
  const rules: PublicRobotsRule[] = [
    {
      userAgent: "*",
      allow: ["/"],
      disallow: BLOCKED_PUBLIC_ROBOT_PATHS,
    },
    ...AI_CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: aiAllowed ? aiAllow : [],
      disallow: aiAllowed ? [...BLOCKED_PUBLIC_ROBOT_PATHS] : ["/"],
      crawlDelay: 1,
    })),
    ...SEARCH_CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: ["/"],
      disallow: [...BLOCKED_PUBLIC_ROBOT_PATHS],
    })),
    ...SOCIAL_CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: ["/"],
      disallow: ["/dashboard/", "/api/", "/admin/", "/account/", "/auth/"],
    })),
  ];

  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  return [
    ...rules.map(formatRobotsRule),
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `Host: ${origin}`,
    "",
  ].join("\n\n");
}

export function buildLlmsTxt(): string {
  const locale = getDefaultLocale();
  const home = enabledPublicRoutes().find((r) => r.key === "home");
  const homeUrl = absoluteUrl(home ? routeHref(locale, home) : "/");
  const pageLines = enabledPublicRoutes()
    .filter((route) => route.includeInLlms && route.key !== "home")
    .map(
      (route) =>
        `- [${route.key}](${absoluteUrl(routeHref(locale, route))}): Public ${route.key} page.`,
    );

  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  return [
    `# ${siteConfig.companyName}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "This concise file describes the public website. It excludes dashboards,",
    "private account data, API internals, prompts, and provider diagnostics.",
    "",
    "## Core public pages",
    `- [home](${homeUrl}): ${siteConfig.tagline}`,
    ...pageLines,
    "",
    "## Machine-readable resources",
    `- [Sitemap](${absoluteUrl("/sitemap.xml")}): Full public page index.`,
    `- [Robots policy](${absoluteUrl("/robots.txt")}): Crawler access rules.`,
    `- [Agent card](${origin}/.well-known/agent-card.json): A2A discovery endpoint.`,
    `- [MCP manifest](${origin}/.well-known/mcp.json): ContextRocket MCP convenience manifest.`,
    "",
    "## Scope",
    "This is the only root public-site LLM context file. Product/API discovery remains separate.",
    "",
    `- Email: ${siteConfig.contactEmail}`,
    `- Legal entity: ${siteConfig.legalName}`,
    "",
  ].join("\n");
}

function routeAlternates(route: PublicRoute): Record<string, string> | undefined {
  const locales = getActiveLocales();
  if (isSingleLocale() || locales.length < 2) return undefined;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = absoluteUrl(routeHref(locale, route));
  }
  languages["x-default"] = absoluteUrl(routeHref(getDefaultLocale(), route));
  return languages;
}

export function buildSitemapEntries(): PublicSitemapEntry[] {
  const locales = getActiveLocales();
  const routes = enabledPublicRoutes().filter((r) => r.indexable !== false);
  const lastModified = new Date().toISOString();
  const entries: PublicSitemapEntry[] = [];

  for (const route of routes) {
    const defaultLocale = getDefaultLocale();
    entries.push({
      loc: absoluteUrl(routeHref(defaultLocale, route)),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: routeAlternates(route),
    });
  }

  if (siteConfig.features.blog) {
    const blogRoute = routes.find((r) => r.key === "blog");
    const postPriority = Math.max(0.1, (blogRoute?.priority ?? 0.7) - 0.1);
    const defaultLocale = getDefaultLocale();
    const seen = new Set<string>();
    for (const locale of locales) {
      for (const post of listPosts(locale)) {
        if (seen.has(post.slug)) continue;
        seen.add(post.slug);
        const languages =
          !isSingleLocale() && locales.length > 1
            ? Object.fromEntries([
                ...locales.map((loc) => [
                  loc,
                  absoluteUrl(blogPostHref(loc, post.slug)),
                ]),
                [
                  "x-default",
                  absoluteUrl(blogPostHref(defaultLocale, post.slug)),
                ],
              ])
            : undefined;
        entries.push({
          loc: absoluteUrl(blogPostHref(defaultLocale, post.slug)),
          lastModified: post.date
            ? new Date(post.date).toISOString()
            : lastModified,
          changeFrequency: "monthly",
          priority: postPriority,
          alternates: languages as Record<string, string> | undefined,
        });
      }
    }
  }

  return entries;
}

export function renderSitemapXml(entries: PublicSitemapEntry[]): string {
  const hasAlternates = entries.some((e) => e.alternates);
  const ns = hasAlternates
    ? `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"`
    : `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`;

  const urls = entries
    .map((entry) => {
      const altLinks = entry.alternates
        ? Object.entries(entry.alternates)
            .map(
              ([lang, href]) =>
                `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`,
            )
            .join("\n")
        : "";
      return `  <url>
    <loc>${entry.loc}</loc>${
      entry.lastModified
        ? `\n    <lastmod>${entry.lastModified.slice(0, 10)}</lastmod>`
        : ""
    }${
      entry.changeFrequency
        ? `\n    <changefreq>${entry.changeFrequency}</changefreq>`
        : ""
    }${
      entry.priority != null
        ? `\n    <priority>${entry.priority}</priority>`
        : ""
    }${altLinks ? `\n${altLinks}` : ""}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${ns}>
${urls}
</urlset>
`;
}

export function buildSecurityTxt(): string {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  return [
    `Contact: mailto:${siteConfig.contactEmail}`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${origin}/.well-known/security.txt`,
    "",
  ].join("\n");
}
