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

/** Return a locale-prefixed target, preserving query strings on static aliases. */
export function redirectTargetForUnprefixedRoute(
  path: string,
  search = "",
): string | null {
  if (isSingleLocale()) return null;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedSearch = search && !search.startsWith("?") ? `?${search}` : search;
  return `/${getDefaultLocale()}${normalizedPath}${normalizedSearch}`;
}
