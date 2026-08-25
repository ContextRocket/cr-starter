import { describe, expect, it } from "vitest";

import { ACTIVE_LOCALES, computeActiveUiLocales } from "@/i18n/messages";

/**
 * `computeActiveUiLocales` is the pure resolver behind `ACTIVE_LOCALES` (which
 * narrows `siteConfig.locales` -> `generateStaticParams` / routing / the
 * LocaleSwitcher, and via the lazy register-server the compiled message trees).
 * Testing it directly -- passing the configured set explicitly -- proves every
 * branch of the `NEXT_PUBLIC_CR_UI_LOCALES` contract without module-reset
 * gymnastics.
 */
describe("computeActiveUiLocales (NEXT_PUBLIC_CR_UI_LOCALES contract)", () => {
  const configured = ["en", "es", "de"] as const;

  it("defaults to the configured set when unset (production / normal dev)", () => {
    expect([...computeActiveUiLocales(configured, undefined)]).toEqual([
      "en",
      "es",
      "de",
    ]);
    expect([...computeActiveUiLocales(configured, "")]).toEqual([
      "en",
      "es",
      "de",
    ]);
    expect([...computeActiveUiLocales(configured, "   ")]).toEqual([
      "en",
      "es",
      "de",
    ]);
  });

  it("'fast' narrows to English when configured", () => {
    expect([...computeActiveUiLocales(configured, "fast")]).toEqual(["en"]);
    expect([...computeActiveUiLocales(configured, "FAST")]).toEqual(["en"]);
  });

  it("'fast' uses the first configured locale when English is absent", () => {
    // The "if there is only one other language, then that language" rule.
    expect([...computeActiveUiLocales(["de"], "fast")]).toEqual(["de"]);
    expect([...computeActiveUiLocales(["es", "de"], "fast")]).toEqual(["es"]);
  });

  it("accepts an explicit comma list and drops unconfigured tokens", () => {
    expect([...computeActiveUiLocales(configured, "en, de, xx")]).toEqual([
      "en",
      "de",
    ]);
    expect([...computeActiveUiLocales(configured, "DE")]).toEqual(["de"]);
  });

  it("falls back to the configured set for an all-unknown value", () => {
    expect([...computeActiveUiLocales(configured, "xx,yy")]).toEqual([
      "en",
      "es",
      "de",
    ]);
  });
});

describe("live ACTIVE_LOCALES export (default env, no narrowing)", () => {
  it("reflects the full configured set", () => {
    // The test process has no NEXT_PUBLIC_CR_UI_LOCALES set, so the live
    // constant reflects the production/full-set default (siteConfig.locales).
    expect([...ACTIVE_LOCALES]).toEqual(["en", "es", "de"]);
  });
});
