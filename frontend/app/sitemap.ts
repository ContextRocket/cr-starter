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
import { siteConfig } from "@/site.config";
import { SUPPORTED_LOCALES } from "@/i18n/messages";
import { fileBlogAdapter } from "@/lib/blog";

export const dynamic = "force-static";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface IndexableRoute {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
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

  // Blog listing
  pages.push({ path: "blog", priority: 0.8, changeFrequency: "daily" });

  // Individual blog posts
  try {
    const posts = fileBlogAdapter.list();
    for (const post of posts) {
      pages.push({
        path: `blog/${post.slug}`,
        priority: 0.7,
        changeFrequency: "monthly",
      });
    }
  } catch {
    // Blog directory might not exist yet — skip gracefully.
  }

  return pages.map((route) => {
    const languages: Record<string, string> = {};
    for (const locale of SUPPORTED_LOCALES) {
      languages[locale] = localeUrl(locale, route.path);
    }
    languages["x-default"] = localeUrl(defaultLocale, route.path);

    return {
      url: localeUrl(defaultLocale, route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    };
  });
}
