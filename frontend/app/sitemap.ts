import type { MetadataRoute } from "next";

import { fileBlogAdapter } from "@/lib/blog";
import { buildPublicSitemapEntries } from "@/lib/public-site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  let blogSlugs: string[] = [];
  try {
    blogSlugs = fileBlogAdapter.list().map((post) => post.slug);
  } catch {
    // A fork may disable the blog or omit its content directory.
  }

  return buildPublicSitemapEntries({ blogSlugs }) as MetadataRoute.Sitemap;
}
