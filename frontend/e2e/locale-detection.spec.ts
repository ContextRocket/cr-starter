/**
 * Locale detection and switching tests.
 *
 * Tests:
 * - Root redirect respects NEXT_LOCALE cookie
 * - Root redirect respects Accept-Language header
 * - Root redirect falls back to default locale (en)
 * - Language switching updates cookie and navigates
 * - Hydration consistency (no server/client mismatch)
 */

import { test, expect } from "@playwright/test";
import { siteConfig } from "../config/site.config";

const DEFAULT_LOCALE = siteConfig.defaultLocale;
const ALTERNATE_LOCALE = siteConfig.locales.find(
  (locale) => locale !== DEFAULT_LOCALE,
);

function browserLanguageTag(locale: string): string {
  const region = locale === "zh" ? "CN" : locale.toUpperCase();
  return `${locale}-${region}`;
}

test.describe("Locale detection", () => {
  test("redirects to the configured default locale without cookie or header", async ({
    page,
  }) => {
    // Clear any existing cookies
    await page.context().clearCookies();

    // Navigate to root
    await page.goto("/");

    await expect(page).toHaveURL(new RegExp(`/${DEFAULT_LOCALE}`));
  });

  test("redirects to locale from NEXT_LOCALE cookie", async ({ page }) => {
    test.skip(!ALTERNATE_LOCALE, "only one locale is configured");
    // Set NEXT_LOCALE cookie to "es"
    await page.context().addCookies([
      {
        name: "NEXT_LOCALE",
        value: ALTERNATE_LOCALE!,
        domain: "localhost",
        path: "/",
      },
    ]);

    // Navigate to root
    await page.goto("/");

    await expect(page).toHaveURL(new RegExp(`/${ALTERNATE_LOCALE}`));
  });

  test("redirects to locale from Accept-Language header", async ({
    browser,
  }) => {
    test.skip(!ALTERNATE_LOCALE, "only one locale is configured");
    // Playwright's setExtraHTTPHeaders does not reliably override the
    // browser-managed Accept-Language header, so drive it via a context
    // created with the desired locale instead.
    const context = await browser.newContext({
      locale: browserLanguageTag(ALTERNATE_LOCALE!),
    });
    const page = await context.newPage();

    // Navigate to root
    await page.goto("/");

    await expect(page).toHaveURL(new RegExp(`/${ALTERNATE_LOCALE}`));
    await context.close();
  });

  test("cookie takes precedence over Accept-Language", async ({ browser }) => {
    test.skip(!ALTERNATE_LOCALE, "only one locale is configured");
    const browserPreferredLocale =
      siteConfig.locales.find((locale) => locale !== ALTERNATE_LOCALE) ??
      DEFAULT_LOCALE;
    const context = await browser.newContext({
      locale: browserLanguageTag(browserPreferredLocale),
    });
    const page = await context.newPage();

    // Set the alternate cookie while the browser prefers another locale.
    await context.addCookies([
      {
        name: "NEXT_LOCALE",
        value: ALTERNATE_LOCALE!,
        domain: "localhost",
        path: "/",
      },
    ]);

    // Navigate to root
    await page.goto("/");

    await expect(page).toHaveURL(new RegExp(`/${ALTERNATE_LOCALE}`));
    await context.close();
  });
});

test.describe("Language switching", () => {
  test("switching language navigates to the configured alternate locale", async ({ page }) => {
    test.skip(!ALTERNATE_LOCALE, "only one locale is configured");
    await page.goto(`/${DEFAULT_LOCALE}`);
    await page.waitForLoadState("networkidle");

    // Find and click the locale switcher (desktop header; there is also a
    // mobile-menu copy, hence .first())
    const localeSwitcher = page.locator('[data-testid="locale-switcher"]').first();
    await expect(localeSwitcher).toBeVisible();

    // Click to open dropdown
    await localeSwitcher.click();

    const alternateOption = page.locator(
      `[data-testid="locale-switcher-option-${ALTERNATE_LOCALE}"]`,
    ).first();
    await expect(alternateOption).toBeVisible();
    await alternateOption.click();

    await expect(page).toHaveURL(new RegExp(`/${ALTERNATE_LOCALE}`));
  });
});

test.describe("Hydration consistency", () => {
  for (const locale of siteConfig.locales) {
    test(`no hydration error on /${locale}`, async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto(`/${locale}`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Check for hydration errors
    const hydrationErrors = errors.filter(
      (e) => e.includes("Hydration") || e.includes("hydrat")
    );
    expect(hydrationErrors).toHaveLength(0);
    });
  }
});

test.describe("Locale content", () => {
  // Copy-independent: each locale renders a distinct (translated) primary
  // heading, without pinning any literal string a fork might rewrite.
  test("each locale renders a distinct primary heading", async ({ page }) => {
    const headings: string[] = [];
    for (const locale of siteConfig.locales) {
      await page.goto(`/${locale}`);
      await page.waitForLoadState("networkidle");
      headings.push(((await page.locator("h1").textContent()) ?? "").trim());
    }

    for (const h of headings) expect(h.length).toBeGreaterThan(0);
    expect(headings[0]).not.toEqual(headings[1]);
    expect(headings[1]).not.toEqual(headings[2]);
  });
});
