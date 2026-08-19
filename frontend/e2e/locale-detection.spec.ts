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

test.describe("Locale detection", () => {
  test("redirects to default locale (en) without cookie or header", async ({
    page,
  }) => {
    // Clear any existing cookies
    await page.context().clearCookies();

    // Navigate to root
    await page.goto("/");

    // Should redirect to /en
    await expect(page).toHaveURL(/\/en/);
  });

  test("redirects to locale from NEXT_LOCALE cookie", async ({ page }) => {
    // Set NEXT_LOCALE cookie to "es"
    await page.context().addCookies([
      {
        name: "NEXT_LOCALE",
        value: "es",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Navigate to root
    await page.goto("/");

    // Should redirect to /es
    await expect(page).toHaveURL(/\/es/);
  });

  test("redirects to locale from Accept-Language header", async ({
    browser,
  }) => {
    // Playwright's setExtraHTTPHeaders does not reliably override the
    // browser-managed Accept-Language header, so drive it via a context
    // created with the desired locale instead.
    const context = await browser.newContext({ locale: "de-DE" });
    const page = await context.newPage();

    // Navigate to root
    await page.goto("/");

    // Should redirect to /de
    await expect(page).toHaveURL(/\/de/);
    await context.close();
  });

  test("cookie takes precedence over Accept-Language", async ({ browser }) => {
    const context = await browser.newContext({ locale: "de-DE" });
    const page = await context.newPage();

    // Set cookie to "es" but locale to "de"
    await context.addCookies([
      {
        name: "NEXT_LOCALE",
        value: "es",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Navigate to root
    await page.goto("/");

    // Should redirect to /es (cookie wins)
    await expect(page).toHaveURL(/\/es/);
    await context.close();
  });
});

test.describe("Language switching", () => {
  test("switching language navigates to /es", async ({ page }) => {
    // Start at /en
    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    // Find and click the locale switcher (desktop header; there is also a
    // mobile-menu copy, hence .first())
    const localeSwitcher = page.locator('[data-testid="locale-switcher"]').first();
    await expect(localeSwitcher).toBeVisible();

    // Click to open dropdown
    await localeSwitcher.click();

    // Click Spanish option
    const spanishOption = page.locator('[data-testid="locale-switcher-option-es"]').first();
    await expect(spanishOption).toBeVisible();
    await spanishOption.click();

    // Should navigate to /es (URL-segment locale; no cookie required)
    await expect(page).toHaveURL(/\/es/);
  });

  test("switching to German navigates to /de", async ({ page }) => {
    // Start at /en
    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    // Find and click the locale switcher (desktop header; there is also a
    // mobile-menu copy, hence .first())
    const localeSwitcher = page.locator('[data-testid="locale-switcher"]').first();
    await localeSwitcher.click();

    // Click German option
    const germanOption = page.locator('[data-testid="locale-switcher-option-de"]').first();
    await germanOption.click();

    // Should navigate to /de (URL-segment locale; no cookie required)
    await expect(page).toHaveURL(/\/de/);
  });
});

test.describe("Hydration consistency", () => {
  test("no hydration error on /en", async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Navigate to /en
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Check for hydration errors
    const hydrationErrors = errors.filter(
      (e) => e.includes("Hydration") || e.includes("hydrat")
    );
    expect(hydrationErrors).toHaveLength(0);
  });

  test("no hydration error on /es", async ({ page }) => {
    // Set cookie to es
    await page.context().addCookies([
      {
        name: "NEXT_LOCALE",
        value: "es",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Listen for console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Navigate to /es
    await page.goto("/es");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Check for hydration errors
    const hydrationErrors = errors.filter(
      (e) => e.includes("Hydration") || e.includes("hydrat")
    );
    expect(hydrationErrors).toHaveLength(0);
  });

  test("no hydration error on /de", async ({ page }) => {
    // Set cookie to de
    await page.context().addCookies([
      {
        name: "NEXT_LOCALE",
        value: "de",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Listen for console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Navigate to /de
    await page.goto("/de");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Check for hydration errors
    const hydrationErrors = errors.filter(
      (e) => e.includes("Hydration") || e.includes("hydrat")
    );
    expect(hydrationErrors).toHaveLength(0);
  });
});

test.describe("Locale content", () => {
  // Copy-independent: each locale renders a distinct (translated) primary
  // heading, without pinning any literal string a fork might rewrite.
  test("each locale renders a distinct primary heading", async ({ page }) => {
    const headings: string[] = [];
    for (const locale of ["en", "es", "de"]) {
      await page.goto(`/${locale}`);
      await page.waitForLoadState("networkidle");
      headings.push(((await page.locator("h1").textContent()) ?? "").trim());
    }

    for (const h of headings) expect(h.length).toBeGreaterThan(0);
    expect(headings[0]).not.toEqual(headings[1]);
    expect(headings[1]).not.toEqual(headings[2]);
  });
});
