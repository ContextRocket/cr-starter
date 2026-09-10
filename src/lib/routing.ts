import { isSingleLocale } from "@/config/site.config";
import { getActiveLocales, getDefaultLocale, type SupportedLocale } from "@/i18n/locales";

/** Locale-prefixed routes: only emit paths for multi-locale sites. */
export function multiLocalePaths(): { params: { locale: SupportedLocale } }[] {
  if (isSingleLocale()) return [];
  return getActiveLocales().map((locale) => ({ params: { locale } }));
}

/** Active locale for unprefixed (single-locale) pages. */
export function soleLocale(): SupportedLocale {
  return getDefaultLocale();
}

export function assertSingleLocalePages(): boolean {
  return isSingleLocale();
}
