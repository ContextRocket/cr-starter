/**
 * i18n/messages/index.ts
 *
 * Re-exports the locale list (from the generated registry) and the
 * resolveLocale helper.
 *
 * SUPPORTED_LOCALES: every locale with a message file (auto-discovered by
 *   scripts/generate-locale-registry.mjs). The full set of locale trees.
 *
 * ACTIVE_LOCALES: the subset that appears in the URL segments and
 *   LocaleSwitcher. Derived from siteConfig.locales. Set this to a single
 *   locale (e.g. ["en"]) to collapse the multi-language UI surface.
 *
 * English is bundled as the fallback. Other configured locale trees are
 * loaded through the generated client loader only when selected.
 */

import { siteConfig } from "@/config/site.config";
import {
  SUPPORTED_LOCALES,
  LOCALE_LABEL_PATHS,
  type SupportedLocale,
} from "./registry";

export { SUPPORTED_LOCALES, LOCALE_LABEL_PATHS, type SupportedLocale };

/** All locales the site actively serves (from siteConfig.locales). */
export const ACTIVE_LOCALES: readonly string[] = siteConfig.locales;

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
