/**
 * i18n/keys.ts -- single entry point for all user-facing string lookups.
 *
 * Adapted from context-rocket/frontend/i18n/keys.ts.
 *
 * HOW IT WORKS:
 *   - `en` messages are always bundled (never lazy) and serve as the fallback.
 *   - Non-en locales are registered at runtime:
 *       Server: via `i18n/messages/register-server.ts` imported at the top of
 *         `app/[locale]/layout.tsx`, then the request locale is set from the
 *         URL segment (`setLocale(locale)` in the layout).
 *       Client: injected by LocaleProvider before hydration.
 *   - `t(key)` resolves the active locale first, then falls back to English,
 *     then throws if the key is completely missing (fail-fast, never silent).
 *   - `translateError(raw)` accepts a raw backend key or unknown string and
 *     returns the translated string or the original raw string if unrecognised.
 *
 * CALL SITES: all existing components use t("SCREAMING_SNAKE_KEY"). These keys
 * live as flat properties on each message object (en/es/de). No dot-paths needed
 * for the starter's flat key space.
 *
 * LOCALE RESOLUTION (context-rocket URL-segment pattern):
 *   - Server components: the `[locale]` layout sets the request locale after
 *     reading the URL segment. React.cache provides per-request isolation.
 *   - Client components: module variable (set by LocaleProvider) plus
 *     `document.documentElement.lang` fallback (set by the [locale] layout).
 *   - The language code lives in the URL (/es, /en) - no cookie needed.
 */

import { cache } from "react";
import { en } from "./messages/en";
import { resolveLocale, type SupportedLocale } from "./messages";

// ─────────────────────────────────────────────────────────────────────────────
// Runtime message registry
// ─────────────────────────────────────────────────────────────────────────────

// `en` is always present. Non-en locales are registered by LocaleProvider.
const _registry: Partial<Record<SupportedLocale, Record<string, unknown>>> = {
  en: en as unknown as Record<string, unknown>,
};

/**
 * Register a locale's message tree into the runtime registry.
 * Called by LocaleProvider (client-side) before rendering with a new locale.
 */
export function registerLocaleMessages(
  locale: SupportedLocale,
  tree: Record<string, unknown>,
): void {
  _registry[locale] = tree;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** All top-level keys of the English message object. */
// Nested message paths: t("auth.login.title"). Typed by string literal union.
export type MessageKey = string;

// ─────────────────────────────────────────────────────────────────────────────
// Locale state
// ─────────────────────────────────────────────────────────────────────────────

// Server-side: React.cache creates a per-request store, preventing race
// conditions between concurrent requests. On the client, cache is a no-op
// (returns a new object each call) so we use _clientLocale instead.
const getRequestLocaleStore = cache((): { locale: SupportedLocale } => ({
  locale: "en",
}));

// Client-side module variable -- safe because each browser tab is single-threaded.
let _clientLocale: SupportedLocale | null = null;

/** Set the active UI locale (called by LocaleProvider and the [locale] layout). */
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
  // Fallback: read <html lang> set by the [locale] layout (URL-derived).
  return resolveLocale(document.documentElement.lang);
}

// ─────────────────────────────────────────────────────────────────────────────
// Resolution helpers
// ─────────────────────────────────────────────────────────────────────────────

function resolveString(
  locale: SupportedLocale,
  key: string,
): string | undefined {
  const tree = _registry[locale] ?? _registry.en!;
  const val = (tree as Record<string, unknown>)[key];
  if (typeof val === "string") return val;

  // Nested path: try dot-walk (handles "locale.labelEnglish" etc.)
  const segments = key.split(".");
  if (segments.length > 1) {
    let node: unknown = tree;
    for (const seg of segments) {
      if (node === null || typeof node !== "object") {
        node = undefined;
        break;
      }
      node = (node as Record<string, unknown>)[seg];
    }
    if (typeof node === "string") return node;
  }

  // Fallback to English.
  if (locale !== "en") return resolveString("en", key);
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return the translated string for `key` in the current locale, falling back
 * through English. Throws if the key is missing entirely (fail-fast).
 *
 * Accepts either a known `MessageKey` (typed, autocompleted by TS) or a plain
 * `string` (for dot-paths like "locale.labelEnglish" and dynamic dispatch).
 */
export function t(key: MessageKey | (string & {})): string {
  const locale = getCurrentLocale();
  const text = resolveString(locale, key);
  if (text === undefined) {
    throw new Error(`[i18n] Missing key: "${key}" (locale: ${locale})`);
  }
  return text;
}

/**
 * Translate a backend error key into a human-readable message.
 *
 * The backend returns raw i18n keys (e.g. "ERROR_INTERNAL") as the `detail`
 * field of HTTP errors. This function looks up the key and returns the localised
 * string. If the string is not a known key (e.g. from fastapi-users or a raw
 * exception), it is returned as-is.
 */
export function translateError(raw: string): string {
  const locale = getCurrentLocale();
  const resolved = resolveString(locale, raw);
  return resolved ?? raw;
}
