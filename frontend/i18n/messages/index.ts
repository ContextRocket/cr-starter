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
 *   LocaleSwitcher AND that `generateStaticParams` prerenders. Derived from
 *   siteConfig.locales, optionally narrowed via `NEXT_PUBLIC_CR_UI_LOCALES`
 *   (see `computeActiveUiLocales`) so a dev build compiles only the languages
 *   it needs.
 *
 * English is bundled as the fallback. Other configured locale trees are
 * loaded through the generated client loader (client) or the lazy
 * register-server (server) only when selected.
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
 * time via `NEXT_PUBLIC_CR_UI_LOCALES` so Next only generates / compiles pages
 * (and, via the lazy register-server, message trees) for the locales it needs.
 * As the marketing corpus grows this is the difference between a fast first
 * `make start-frontend` and waiting on every language:
 *
 *   NEXT_PUBLIC_CR_UI_LOCALES=fast    -> a single locale (English when it is a
 *                                        configured locale, otherwise the first
 *                                        configured one); what
 *                                        `make start-frontend-fast` sets
 *   NEXT_PUBLIC_CR_UI_LOCALES=en,es   -> exactly those (unconfigured tokens
 *                                        dropped)
 *   (unset)                           -> every configured locale (production)
 *
 * It can only ever NARROW the configured set: an unconfigured locale, or a
 * value that narrows to nothing, is ignored and the full set is used -- so this
 * can never break production or request a locale with no messages. Message
 * files stay fully available (SUPPORTED_LOCALES is untouched). `NEXT_PUBLIC_` so
 * server and client compute the same value (no hydration mismatch).
 *
 * Pure (takes the configured set and the raw env value as arguments) so it is
 * directly testable without module-reset gymnastics.
 */
export function computeActiveUiLocales(
  configured: readonly string[],
  raw: string | undefined,
): readonly string[] {
  const value = raw?.trim();
  if (!value) return configured;
  if (value.toLowerCase() === "fast") {
    return [configured.includes("en") ? "en" : configured[0]];
  }
  const requested = value
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter((token) => configured.includes(token));
  return requested.length > 0 ? requested : configured;
}

/** All locales the site actively serves (see `computeActiveUiLocales`). */
export const ACTIVE_LOCALES: readonly string[] = computeActiveUiLocales(
  siteConfig.locales as readonly string[],
  process.env.NEXT_PUBLIC_CR_UI_LOCALES,
);

/** Site default, validated against the generated message registry. */
export const DEFAULT_LOCALE: SupportedLocale = (
  SUPPORTED_LOCALES as readonly string[]
).includes(siteConfig.defaultLocale)
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
