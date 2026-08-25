/**
 * Unit: buildRssFeed -- RSS 2.0 channel from the blog seam.
 *
 * Uses a FAKE BlogSource (the `source` override) so the assertions are
 * deterministic and never touch the filesystem: well-formed items, newest
 * first, locale-prefixed guids/links, XML-escaped content, and the atom:link
 * self-reference validators expect.
 */

import { describe, it, expect } from "vitest";
import { buildRssFeed } from "@/lib/feed";
import type { BlogSource, BlogPost } from "@/lib/blog";
import { siteConfig } from "@/config/site.config";

const ORIGIN = siteConfig.siteUrl.replace(/\/$/, "");
const LOCALE = siteConfig.defaultLocale;

function fakeSource(posts: BlogPost[]): BlogSource {
  return {
    list: () => posts,
    get: (slug) => posts.find((p) => p.slug === slug) ?? null,
  };
}

const posts: BlogPost[] = [
  {
    slug: "older",
    title: "Older & wiser",
    author: "Alice",
    date: "2026-01-01",
    excerpt: "The older post.",
    bodyMarkdown: "body one",
  },
  {
    slug: "newer",
    title: "Newer <post>",
    author: "Bob",
    date: "2026-03-01",
    excerpt: "The newer post.",
    bodyMarkdown: "body two",
  },
];

describe("buildRssFeed", () => {
  const xml = buildRssFeed({
    source: fakeSource(posts),
    now: new Date("2026-04-01T00:00:00Z"),
  });

  it("produces a well-formed RSS 2.0 channel", () => {
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("</channel>");
    expect(xml).toContain("</rss>");
    // atom:link self-reference validators expect
    expect(xml).toContain(
      `<atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />`,
    );
  });

  it("emits one <item> per post, newest first", () => {
    const items = [...xml.matchAll(/<item>/g)];
    expect(items).toHaveLength(2);
    // "newer" (2026-03) must appear before "older" (2026-01).
    expect(
      xml.indexOf("<link>" + `${ORIGIN}/${LOCALE}/blog/newer`),
    ).toBeLessThan(xml.indexOf("<link>" + `${ORIGIN}/${LOCALE}/blog/older`));
  });

  it("uses locale-prefixed guids and links", () => {
    expect(xml).toContain(`<link>${ORIGIN}/${LOCALE}/blog/newer</link>`);
    expect(xml).toContain(
      `<guid isPermaLink="true">${ORIGIN}/${LOCALE}/blog/newer</guid>`,
    );
    expect(xml).toContain(`<link>${ORIGIN}/${LOCALE}/blog/older</link>`);
  });

  it("XML-escapes title content", () => {
    // "Newer <post>" must be escaped, never emitted as a raw tag.
    expect(xml).toContain("Newer &lt;post&gt;");
    expect(xml).not.toContain("<title>Newer <post></title>");
    // ampersand in the older title is escaped too.
    expect(xml).toContain("Older &amp; wiser");
  });

  it("renders an empty channel (no items) when the source has no posts", () => {
    const empty = buildRssFeed({ source: fakeSource([]) });
    expect(empty).toContain("<channel>");
    expect(empty).not.toContain("<item>");
  });
});
