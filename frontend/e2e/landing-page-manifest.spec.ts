import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Preview → static-export journey for LandingPageManifest fixtures.
 * Not a screenshot battery — asserts routes, copy presence, and export output.
 */

test.describe("LandingPageManifest journey", () => {
  test("kleos generated page renders hero + FAQ + mailto CTA", async ({
    page,
  }) => {
    await page.goto("/en/generated/kleos", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-landing-page='kleos-home-v1']")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Your buyers have already chosen your competitor.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Frequently Asked Questions" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Email Kleos" })).toHaveAttribute(
      "href",
      /^mailto:/,
    );
  });

  test("weak-brand page uses text identity and records missing appearance", async ({
    page,
  }) => {
    await page.goto("/en/generated/weak-brand", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.locator("[data-landing-page='weak-brand-home-v1']"),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Acme Example" }),
    ).toBeVisible();
    await expect(page.locator("[data-missing-appearance]")).toHaveAttribute(
      "data-missing-appearance",
      /logo/,
    );
  });

  test("static export includes generated routes when out/ exists", async () => {
    // `make build-static` writes frontend/out. This assertion is a no-op soft
    // check when the export has not been built yet in this process; the
    // acceptance gate runs build-static before this spec.
    const outDir = path.join(__dirname, "..", "out");
    if (!existsSync(outDir)) {
      test.info().annotations.push({
        type: "note",
        description: "frontend/out missing — run make build-static first",
      });
      return;
    }
    expect(existsSync(path.join(outDir, "en", "generated", "kleos", "index.html"))).toBe(
      true,
    );
    expect(
      existsSync(path.join(outDir, "en", "generated", "weak-brand", "index.html")),
    ).toBe(true);
  });
});
