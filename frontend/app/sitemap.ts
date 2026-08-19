/**
 * Sitemap route -- served at /sitemap.xml.
 *
 * Every public page is served under a `[locale]` URL segment (en/es/de),
 * so each route emits ONE entry at the default-locale-prefixed URL with a
 * full `alternates.languages` hreflang map: one absolute URL per supported
 * locale plus an `x-default` pointing at the default-locale variant. This
 * matches the actual `[locale]` routes -- an unprefixed `x-default` would
 * point at a URL that does not exist.
 *
 * Add new public routes to INDEXABLE_ROUTES to include them automatically.
 *
 * Adapted from context-rocket/frontend/app/sitemap.ts and
 * context-rocket/frontend/lib/public-site.ts (buildPublicSitemapEntries).
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { SUPPORTED_LOCALES } from "@/i18n/messages";
import { fileBlogAdapter } from "@/lib/blog";
import { blogBasePath } from "@/lib/blog-path";

export const dynamic = "force-static";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface IndexableRoute {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  /** Locales for which this route has content; omitted means all served locales. */
  locales?: readonly string[];
}

/**
 * All public pages that should appear in the sitemap.
 * Add routes here to include them in search engine indexing.
 */
const INDEXABLE_ROUTES: readonly IndexableRoute[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "impressum", priority: 0.3, changeFrequency: "monthly" },
  { path: "privacy", priority: 0.3, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const defaultLocale = siteConfig.defaultLocale;
  const lastModified = new Date();

  /** Build a locale-prefixed absolute URL for an in-locale path segment. */
  const localeUrl = (locale: string, path: string): string =>
    path ? `${origin}/${locale}/${path}` : `${origin}/${locale}`;

  const pages: IndexableRoute[] = [...INDEXABLE_ROUTES];
  const servedLocales: readonly string[] = siteConfig.locales?.length
    ? siteConfig.locales
    : SUPPORTED_LOCALES;

  // Blog: the public segment comes from siteConfig.blog.basePath (default
  // "/blog"). Strip the leading "/" to match the in-locale `path` convention
  // above (localeUrl re-adds the separator). A fork's custom basePath flows
  // through here, so the sitemap lists the custom segment for the index + posts.
  const blogSegment = blogBasePath().replace(/^\//, "");

  // Blog listing
  pages.push({
    path: blogSegment,
    priority: 0.8,
    changeFrequency: "daily",
    locales: servedLocales,
  });

  // Individual blog posts
  try {
    const postLocales = new Map<string, Set<string>>();
    for (const locale of servedLocales) {
      for (const post of fileBlogAdapter.list(locale)) {
        const locales = postLocales.get(post.slug) ?? new Set<string>();
        if (post.locale) {
          locales.add(locale);
        } else {
          for (const servedLocale of servedLocales) locales.add(servedLocale);
        }
        postLocales.set(post.slug, locales);
      }
    }

    for (const [slug, locales] of postLocales) {
      pages.push({
        path: `${blogSegment}/${slug}`,
        priority: 0.7,
        changeFrequency: "monthly",
        locales: [...locales],
      });
    }
  } catch {
    // Blog directory might not exist yet -- skip gracefully.
  }

  return pages.map((route) => {
    const languages: Record<string, string> = {};
    const routeLocales = route.locales ?? servedLocales;
    for (const locale of routeLocales) {
      languages[locale] = localeUrl(locale, route.path);
    }
    languages["x-default"] = localeUrl(defaultLocale, route.path);

    return {
      url: localeUrl(
        routeLocales.includes(defaultLocale) ? defaultLocale : routeLocales[0],
        route.path,
      ),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    };
  });
}
