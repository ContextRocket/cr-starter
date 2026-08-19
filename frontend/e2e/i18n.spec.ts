import { test, expect } from "@playwright/test";

/**
 * E2E: locale switching (en -> es -> de) -- copy-independent.
 *
 * Asserts the locale CONTRACT, not literal copy (forks rewrite their strings):
 *   - navigating between locale prefixes updates <html lang>
 *   - each locale's FAQ page renders a primary heading
 *   - the LocaleSwitcher is present on the home page
 *   - the public home page is indexable (no noindex robots meta)
 *
 * Copy assertions live at the module/component level (i18n parity check +
 * Vitest component tests), not here.
 */

const LOCALES: Array<"en" | "es" | "de"> = ["en", "es", "de"];

test.describe("Locale switching", () => {
  test("en -> es -> de updates <html lang> and renders the FAQ page", async ({
    page,
  }) => {
    for (const locale of LOCALES) {
      await page.goto(`/${locale}/faq`, { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(
        page.getByRole("heading", { level: 1 }),
      ).toBeVisible();
    }
  });

  test("the LocaleSwitcher is present on the home page", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    // May render twice (desktop vs mobile nav) depending on the viewport/chrome.
    await expect(page.getByTestId("locale-switcher")).not.toHaveCount(0);
  });

  test("public home page is indexable (no noindex robots meta)", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    const robots = page.locator('meta[name="robots"]');
    if ((await robots.count()) > 0) {
      const content = (await robots.first().getAttribute("content")) ?? "";
      expect(content).not.toContain("noindex");
    }
  });
});
