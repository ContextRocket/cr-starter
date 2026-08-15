/**
 * Unit: emission points honor a custom siteConfig.blog.basePath / title.
 *
 * With a fork's blog config mocked (custom segment + title), the RSS feed and
 * the sitemap builders must emit the CUSTOM segment for the index and every
 * post — never a hardcoded "/blog". Proves the config is wired through the two
 * pure XML/URL builders (the page-level canonical/breadcrumb wiring is covered
 * by lib/blog-path + integration via next build).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BlogSource, BlogPost } from "@/lib/blog";

const SEGMENT = "/the-creator-economy-for-b2b";
const TITLE = "The Creator Economy for B2B";
const ORIGIN = "https://example.com";
const LOCALE = "en";

const posts: BlogPost[] = [
  {
    slug: "launch",
    title: "Launch post",
    author: "Alice",
    date: "2026-03-01",
    excerpt: "The launch.",
    bodyMarkdown: "body",
  },
];

function fakeSource(list: BlogPost[]): BlogSource {
  return {
    list: () => list,
    get: (slug) => list.find((p) => p.slug === slug) ?? null,
  };
}

beforeEach(() => {
  vi.resetModules();
  vi.doMock("@/site.config", () => ({
    siteConfig: {
      siteUrl: ORIGIN,
      defaultLocale: LOCALE,
      companyName: "Kleos",
      description: "A description.",
      blog: { basePath: SEGMENT, title: TITLE },
    },
  }));
});

describe("buildRssFeed with a custom blog segment", () => {
  it("uses the custom segment for channel link + item links, and the custom title", async () => {
    const { buildRssFeed } = await import("@/lib/feed");
    const xml = buildRssFeed({
      source: fakeSource(posts),
      now: new Date("2026-04-01T00:00:00Z"),
    });
    // Channel self-link + item links carry the custom segment.
    expect(xml).toContain(`<link>${ORIGIN}/${LOCALE}${SEGMENT}</link>`);
    expect(xml).toContain(
      `<link>${ORIGIN}/${LOCALE}${SEGMENT}/launch</link>`,
    );
    expect(xml).toContain(
      `<guid isPermaLink="true">${ORIGIN}/${LOCALE}${SEGMENT}/launch</guid>`,
    );
    // Feed title uses the custom blog title, never "Blog".
    expect(xml).toContain(`Kleos — ${TITLE}`);
    expect(xml).not.toContain(`${ORIGIN}/${LOCALE}/blog`);
  });
});

describe("sitemap with a custom blog segment", () => {
  it("lists the custom segment for the index and each post", async () => {
    // sitemap imports the file blog adapter; mock it to our fake posts.
    vi.doMock("@/lib/blog", () => ({
      fileBlogAdapter: fakeSource(posts),
    }));
    // The sitemap iterates SUPPORTED_LOCALES; keep it deterministic.
    vi.doMock("@/i18n/messages", () => ({
      SUPPORTED_LOCALES: [LOCALE],
    }));
    const { default: sitemap } = await import("@/app/sitemap");
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${ORIGIN}/${LOCALE}${SEGMENT}`);
    expect(urls).toContain(`${ORIGIN}/${LOCALE}${SEGMENT}/launch`);
    // No hardcoded /blog leaks through.
    expect(urls.some((u) => u.includes("/blog"))).toBe(false);
  });
});
