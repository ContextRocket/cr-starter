/** Shared public-site discovery builders. */

import { siteConfig } from "@/config/site.config";
import {
  buildLocalizedPublicPath,
  getDefaultPublicLocale,
  getPublicRoute,
  getPublicRouteLocales,
  getPublicRoutes,
  type PublicChangeFrequency,
  type PublicRoute,
} from "@/lib/public-route-registry";

export interface PublicSitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: PublicChangeFrequency;
  priority: number;
  alternates: { languages: Record<string, string> };
}

export interface PublicRobotsRule {
  userAgent: string;
  allow?: readonly string[];
  disallow?: readonly string[];
  crawlDelay?: number;
}

export interface PublicRobotsConfig {
  rules: readonly PublicRobotsRule[];
  sitemap: string;
  host: string;
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
  "/_next/",
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

function absoluteUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function routeUrl(baseUrl: string, route: PublicRoute, locale: string): string {
  return absoluteUrl(baseUrl, buildLocalizedPublicPath(locale, route.path));
}

function routeSitemapEntry(
  baseUrl: string,
  route: PublicRoute,
  lastModified: Date,
): PublicSitemapEntry {
  const locales = getPublicRouteLocales(route);
  const defaultLocale = getDefaultPublicLocale(locales);
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, routeUrl(baseUrl, route, locale)]),
  );
  languages["x-default"] = routeUrl(baseUrl, route, defaultLocale);

  return {
    url: routeUrl(baseUrl, route, defaultLocale),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: { languages },
  };
}

export function buildPublicSitemapEntries(options?: {
  baseUrl?: string;
  blogSlugs?: readonly string[];
  lastModified?: Date;
}): readonly PublicSitemapEntry[] {
  const baseUrl = options?.baseUrl ?? siteConfig.siteUrl;
  const lastModified = options?.lastModified ?? new Date();
  const routes = getPublicRoutes({ indexableOnly: true });
  const entries = routes.map((route) =>
    routeSitemapEntry(baseUrl, route, lastModified),
  );
  const blogRoute = getPublicRoute("blog");

  if (!blogRoute || !blogRoute.indexable || !options?.blogSlugs?.length) {
    return entries;
  }

  const postPriority = Math.max(0.1, blogRoute.priority - 0.1);
  const postRoutes = [...new Set(options.blogSlugs)].sort().map((slug) => ({
    ...blogRoute,
    path: `${blogRoute.path}/${slug}`,
    priority: postPriority,
    changeFrequency: "monthly" as const,
  }));

  return [
    ...entries,
    ...postRoutes.map((route) =>
      routeSitemapEntry(baseUrl, route, lastModified),
    ),
  ];
}

function buildAiAllowList(): string[] {
  const defaultLocale = getDefaultPublicLocale(
    siteConfig.locales.length ? siteConfig.locales : [siteConfig.defaultLocale],
  );
  const routePaths = getPublicRoutes({ indexableOnly: true })
    .filter((route) => route.path)
    .map((route) => buildLocalizedPublicPath(defaultLocale, route.path));
  return [
    "/",
    "/llms.txt",
    "/.well-known/agent.json",
    "/sitemap.xml",
    ...routePaths,
  ];
}

export function buildPublicRobotsConfig(
  baseUrl: string = siteConfig.siteUrl,
): PublicRobotsConfig {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
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
      disallow: aiAllowed ? BLOCKED_PUBLIC_ROBOT_PATHS : ["/"],
      crawlDelay: 1,
    })),
    ...SEARCH_CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: ["/"],
      disallow: BLOCKED_PUBLIC_ROBOT_PATHS,
    })),
    ...SOCIAL_CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: ["/"],
      disallow: ["/dashboard/", "/api/", "/admin/", "/account/", "/auth/"],
    })),
  ];

  return {
    rules,
    sitemap: `${normalizedBaseUrl}/sitemap.xml`,
    host: normalizedBaseUrl,
  };
}

export function buildLlmsTxt(baseUrl: string = siteConfig.siteUrl): string {
  const origin = baseUrl.replace(/\/$/, "");
  const defaultLocale = getDefaultPublicLocale(
    siteConfig.locales.length ? siteConfig.locales : [siteConfig.defaultLocale],
  );
  const homeRoute = getPublicRoute("home");
  const homeUrl = homeRoute
    ? routeUrl(origin, homeRoute, defaultLocale)
    : absoluteUrl(origin, `/${defaultLocale}`);
  const routeLines = getPublicRoutes({ llmsOnly: true }).map(
    (route) =>
      `- [${route.key}](${routeUrl(origin, route, defaultLocale)}): Public ${route.key} page.`,
  );

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
    ...routeLines,
    "",
    "## Machine-readable resources",
    `- [Sitemap](${origin}/sitemap.xml): Full public page index.`,
    `- [Robots policy](${origin}/robots.txt): Crawler access rules.`,
    `- [Agent card](${origin}/.well-known/agent.json): A2A discovery endpoint.`,
    `- [MCP manifest](${origin}/.well-known/mcp.json): MCP discovery endpoint.`,
    "",
    "## Scope",
    "This is the only root public-site LLM context file. Product/API discovery remains separate.",
    "",
    `- Email: ${siteConfig.contactEmail}`,
    `- Legal entity: ${siteConfig.legalName}`,
  ].join("\n");
}
