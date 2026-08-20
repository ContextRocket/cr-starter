import { test, expect } from "@playwright/test";
import { siteConfig } from "../config/site.config";

const extraLocale =
  process.env.I18N_TEST_EXTRA_LOCALE ??
  siteConfig.locales.find((locale) => locale !== siteConfig.defaultLocale) ??
  siteConfig.defaultLocale;

/**
 * This test intentionally runs against Next's development server. The
 * request-scoped locale translator must not reuse the previous locale when a
 * browser navigates between locale-prefixed routes in one session. The
 * locale is configurable so a fork can run the same regression against a
 * newly added bundle (for example CR-GBA's `zh`).
 */
test("locale navigation does not hydrate with the previous locale", async ({
  page,
}) => {
  const hydrationErrors: string[] = [];

  const recordHydrationError = (message: string) => {
    if (
      message.includes("Hydration failed") ||
      message.includes("A tree hydrated but some attributes") ||
      message.includes("hydration-mismatch")
    ) {
      hydrationErrors.push(message);
    }
  };

  page.on("pageerror", (error) => recordHydrationError(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") recordHydrationError(message.text());
  });

  // Keep the trailing slash and repeat the transitions: the development
  // server race is intermittent on a single change but deterministic across
  // the normal locale sequence.
  for (const locale of ["en", extraLocale, extraLocale] as const) {
    await page.goto(`/${locale}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(500);

  await expect(page.locator("html")).toHaveAttribute("lang", extraLocale);
  expect([...new Set(hydrationErrors)]).toEqual([]);
});
