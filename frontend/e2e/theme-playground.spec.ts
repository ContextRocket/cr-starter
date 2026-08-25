/**
 * Theme playground URL overrides (copy-independent).
 *
 * Proves the dev affordance works: ?surface= flips the marketing/terminal
 * surface. These are structural assertions (attribute), not color assertions,
 * so they survive fork re-branding.
 */

import { test, expect } from "@playwright/test";

test.describe("Theme playground", () => {
  test("?surface=terminal switches the body to the terminal surface", async ({
    page,
  }) => {
    await page.goto("/en?surface=terminal");
    await expect(page.locator("body")).toHaveAttribute(
      "data-surface",
      "terminal",
    );
  });

  test("?surface=marketing restores the marketing surface", async ({
    page,
  }) => {
    await page.goto("/en?surface=marketing");
    await expect(page.locator("body")).toHaveAttribute(
      "data-surface",
      "marketing",
    );
  });
});
