import { test, expect } from "@playwright/test";

/**
 * E2E: the data-surface split (Layer 2 -- one token foundation, two surfaces).
 *
 * The marketing surface (site default, set on <body>) resolves the sans/Geist
 * face and a rounded `--radius`; the terminal surface (the
 * `[data-surface="terminal"]` wrapper under the (terminal) route group)
 * resolves the mono face and `--radius: 0px`. We probe computed style -- the
 * same probe the Layer-2 lane used -- never a screenshot.
 *
 * Deterministic + cross-OS: no screenshots, no DB.
 */

test.describe("Surface split", () => {
  test("marketing default resolves the sans face and a rounded radius", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    // <body data-surface="marketing"> -- read its resolved font + radius token.
    const { fontFamily, radius } = await page.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return {
        fontFamily: cs.fontFamily,
        radius: cs.getPropertyValue("--radius").trim(),
      };
    });

    // sans/Geist face (not the mono face).
    expect(fontFamily.toLowerCase()).toMatch(/geist|sans-serif/);
    expect(fontFamily.toLowerCase()).not.toContain("mono");
    // rounded corners -- a non-zero rem radius. Browsers may serialise the
    // custom-property value as either "0.5rem" or ".5rem".
    expect(radius).toMatch(/^0?\.5rem$/);
  });

  test("terminal surface resolves the mono face and a 0px radius", async ({
    page,
  }) => {
    // The (terminal) route group was removed; the terminal surface is now
    // previewed via the ?surface=terminal override (enabled in the E2E build).
    await page.goto("/en?surface=terminal", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toHaveAttribute("data-surface", "terminal");

    const { fontFamily, radius } = await page.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return {
        fontFamily: cs.fontFamily,
        radius: cs.getPropertyValue("--radius").trim(),
      };
    });

    // mono face.
    expect(fontFamily.toLowerCase()).toMatch(/mono/);
    // square corners.
    expect(radius).toBe("0px");
  });
});
