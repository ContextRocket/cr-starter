import { describe, expect, it } from "vitest";
import { buildTopicSitemapEntries } from "@/lib/public-site";

describe("topic sitemap entries", () => {
  it("uses localized topic routes and emits language alternates", () => {
    const entries = buildTopicSitemapEntries(
      [{ slug: "agentic-commerce", updated: "2026-11-01" }],
      ["en", "es", "de"],
      "en",
      false,
    );

    expect(entries.map(({ loc }) => loc)).toEqual([
      "https://example.com/en/blog/topics/",
      "https://example.com/en/blog/topics/agentic-commerce/",
    ]);
    expect(entries[0]?.alternates).toEqual({
      en: "https://example.com/en/blog/topics/",
      es: "https://example.com/es/blog/topics/",
      de: "https://example.com/de/blog/topics/",
      "x-default": "https://example.com/en/blog/topics/",
    });
    expect(entries[1]?.alternates).toEqual({
      en: "https://example.com/en/blog/topics/agentic-commerce/",
      es: "https://example.com/es/blog/topics/agentic-commerce/",
      de: "https://example.com/de/blog/topics/agentic-commerce/",
      "x-default": "https://example.com/en/blog/topics/agentic-commerce/",
    });
  });
});
