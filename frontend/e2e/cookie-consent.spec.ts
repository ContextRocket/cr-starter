import { test, expect, type BrowserContext, type Page } from "@playwright/test";

/**
 * E2E regression: the cookie-consent banner must ACTUALLY render end-to-end.
 *
 * THE BUG THIS CATCHES
 * --------------------
 * The cookie-consent banner is a *config-gated* component: it shows only when
 * `siteConfig.features.cookieConsent` and the live `analyticsConfigured()` gate
 * agree. The existing unit test
 * (__tests__/components/cookie-consent-banner.test.tsx) MOCKS both
 * `analyticsConfigured()` and the site config, so it stays green even when the
 * REAL rendered app fails to show the banner — which is exactly what shipped.
 *
 * This spec exercises the REAL integration: the app under test is built with a
 * genuine analytics key (NEXT_PUBLIC_GA_MEASUREMENT_ID, so analyticsConfigured()
 * is truly true) and the SHIPPED default `cookieConsent: "auto"` (aliased in via
 * next.config.mjs -> e2e/fixtures/site-config-cookie-auto.ts, without touching
 * the tracked site.config.ts). See scripts/e2e-cookie-consent-server.mjs +
 * playwright.cookie-consent.config.ts.
 *
 * FORK PATTERN — "config-gated consent component: verify it actually renders":
 *   1. Build the app so the REAL gate (env key + config) is satisfied.
 *   2. Use a FRESH browser context (no stored consent) to assert the DOM shows
 *      the banner. A mocked unit test cannot prove this.
 *   3. Assert the consent flow (Accept / Decline) persists and suppresses it.
 *   4. Assert the negative gate (analytics off / cookieConsent off) hides it.
 * Copy this recipe for any other env/config-gated surface.
 *
 * Consent state lives in localStorage (lib/analytics.ts, key
 * "cr_analytics_consent"). We control it with fresh contexts + localStorage.clear
 * so each case starts from "no prior choice".
 */

const BANNER = '[data-testid="cookie-consent-banner"]';
const ACCEPT = '[data-testid="cookie-consent-accept"]';
const DECLINE = '[data-testid="cookie-consent-decline"]';
const CONSENT_KEY = "cr_analytics_consent";

// Load /en and clear any stored consent so the visibility decision runs from a
// clean "no prior choice" state, then reload so the client effect re-evaluates.
async function gotoFreshEn(page: Page): Promise<void> {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.evaluate((key) => localStorage.removeItem(key), CONSENT_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
}

test.describe("cookie-consent banner (real analytics-gated integration)", () => {
  // ── Positive: THE bug. analytics configured + auto + no consent -> visible ──
  test("banner IS visible on a fresh /en when analytics is configured (auto)", async ({
    page,
  }) => {
    await gotoFreshEn(page);
    // This assertion would have caught the shipped bug: the unit test passed
    // while the real app rendered nothing here.
    await expect(page.locator(BANNER)).toBeVisible();
  });

  // ── Flow: Accept persists consent and suppresses the banner on reload ──────
  test("clicking Accept persists consent and hides the banner after reload", async ({
    page,
  }) => {
    await gotoFreshEn(page);
    await expect(page.locator(BANNER)).toBeVisible();

    await page.locator(ACCEPT).click();
    await expect(page.locator(BANNER)).toHaveCount(0);

    // Consent is persisted, so a reload must NOT re-show the banner.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(BANNER)).toHaveCount(0);

    const stored = await page.evaluate(
      (key) => localStorage.getItem(key),
      CONSENT_KEY,
    );
    expect(stored).toBe("granted");
  });

  // ── Flow: Decline (fresh context) persists denial and suppresses banner ────
  test("clicking Decline persists denial and hides the banner after reload", async ({
    browser,
  }) => {
    // Fresh context => no consent carried from the Accept case above.
    const context: BrowserContext = await browser.newContext();
    const page = await context.newPage();
    try {
      await gotoFreshEn(page);
      await expect(page.locator(BANNER)).toBeVisible();

      await page.locator(DECLINE).click();
      await expect(page.locator(BANNER)).toHaveCount(0);

      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator(BANNER)).toHaveCount(0);

      const stored = await page.evaluate(
        (key) => localStorage.getItem(key),
        CONSENT_KEY,
      );
      expect(stored).toBe("denied");
    } finally {
      await context.close();
    }
  });

  // ── Negative: once a choice is recorded, the banner never returns ──────────
  test("a recorded consent choice suppresses the banner on a fresh page load", async ({
    browser,
  }) => {
    const context: BrowserContext = await browser.newContext();
    const page = await context.newPage();
    try {
      // Seed a prior choice, then load /en: the banner must stay hidden.
      await page.goto("/en", { waitUntil: "domcontentloaded" });
      await page.evaluate(({ key }) => localStorage.setItem(key, "granted"), {
        key: CONSENT_KEY,
      });
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator(BANNER)).toHaveCount(0);
    } finally {
      await context.close();
    }
  });
});
