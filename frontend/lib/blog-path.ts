/**
 * lib/blog-path.ts -- the single accessor for the blog's PUBLIC URL segment and
 * title.
 *
 * The physical Next.js route lives at `app/[locale]/blog/` and is NEVER renamed
 * (routes are file-system based). This module resolves where blog LINKS point
 * and what the blog is CALLED, from `siteConfig.blog` (see site.config.ts and
 * the shared `blog.config.mjs`). Every emission point -- the nav link, post
 * `<Link>`s, the index `<h1>`/`<title>`, canonical + hreflang alternates,
 * breadcrumbs, the sitemap, and the RSS feed -- reads through here so a fork can
 * publish its blog under a custom path/name by editing config alone. Grep for
 * `blogBasePath` / `blogPostPath` / `blogTitle` to see every consumer; there
 * must be no other hardcoded "/blog" or "Blog" for the blog surface.
 *
 * STATIC-EXPORT CAVEAT: a custom `basePath` is served by a `next.config`
 * rewrite during a standard build (see `blog.config.mjs` → `blogRewrites`).
 * Static export (`output: "export"`) does not run rewrites, so
 * `patch-static-lang.mjs` creates the equivalent unprefixed/custom-blog
 * directory aliases for single-language exports. Multi-language exports keep
 * their locale-prefixed paths. The public URL is therefore identical across
 * both build modes.
 */

import { siteConfig } from "@/config/site.config";
import { normalizeBlogBasePath } from "@/blog.config.mjs";

/**
 * Normalized public blog segment (leading "/", no trailing "/"), e.g. "/blog"
 * or "/the-creator-economy-for-b2b". This is the in-locale path segment used
 * everywhere a blog URL is emitted.
 */
export function blogBasePath(): string {
  return normalizeBlogBasePath(siteConfig.blog.basePath);
}

/** In-locale path to a single post, e.g. "/blog/my-slug". */
export function blogPostPath(slug: string): string {
  return `${blogBasePath()}/${slug}`;
}

/** Whether the configured blog segment is the conventional default "/blog". */
export function isDefaultBlogBasePath(): boolean {
  return blogBasePath() === "/blog";
}

/** Display name for the blog (index heading/title, breadcrumb, RSS channel). */
export function blogTitle(): string {
  return siteConfig.blog.title;
}
