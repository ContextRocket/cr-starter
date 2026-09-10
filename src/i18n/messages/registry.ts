/**
 * Locale registry -- discovered from message barrels that exist on disk.
 * Keep in sync with src/i18n/messages/{en,es,de}.ts (and any added locale).
 */

export const SUPPORTED_LOCALES = ["en", "es", "de"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
