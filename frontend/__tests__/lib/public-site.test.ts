import {
  PUBLIC_ROUTE_REGISTRY,
  getPublicRoutes,
} from "@/lib/public-route-registry";
import {
  buildLlmsTxt,
  buildPublicRobotsConfig,
  buildPublicSitemapEntries,
} from "@/lib/public-site";

describe("public-site contract", () => {
  it("uses the fork-owned route registry for discoverable pages", () => {
    expect(PUBLIC_ROUTE_REGISTRY.map((route) => route.key)).toEqual([
      "home",
      "blog",
      "faq",
      "privacy",
      "impressum",
      "attribution",
    ]);
    expect(
      getPublicRoutes({ indexableOnly: true }).every(
        (route) => route.indexable,
      ),
    ).toBe(true);
  });

  it("emits locale-prefixed sitemap URLs and configured alternates", () => {
    const entries = buildPublicSitemapEntries({
      baseUrl: "https://example.test",
      blogSlugs: ["welcome"],
      lastModified: new Date("2026-01-01T00:00:00.000Z"),
    });
    const home = entries.find((entry) => entry.url.endsWith("/en"));
    const faq = entries.find((entry) => entry.url.endsWith("/en/faq"));
    const post = entries.find((entry) =>
      entry.url.endsWith("/en/blog/welcome"),
    );

    expect(home?.alternates.languages).toMatchObject({
      en: "https://example.test/en",
      es: "https://example.test/es",
      de: "https://example.test/de",
      "x-default": "https://example.test/en",
    });
    expect(faq).toBeDefined();
    expect(post).toBeDefined();
    expect(
      entries.some((entry) => entry.url === "https://example.test/faq"),
    ).toBe(false);
  });

  it("derives robots and llms discovery from the same public routes", () => {
    const robots = buildPublicRobotsConfig("https://example.test");
    const aiRule = robots.rules.find((rule) => rule.userAgent === "GPTBot");
    const llms = buildLlmsTxt("https://example.test");

    expect(aiRule?.allow).toContain("/en/faq");
    expect(aiRule?.disallow).toContain("/dashboard/");
    expect(llms).toContain("https://example.test/en/faq");
    expect(llms).not.toContain("https://example.test/faq");
    expect(llms).not.toContain("llms-full");
  });
});
