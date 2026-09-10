/**
 * Astro integration: expose the configured public blog basePath in both
 * `astro dev` and `astro build` (alias-blog-path.mjs only patches dist/).
 *
 * Physical pages stay under /blog; when blog.config basePath is e.g. /posts
 * or /the-creator-economy-for-b2b, inject matching routes that reuse those
 * entrypoints so links and nav resolve without a post-build copy step.
 */
import { blogBasePath } from "../blog.config.mjs";

/**
 * @returns {import('astro').AstroIntegration}
 */
export function blogPathAlias() {
  return {
    name: "blog-path-alias",
    hooks: {
      "astro:config:setup": ({ injectRoute, logger }) => {
        const base = blogBasePath().replace(/^\//, "").replace(/\/+$/, "");
        if (!base || base === "blog") {
          return;
        }
        logger.info(`Aliasing /blog → /${base}`);
        injectRoute({
          pattern: `/${base}`,
          entrypoint: "./src/pages/blog/index.astro",
        });
        injectRoute({
          pattern: `/${base}/[slug]`,
          entrypoint: "./src/pages/blog/[slug].astro",
        });
        injectRoute({
          pattern: `/[locale]/${base}`,
          entrypoint: "./src/pages/[locale]/blog/index.astro",
        });
        injectRoute({
          pattern: `/[locale]/${base}/[slug]`,
          entrypoint: "./src/pages/[locale]/blog/[slug].astro",
        });
      },
    },
  };
}
