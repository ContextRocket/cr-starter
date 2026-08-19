/**
 * RSS 2.0 feed builder for the public blog.
 *
 * Why a separate module: the `app/feed.xml/route.ts` Next route stays thin
 * and force-static. The work (frontmatter loading, RFC-822 date formatting,
 * XML escaping, atom:link self-reference) lives here so it is unit-testable
 * without a Next runtime.
 *
 * Blog links are locale-prefixed with the site's default locale (the starter
 * serves every public page under a `[locale]` segment) and use the configured
 * blog segment (siteConfig.blog.basePath via lib/blog-path) so a fork's custom
 * path flows through the self URL, item links, and feed title. Channel identity
 * comes from site.config so forks stay consistent without editing this file.
 *
 * Adapted from context-rocket/frontend/lib/public-feed.ts.
 * Reference: https://www.rssboard.org/rss-specification
 */

import { siteConfig } from "@/config/site.config";
import { fileBlogAdapter, type BlogSource } from "@/lib/blog";
import { blogBasePath, blogTitle } from "@/lib/blog-path";

const XML_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/"/g, "&quot;"],
  [/'/g, "&apos;"],
];

/**
 * Escape a string for safe inclusion inside an XML text node or attribute
 * value. Order matters: `&` first so subsequent escapes don't double-encode.
 */
export function escapeXml(value: string): string {
  let result = value;
  for (const [pattern, replacement] of XML_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Format an ISO date string as an RFC-822 date as required by RSS 2.0
 * `<pubDate>`. Falls back to `now` when the input cannot be parsed so we
 * never emit invalid XML.
 */
export function toRfc822(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return now.toUTCString();
  return date.toUTCString();
}

export interface FeedConfig {
  /** Path of the feed file itself, e.g. `/feed.xml` (atom:link self ref). */
  selfPath?: string;
  /** Override the blog source (useful in tests). Defaults to the file adapter. */
  source?: BlogSource;
  now?: Date;
}

/**
 * Build an RSS 2.0 channel from the published blog posts. Emits one `<item>`
 * per post with title, link, guid (the canonical locale-prefixed blog URL),
 * pubDate (RFC-822), and description (excerpt, falling back to the body's
 * first 200 chars). Includes the atom:link self-reference RSS validators
 * expect. Channel title/description/link come from site.config.
 */
export function buildRssFeed(config: FeedConfig = {}): string {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const locale = siteConfig.defaultLocale;
  const base = blogBasePath();
  const selfPath = config.selfPath ?? "/feed.xml";
  const now = config.now ?? new Date();
  const source = config.source ?? fileBlogAdapter;

  // Newest first for feed readers.
  const posts = source
    .list(locale)
    .slice()
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });

  const channelTitle = `${siteConfig.companyName} -- ${blogTitle()}`;
  const channelLink = `${origin}/${locale}${base}`;
  const channelDescription = siteConfig.description;
  const feedSelfUrl = `${origin}${selfPath}`;
  const lastBuild = now.toUTCString();

  const itemNodes = posts
    .map((post) => {
      const itemUrl = `${origin}/${locale}${base}/${post.slug}`;
      const description = post.excerpt ?? post.bodyMarkdown.slice(0, 200);
      return [
        "  <item>",
        `    <title>${escapeXml(post.title)}</title>`,
        `    <link>${itemUrl}</link>`,
        `    <guid isPermaLink="true">${itemUrl}</guid>`,
        `    <pubDate>${toRfc822(post.date, now)}</pubDate>`,
        `    <description>${escapeXml(description)}</description>`,
        `    <dc:creator><![CDATA[${post.author}]]></dc:creator>`,
        "  </item>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(channelTitle)}</title>`,
    `    <link>${channelLink}</link>`,
    `    <description>${escapeXml(channelDescription)}</description>`,
    `    <language>${locale}</language>`,
    `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
    `    <generator>ContextRocket Starter</generator>`,
    `    <atom:link href="${feedSelfUrl}" rel="self" type="application/rss+xml" />`,
    itemNodes,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
