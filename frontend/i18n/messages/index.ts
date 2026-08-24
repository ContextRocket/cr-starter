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

/**
 * Which locales the site actively serves -- the URL segments the LocaleSwitcher
 * shows AND the set `generateStaticParams` prerenders. It is
 * `siteConfig.locales` (the production truth), optionally NARROWED at build/dev
 * time via `NEXT_PUBLIC_CR_LOCALES` (comma-separated) so a dev/static build only
 * generates the languages you are reviewing:
 *
 *   NEXT_PUBLIC_CR_LOCALES=en      -> English only (fastest; single-locale UI)
 *   NEXT_PUBLIC_CR_LOCALES=en,es   -> English + Spanish
 *   (unset)                        -> every configured locale (production)
 *
 * It can only ever NARROW the configured set: an unconfigured locale, or a
 * value that narrows to nothing, is ignored and the full set is used -- so this
 * can never break production or request a locale with no messages. Message
 * files stay fully available (SUPPORTED_LOCALES is untouched). `NEXT_PUBLIC_` so
 * server and client compute the same value (no hydration mismatch).
 */
function computeActiveLocales(): readonly string[] {
  const configured = siteConfig.locales as readonly string[];
  const override = process.env.NEXT_PUBLIC_CR_LOCALES?.trim();
  if (!override) return configured;
  const requested = override
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const narrowed = configured.filter((locale) => requested.includes(locale));
  return narrowed.length > 0 ? narrowed : configured;
}

/** All locales the site actively serves (see `computeActiveLocales`). */
export const ACTIVE_LOCALES: readonly string[] = computeActiveLocales();

/** Site default, validated against the generated message registry. */
export const DEFAULT_LOCALE: SupportedLocale =
  (SUPPORTED_LOCALES as readonly string[]).includes(siteConfig.defaultLocale)
    ? (siteConfig.defaultLocale as SupportedLocale)
    : "en";

/**
 * Resolve a raw locale string (e.g. from a cookie or Accept-Language header)
 * into a SupportedLocale, falling back to the configured site default.
 */
export function resolveLocale(raw: string | undefined | null): SupportedLocale {
  if (raw && (SUPPORTED_LOCALES as readonly string[]).includes(raw)) {
    return raw as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}
