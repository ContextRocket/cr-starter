/**
 * Unit: buildAlternates -- canonical + hreflang alternates for localized pages.
 *
 * These are pure-builder assertions (no Next runtime): the canonical is the
 * current locale's prefixed path, the languages map covers every supported
 * locale plus an `x-default` pointing at the default locale, and the map is
 * reciprocal (every locale maps to its own prefixed variant of the same path).
 */

import { describe, it, expect } from "vitest";
import { buildAlternates } from "@/lib/seo";
import { SUPPORTED_LOCALES } from "@/i18n/messages";
import { siteConfig } from "@/config/site.config";

describe("buildAlternates", () => {
  it("canonical is the current locale's prefixed path", () => {
    expect(buildAlternates("es", "/faq").canonical).toBe("/es/faq");
    // Home (empty in-locale path) canonical is just the locale segment.
    expect(buildAlternates("en", "").canonical).toBe("/en");
  });

  it("languages map covers every supported locale plus x-default", () => {
    const { languages } = buildAlternates("en", "/pricing");
    for (const locale of SUPPORTED_LOCALES) {
      expect(languages[locale]).toBe(`/${locale}/pricing`);
    }
    expect(languages["x-default"]).toBe(
      `/${siteConfig.defaultLocale}/pricing`,
    );
    // Exactly the supported locales + x-default, nothing extra.
    expect(Object.keys(languages).sort()).toEqual(
      [...SUPPORTED_LOCALES, "x-default"].sort(),
    );
  });

  it("is reciprocal: every locale maps to its own prefixed path", () => {
    // For any starting locale, the languages map is identical and each entry
    // is that locale's own prefixed variant of the same in-locale path.
    const path = "/blog";
    for (const from of SUPPORTED_LOCALES) {
      const { languages } = buildAlternates(from, path);
      for (const to of SUPPORTED_LOCALES) {
        expect(languages[to]).toBe(`/${to}${path}`);
      }
    }
  });

  it("x-default resolves to the default locale variant", () => {
    const { languages } = buildAlternates("de", "/about");
    expect(languages["x-default"]).toBe(
      `/${siteConfig.defaultLocale}/about`,
    );
    // defaultLocale entry and x-default point at the same URL.
    expect(languages["x-default"]).toBe(
      languages[siteConfig.defaultLocale],
    );
  });
});
