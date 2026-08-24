/**
 * i18n/keys.ts -- single entry point for all user-facing string lookups.
 *
 * Two API patterns are available:
 *   Pattern A (pure functional): import { t } from "@/i18n/keys"; t("key")
 *   Pattern B (React context):   const { t } = useTranslations(); t("key")
 *
 * Both resolve through the same translator.ts core. This file provides
 * Pattern A -- a synchronous, stateful API with global locale management.
 *
 * Server components call setLocale(locale) at the top of the [locale] layout
 * before using t(). Client components get locale from LocaleProvider which
 * calls setLocale() internally.
 *
 * LOCALE RESOLUTION:
 *   - Server: React.cache provides per-request isolation.
 *   - Client: module variable (set by LocaleProvider).
 *   - English is always bundled as fallback.
 */

import { cache } from "react";
import { en } from "./messages/en";
import {
  createTranslator,
  createArrayTranslator,
  translateError as baseTranslateError,
  type Path,
  type Messages,
  type Translator,
  type ArrayTranslator,
  type TranslationValues,
} from "./translator";
import { type SupportedLocale } from "./messages/registry";
import { resolveLocale } from "./messages";

// Re-export types for consumers.
export type {
  Path,
  SupportedLocale,
  Translator,
  ArrayTranslator,
  TranslationValues,
  Messages,
};

// ─────────────────────────────────────────────────────────────────────────────
// Runtime message registry
// ─────────────────────────────────────────────────────────────────────────────

const _registry: Partial<Record<SupportedLocale, Messages>> = {
  en: en as unknown as Messages,
};

/**
 * Register a locale's message tree into the runtime registry.
 * Called by register-server.ts (server) and LocaleProvider (client).
 */
export function registerLocaleMessages(
  locale: SupportedLocale,
  tree: Messages,
): void {
  _registry[locale] = tree;
}

/**
 * Resolve a translator for an explicit locale.
 *
 * Client components are server-rendered before the client LocaleProvider is
 * hydrated. They must use the locale carried by that provider rather than the
 * mutable server-side `t()` state, which can belong to a different concurrent
 * route render during development navigation.
 */
export function translateForLocale(locale: SupportedLocale): Translator {
  const messages = _registry[locale] ?? _registry.en!;
  return createTranslator(locale, messages);
}

/**
 * The registered message tree for a locale (falling back to English). Used by
 * the next-intl-compatible hooks/functions (i18n/client.tsx, i18n/server.ts) to
 * build a namespace-aware translator.
 */
export function getLocaleMessages(locale: SupportedLocale): Messages {
  return _registry[locale] ?? _registry.en!;
}

// ─────────────────────────────────────────────────────────────────────────────
// Locale state
// ─────────────────────────────────────────────────────────────────────────────

const getRequestLocaleStore = cache((): { locale: SupportedLocale } => ({
  locale: "en",
}));

let _clientLocale: SupportedLocale | null = null;

/** Set the active UI locale. Called by LocaleProvider and the [locale] layout. */
export function setLocale(locale: SupportedLocale): void {
  if (typeof window !== "undefined") {
    _clientLocale = locale;
  }
  getRequestLocaleStore().locale = locale;
}

/** Resolve the current locale for the active environment. */
export function getCurrentLocale(): SupportedLocale {
  if (typeof window === "undefined") {
    return getRequestLocaleStore().locale;
  }
  if (_clientLocale) return _clientLocale;
  return resolveLocale(document.documentElement.lang);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Translate a key in the active locale. Falls back to English. Throws on
 * missing key (fail-fast). Supports {param} interpolation.
 *
 *   t("home.hero.headline")
 *   t("home.testimonials.ratingLabel", { rating: "4.8" })
 */
export function t(
  key: Path | (string & {}),
  params?: TranslationValues,
): string {
  const locale = getCurrentLocale();
  return translateForLocale(locale)(key, params);
}

/**
 * Resolve an array-shaped leaf in the active locale. Returns empty array
 * for non-array keys (never throws).
 */
export function tArray(key: Path | (string & {})): readonly string[] {
  const locale = getCurrentLocale();
  const messages = _registry[locale] ?? _registry.en!;
  return createArrayTranslator(locale, messages)(key);
}

/**
 * Translate a backend error key. Returns the raw string unchanged when
 * it is not a known key (never throws).
 */
export function translateError(
  raw: string,
  params?: TranslationValues,
): string {
  const locale = getCurrentLocale();
  const messages = _registry[locale] ?? _registry.en!;
  return baseTranslateError(messages, raw, en as unknown as Messages, params);
}
