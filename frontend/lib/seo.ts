/**
 * SEO alternates helper -- canonical + hreflang for localized pages.
 *
 * The site serves every public page under a `[locale]` URL segment
 * (en/es/de). Search and answer engines need a per-page `canonical`
 * pointing at the current locale's URL plus a full `hreflang` map
 * (`alternates.languages`) so they treat the localized variants as one
 * document instead of duplicates, and an `x-default` pointing at the
 * default locale for unmatched languages.
 *
 * `buildAlternates` produces the `Metadata.alternates` shape Next.js
 * merges into each page. It is a pure function: values are root-relative
 * paths that Next resolves against the root `metadataBase` (siteUrl), so
 * this file has no URL/origin concerns of its own.
 *
 * Adapted from context-rocket/frontend/app/[locale]/page.tsx (per-page
 * alternates) and context-rocket/frontend/lib/public-site.ts (the sitemap
 * hreflang builder).
 */

import { SUPPORTED_LOCALES } from "@/i18n/messages";
import { siteConfig } from "@/config/site.config";

/**
 * Build the `canonical` + `hreflang` alternates for a locale + in-locale path.
 *
 * `path` is the URL segment AFTER the locale, e.g. `"/pricing"`, or `""`
 * for the locale home. Returned values are root-relative (resolved against
 * `metadataBase`); `x-default` points at the default locale so crawlers
 * don't synthesize fake locale URLs.
 *
 * @param locale current URL locale (one of SUPPORTED_LOCALES)
 * @param path   in-locale path segment (leading "/" or "")
 */
export function buildAlternates(
  locale: string,
  path = "",
): { canonical: string; languages: Record<string, string> } {
  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "";
  const servedLocales = siteConfig.locales.length
    ? siteConfig.locales
    : SUPPORTED_LOCALES;
  const languages: Record<string, string> = {};
  for (const l of servedLocales) languages[l] = `/${l}${normalizedPath}`;
  const defaultLocale = servedLocales.includes(siteConfig.defaultLocale)
    ? siteConfig.defaultLocale
    : servedLocales[0] ?? siteConfig.defaultLocale;
  languages["x-default"] = `/${defaultLocale}${normalizedPath}`;
  return { canonical: `/${locale}${normalizedPath}`, languages };
}
