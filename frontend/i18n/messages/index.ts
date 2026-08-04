/**
 * i18n/messages/index.ts
 *
 * Exports the supported locale type and the resolveLocale helper.
 * Adapted from context-rocket/frontend/i18n/messages/*.ts structure.
 *
 * SUPPORTED_LOCALES: all locales with message files (en, es, de). The full
 *   set of locale trees that can be registered and resolved.
 *
 * ACTIVE_LOCALES: the subset that appears in the URL segments and
 *   LocaleSwitcher. Derived from siteConfig.locales. Set this to a single
 *   locale (e.g. ["en"]) to collapse multi-language UI surface while keeping
 *   the message files available as fallback.
 *
 * The `en` tree is always bundled (fallback). `es` and `de` are lazy-loaded
 * on the client side by LocaleProvider.
 */

import { siteConfig } from "@/site.config";

export const SUPPORTED_LOCALES = ["en", "es", "de"] as const;

/** All locales the site actively serves (from siteConfig.locales). */
export const ACTIVE_LOCALES: readonly string[] = siteConfig.locales;

/** All locale codes supported by the message files. */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Resolve a raw locale string (e.g. from a cookie or Accept-Language header)
 * into a SupportedLocale, falling back to "en" for any unknown value.
 */
export function resolveLocale(raw: string | undefined | null): SupportedLocale {
  if (raw && (SUPPORTED_LOCALES as readonly string[]).includes(raw)) {
    return raw as SupportedLocale;
  }
  return "en";
}
