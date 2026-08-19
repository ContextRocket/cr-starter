/**
 * Cookie banner `?showbanner` preview override (copy-independent).
 *
 * The shipped default (`cookieConsent: "auto"`, no analytics) hides the
 * banner, so these tests prove the URL override forces it visible on any page
 * -- and can pin a specific layout -- without touching config. Both layouts
 * are asserted by structural class, not copy.
 */

import { test, expect } from "@playwright/test";

test.describe("Cookie banner ?showbanner override", () => {
  test("?showbanner forces the banner when it would otherwise be hidden", async ({
    page,
  }) => {
    await page.goto("/en?showbanner");
    await expect(page.getByTestId("cookie-consent-banner")).toBeVisible();
  });

  test("?showbanner=card renders the bottom-left card layout", async ({
    page,
  }) => {
    await page.goto("/en?showbanner=card");
    const banner = page.getByTestId("cookie-consent-banner");
    await expect(banner).toBeVisible();
    // Card is width-capped and anchored bottom-left on >=sm.
    await expect(banner).toHaveClass(/sm:max-w-md/);
    await expect(banner).not.toHaveClass(/inset-x-0/);
  });

  test("?showbanner=bar renders the full-width horizontal bar", async ({
    page,
  }) => {
    await page.goto("/en?showbanner=bar");
    const banner = page.getByTestId("cookie-consent-banner");
    await expect(banner).toBeVisible();
    // Bar spans the full width.
    await expect(banner).toHaveClass(/inset-x-0/);
    await expect(banner).not.toHaveClass(/sm:max-w-md/);
  });

  test("?showbanner=terminal renders the square-cornered terminal card", async ({
    page,
  }) => {
    await page.goto("/en?showbanner=terminal");
    const banner = page.getByTestId("cookie-consent-banner");
    await expect(banner).toBeVisible();
    // Terminal surface: square corners, width-capped card.
    await expect(banner).toHaveClass(/rounded-none/);
    await expect(banner).toHaveClass(/sm:max-w-sm/);
    await expect(banner).not.toHaveClass(/inset-x-0/);
  });

  test("Manage opens the preferences dialog and Save dismisses it", async ({
    page,
  }) => {
    await page.goto("/en?showbanner");
    await expect(page.getByTestId("cookie-consent-banner")).toBeVisible();

    await page.getByTestId("cookie-consent-manage").first().click();
    const dialog = page.getByTestId("cookie-consent-dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId("cookie-consent-pref-necessary")).toBeVisible();

    await page.getByTestId("cookie-consent-save").click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByTestId("cookie-consent-banner")).not.toBeVisible();
  });
});
