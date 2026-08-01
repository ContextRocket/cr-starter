/**
 * i18n/messages/index.ts
 *
 * Exports the supported locale type and the resolveLocale helper.
 * Adapted from context-rocket/frontend/i18n/messages/*.ts structure.
 *
 * The `en` tree is always bundled (fallback). `es` and `de` are lazy-loaded
 * on the client side by LocaleProvider.
 */

export const SUPPORTED_LOCALES = ["en", "es", "de"] as const;

/** All locale codes supported by the UI. */
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
