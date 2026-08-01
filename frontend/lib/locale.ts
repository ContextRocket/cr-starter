/**
 * Locale (language) configuration.
 * Use two-letter language codes only (ISO 639-1, e.g. en, es, de). Default is English.
 * Keep in sync with backend schemas.SUPPORTED_LOCALES and i18n/messages/index.ts.
 *
 * Note: the UI locale list (en, es, de) is the source of truth for i18n.
 * This file is the backend-facing locale contract used by the API/user model.
 */

export const DEFAULT_LOCALE = "en" as const;

export const SUPPORTED_LOCALES = ["en", "es", "de"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function isValidLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Resolve locale from user preference or fallback to default.
 * Use when you have the user object from the API (e.g. /users/me).
 */
export function resolveLocale(userLocale?: string | null): Locale {
  if (userLocale && isValidLocale(userLocale)) {
    return userLocale;
  }
  return DEFAULT_LOCALE;
}
