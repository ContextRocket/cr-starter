/**
 * blog.config.mjs — the ONE plain-JS source of the blog surface settings.
 *
 * Why a `.mjs` and not just a field in `site.config.ts`: `next.config.mjs` runs
 * BEFORE the TypeScript build and cannot import `site.config.ts` (path aliases,
 * `as const`, TS-only syntax). Both `next.config.mjs` (to emit the custom-path
 * rewrite) and `site.config.ts` (to expose `siteConfig.blog` to app code) need
 * the SAME basePath/title, so the raw values + normalization live here as
 * dependency-free ESM that either side can import.
 *
 * A fork edits `basePath` / `title` HERE (a single place); `site.config.ts`
 * re-exports these under `siteConfig.blog`, and `lib/blog-path.ts` is the typed
 * accessor the app uses. Do NOT hardcode "/blog" or "Blog" elsewhere.
 *
 *   basePath — public URL segment, leading "/" and NO trailing slash. Default
 *              "/blog". A fork sets e.g. "/the-creator-economy-for-b2b".
 *   title    — display name for the index <h1>/<title>, breadcrumb label, and
 *              RSS channel title. Default "Blog".
 */

/** @typedef {{ basePath: string, title: string }} BlogConfig */

/**
 * Raw blog settings. EDIT HERE to publish the blog under a custom path/name.
 * @type {BlogConfig}
 */
export const blogConfig = {
  basePath: "/blog",
  title: "Blog",
};

/**
 * Normalize a basePath: ensure a single leading "/", strip any trailing "/",
 * and collapse an empty/"/" input back to the "/blog" default so callers never
 * emit a bare-locale blog URL. Pure + dependency-free so both the TS helper and
 * next.config share identical behavior.
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

/**
 * Build the `next.config` rewrites that map the CUSTOM public blog segment onto
 * the physical `/blog` route (which is never renamed — Next routes are
 * file-system based). Returns an EMPTY array when the basePath is the default
 * "/blog" (no rewrite needed → behavior byte-for-byte unchanged).
 *
 * Two rules per the `:locale` URL shape (localePrefix: "always"):
 *   1. the index:  /:locale${basePath}      → /:locale/blog
 *   2. deep paths: /:locale${basePath}/:rest*→ /:locale/blog/:rest*
 *
 * STATIC-EXPORT CAVEAT: `output: "export"` produces a pure static bundle and
 * does NOT run `next.config` rewrites (or middleware). A custom basePath is
 * therefore an SSR / standard-build feature (the common case, incl. cr-kleos).
 * A static-export fork that needs a custom segment must physically alias the
 * route directory (copy `app/[locale]/blog` to `app/[locale]/<segment>`), which
 * this config-only approach intentionally does not do. See lib/blog-path.ts.
 *
 * @returns {Array<{ source: string, destination: string }>}
 */
export function blogRewrites() {
  const base = blogBasePath();
  if (base === "/blog") return [];
  return [
    { source: `/:locale${base}`, destination: "/:locale/blog" },
    { source: `/:locale${base}/:rest*`, destination: "/:locale/blog/:rest*" },
  ];
}
