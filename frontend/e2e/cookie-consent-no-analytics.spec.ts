import { test, expect, type Page } from "@playwright/test";

/**
 * E2E negative: the SHIPPED default hides the banner when analytics is off.
 *
 * This is the flip side of cookie-consent.spec.ts. The app under test here is
 * built with the shipped `cookieConsent: "auto"` default but NO analytics key,
 * so `analyticsConfigured()` is genuinely false. The auto gate must therefore
 * render NOTHING — this is the exact state the shipped starter is in
 * (context-rocket ships no analytics keys), and it must not regress into a
 * banner that appears with nothing to consent to.
 *
 * Runs against the no-analytics webServer (:3211) via the
 * "cookie-consent-no-analytics" project in playwright.cookie-consent.config.ts.
 */

const BANNER = '[data-testid="cookie-consent-banner"]';
const CONSENT_KEY = "cr_analytics_consent";

async function gotoFreshEn(page: Page): Promise<void> {
  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.evaluate((key) => localStorage.removeItem(key), CONSENT_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
}

test.describe("cookie-consent banner (analytics NOT configured)", () => {
  test("banner is NOT present on a fresh /en when analytics is off (auto default)", async ({
    page,
  }) => {
    await gotoFreshEn(page);
    // auto + no analytics + no consent -> the shipped default renders nothing.
    await expect(page.locator(BANNER)).toHaveCount(0);
  });
});
