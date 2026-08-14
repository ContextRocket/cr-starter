import { test, expect, type Page } from "@playwright/test";

/**
 * E2E: SEO surfaces + structured data (against the served build).
 *
 * Covers the machine-readable surfaces answer engines and crawlers read:
 *  - reachability + content-type of the well-known SEO routes,
 *  - per-page canonical + hreflang alternates,
 *  - inline JSON-LD (Organization + WebSite on home; BlogPosting +
 *    BreadcrumbList on a blog post when one exists).
 *
 * Deterministic + cross-OS: no screenshots, no DB.
 */

interface SeoRoute {
  path: string;
  contentType: RegExp;
}

const SEO_ROUTES: SeoRoute[] = [
  { path: "/robots.txt", contentType: /text\/plain/ },
  { path: "/sitemap.xml", contentType: /(application|text)\/xml/ },
  { path: "/llms.txt", contentType: /text\/markdown/ },
  { path: "/llms-full.txt", contentType: /text\/markdown/ },
  { path: "/.well-known/security.txt", contentType: /text\/plain/ },
  { path: "/.well-known/agent.json", contentType: /application\/json/ },
  { path: "/feed.xml", contentType: /application\/rss\+xml/ },
];

test.describe("SEO well-known routes", () => {
  for (const { path, contentType } of SEO_ROUTES) {
    test(`${path} returns 200 with expected content-type and non-empty body`, async ({
      request,
    }) => {
      const res = await request.get(path);
      expect(res.status(), `${path} status`).toBe(200);
      expect(res.headers()["content-type"] ?? "").toMatch(contentType);
      const body = await res.text();
      expect(body.trim().length, `${path} body`).toBeGreaterThan(0);
    });
  }

  test("sitemap.xml contains xhtml:link hreflang entries", async ({
    request,
  }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<xhtml:link");
    expect(body).toContain('rel="alternate"');
    expect(body).toContain("hreflang=");
  });
});

test.describe("Per-page head alternates", () => {
  test("/es/faq has a canonical and en/es/de + x-default hreflang alternates", async ({
    page,
  }) => {
    await page.goto("/es/faq", { waitUntil: "domcontentloaded" });

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/es\/faq$/);

    for (const hreflang of ["en", "es", "de", "x-default"]) {
      const alt = page.locator(
        `link[rel="alternate"][hreflang="${hreflang}"]`,
      );
      await expect(
        alt,
        `hreflang=${hreflang} alternate missing`,
      ).toHaveCount(1);
    }
  });
});

async function readJsonLd(page: Page): Promise<Record<string, unknown>[]> {
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const nodes: Record<string, unknown>[] = [];
  for (const text of raw) {
    const parsed = JSON.parse(text);
    // A script may hold a single node or an array of nodes.
    if (Array.isArray(parsed)) nodes.push(...parsed);
    else nodes.push(parsed);
  }
  return nodes;
}

test.describe("JSON-LD structured data", () => {
  test("home emits Organization + WebSite JSON-LD", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const nodes = await readJsonLd(page);
    const types = nodes.map((n) => n["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");
  });

  test("a blog post emits BlogPosting + BreadcrumbList JSON-LD", async ({
    page,
  }) => {
    // Discover a post from the listing; the starter ships no seeded posts, so
    // skip cleanly when none exist (the builders are unit-covered regardless).
    await page.goto("/en/blog", { waitUntil: "domcontentloaded" });
    const firstPost = page.locator('[data-testid^="blog-post-"] a').first();
    const count = await firstPost.count();
    test.skip(count === 0, "no blog posts published in this build");

    await firstPost.click();
    await page.waitForLoadState("domcontentloaded");

    const nodes = await readJsonLd(page);
    const types = nodes.map((n) => n["@type"]);
    expect(types).toContain("BlogPosting");
    expect(types).toContain("BreadcrumbList");
  });
});
