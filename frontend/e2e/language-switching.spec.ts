/**
 * Language switching tests -- copy-independent.
 *
 * These tests are inherited by forks, so they MUST NOT assert on literal
 * marketing copy (forks rewrite their hero/features/FAQ strings in
 * i18n/messages/site/*.ts). They assert only the locale CONTRACT:
 *
 *   - each locale prefix renders with the matching <html lang>
 *   - each locale page has a non-empty primary heading
 *   - the rendered copy DIFFERS across locales (proves translation is wired,
 *     without pinning any specific string)
 *
 * Copy assertions live at the module/component level (i18n parity check +
 * Vitest component tests), not here.
 */

import { test, expect } from "@playwright/test";
import { siteConfig } from "../config/site.config";

const LOCALES = siteConfig.locales;

test.describe("Language switching", () => {
  for (const locale of LOCALES) {
    test(`${locale} route renders with the matching <html lang> and content`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      await page.waitForLoadState("networkidle");

      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      const h1 = page.locator("h1");
      await expect(h1).toBeVisible();
      await expect(h1).not.toHaveText("");
    });
  }

  test("switching language changes the rendered content", async ({ page }) => {
    const headings: string[] = [];
    for (const locale of LOCALES) {
      await page.goto(`/${locale}`);
      await page.waitForLoadState("networkidle");
      headings.push(((await page.locator("h1").textContent()) ?? "").trim());
    }

    test.skip(LOCALES.length < 2, "only one locale is configured");
    // All configured locales render a heading...
    for (const h of headings) expect(h.length).toBeGreaterThan(0);
    // ...and each locale's copy differs from the others (translation is wired).
    expect(headings[0]).not.toEqual(headings[1]);
    expect(headings[1]).not.toEqual(headings[2]);
  });
});
