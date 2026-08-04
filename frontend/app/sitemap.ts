/**
 * Sitemap route -- served at /sitemap.xml.
 *
 * Lists every public page with its canonical URL and last-modified
 * date. Add new public routes to INDEXABLE_ROUTES to include them
 * automatically.
 *
 * Adapted from context-rocket/frontend/app/sitemap.ts and
 * context-rocket/frontend/lib/public-site.ts (buildPublicSitemapEntries).
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { fileBlogAdapter } from "@/lib/blog";

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
  const lastModified = new Date();

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

  return pages.map((route) => ({
    url: route.path ? `${origin}/${route.path}` : origin,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        "x-default": route.path ? `${origin}/${route.path}` : origin,
      },
    },
  }));
}
