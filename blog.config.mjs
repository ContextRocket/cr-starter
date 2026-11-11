/**
 * blog.config.mjs — the ONE plain-JS source of the blog surface settings.
 *
 * This dependency-free config is imported by Astro's build scripts and the
 * typed site config, so a fork changes the blog settings in one place.
 *
 * A fork edits `basePath` / `title` / `contentDir` HERE (a single place);
 * `site.config.ts` re-exports these under `siteConfig.blog`, and
 * `lib/blog-path.ts` is the typed accessor the app uses. Do NOT hardcode
 * "/blog", "Blog", or `content/posts` elsewhere.
 *
 *   basePath — public URL segment, leading "/" and NO trailing slash. Default
 *              "/blog". A fork sets e.g. "/the-creator-economy-for-b2b".
 *   title    — display name for the index <h1>/<title>, breadcrumb label, and
 *              RSS channel title. Default "Blog".
 *   contentDir — Markdown content directory, relative to the frontend project.
 *                Default "content/posts". A fork can retain "content/blog"
 *                or use another descriptive collection name without changing
 *                the public URL.
 *   feedPath — public URL for the RSS feed. Default "/feed.xml"; set this
 *              when the blog is mounted below a product-owned public origin.
 *   postTitleSuffix — optional brand-specific suffix for article page titles.
 *                     Omit it to use the site's company name.
 */

/** @typedef {{ basePath: string, title: string, contentDir: string, feedPath?: string, postTitleSuffix?: string }} BlogConfig */

/**
 * Raw blog settings. EDIT HERE to publish the blog under a custom path/name.
 * @type {BlogConfig}
 */
export const blogConfig = {
  basePath: "/blog",
  title: "Blog",
  contentDir: "content/posts",
  // Keep the root feed as the default for standalone brand sites. A blog that
  // is mounted beneath a product-owned origin can set /blog/feed.xml.
  feedPath: "/feed.xml",
};

/**
 * Normalize a configured content directory while keeping it frontend-relative.
 *
 * @param {string} raw
 * @returns {string}
 */
export function normalizeBlogContentDir(raw) {
  const trimmed = (raw ?? "").trim().replace(/\\/g, "/");
  const normalized = trimmed.replace(/^\/+|\/+$/g, "");
  return normalized || "content/posts";
}

/** The normalized frontend-relative Markdown content directory. */
export function blogContentDir() {
  return normalizeBlogContentDir(blogConfig.contentDir);
}

/**
 * Normalize a basePath: ensure a single leading "/", strip any trailing "/",
 * and collapse an empty/"/" input back to the "/blog" default so callers never
 * emit a bare-locale blog URL. Pure + dependency-free so both the TS helper and
 * Astro build helpers share this behavior.
 *
 * @param {string} raw
 * @returns {string} e.g. "/blog" or "/the-creator-economy-for-b2b"
 */
export function normalizeBlogBasePath(raw) {
  const trimmed = (raw ?? "").trim();
  if (trimmed === "" || trimmed === "/") return "/blog";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutTrailing = withLeading.replace(/\/+$/, "");
  return withoutTrailing === "" ? "/blog" : withoutTrailing;
}

/** The normalized public blog segment (leading "/", no trailing "/"). */
export function blogBasePath() {
  return normalizeBlogBasePath(blogConfig.basePath);
}
