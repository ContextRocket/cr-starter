import {
  PUBLIC_ROUTE_REGISTRY,
  buildLocalizedPublicPath,
  getDefaultPublicLocale,
  getPublicRoute,
  getPublicRoutes,
} from "@/lib/public-route-registry";
import {
  buildLlmsTxt,
  buildPublicRobotsConfig,
  buildPublicSitemapEntries,
} from "@/lib/public-site";
import { siteConfig } from "@/config/site.config";

describe("public-site contract", () => {
  it("uses the fork-owned route registry for discoverable pages", () => {
    const routeKeys = PUBLIC_ROUTE_REGISTRY.map((route) => route.key);
    expect(routeKeys).toContain("home");
    // Some public forks intentionally disable the blog, such as GBA.
    if (getPublicRoute("blog")) expect(routeKeys).toContain("blog");
    expect(new Set(routeKeys).size).toBe(routeKeys.length);
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
    const defaultLocale = getDefaultPublicLocale(siteConfig.locales);
    // Find the home entry by the fork's default locale, not a hardcoded /en:
    // forks may be Spanish-first (defaultLocale: es) and still inherit this test.
    const home = entries.find((entry) =>
      entry.url.endsWith(`/${defaultLocale}`),
    );
    const blogRoute = getPublicRoute("blog");
    const post = entries.find((entry) =>
      entry.url.endsWith(`/${blogRoute?.path}/welcome`),
    );

    for (const locale of siteConfig.locales) {
      expect(home?.alternates.languages[locale]).toBe(
        `https://example.test${buildLocalizedPublicPath(locale, "")}`,
      );
    }
    expect(home?.alternates.languages["x-default"]).toBe(
      `https://example.test${buildLocalizedPublicPath(defaultLocale, "")}`,
    );
    if (blogRoute) {
      expect(post).toBeDefined();
    } else {
      expect(post).toBeUndefined();
    }
    expect(
      entries.some(
        (entry) => entry.url === `https://example.test${blogRoute?.path}`,
      ),
    ).toBe(false);
  });

  it("derives robots and llms discovery from the same public routes", () => {
    const robots = buildPublicRobotsConfig("https://example.test");
    const aiRule = robots.rules.find((rule) => rule.userAgent === "GPTBot");
    const llms = buildLlmsTxt("https://example.test");

    const blogRoute = getPublicRoute("blog");
    const defaultLocale = getDefaultPublicLocale(siteConfig.locales);
    const localizedBlogPath = buildLocalizedPublicPath(
      defaultLocale,
      blogRoute?.path ?? "blog",
    );

    expect(aiRule?.disallow).toContain("/dashboard/");
    if (blogRoute) {
      expect(aiRule?.allow).toContain(localizedBlogPath);
      expect(llms).toContain(`https://example.test${localizedBlogPath}`);
      expect(llms).not.toContain(`https://example.test${blogRoute.path}`);
    } else {
      expect(aiRule?.allow).not.toContain(localizedBlogPath);
      expect(llms).not.toContain("/blog");
    }
    expect(llms).not.toContain("llms-full");
  });
});
