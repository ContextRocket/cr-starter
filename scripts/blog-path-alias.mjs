/**
 * Astro integration: expose exactly the configured public blog basePath in
 * both `astro dev` and `astro build`.
 *
 * Route entrypoints live in underscore-prefixed directories under src/pages,
 * which Astro does not expose as routes. Injecting the configured path avoids
 * publishing a duplicate `/blog` tree when a fork uses a custom path.
 */
import { blogBasePath } from "../blog.config.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteConfig = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "config/site.json"), "utf8"),
);

function topicsEnabled() {
  return siteConfig.features?.blog === true && siteConfig.features?.topics === true;
}

/**
 * @returns {import('astro').AstroIntegration}
 */
export function blogPathAlias() {
  return {
    name: "blog-path-alias",
    hooks: {
      "astro:config:setup": ({ injectRoute, logger }) => {
        const base = blogBasePath().replace(/^\//, "").replace(/\/+$/, "");
        if (!base) return;
        logger.info(`Registering blog at /${base}`);
        injectRoute({
          pattern: `/${base}`,
          entrypoint: "./src/pages/_blog/index.astro",
        });
        injectRoute({
          pattern: `/${base}/[slug]`,
          entrypoint: "./src/pages/_blog/[slug].astro",
        });
        injectRoute({
          pattern: `/${base}/llms.txt`,
          entrypoint: "./src/pages/_blog/llms.txt.ts",
        });
        if (topicsEnabled()) {
          injectRoute({
            pattern: `/${base}/topics`,
            entrypoint: "./src/pages/_blog/topics/index.astro",
          });
          injectRoute({
            pattern: `/${base}/topics/[slug]`,
            entrypoint: "./src/pages/_blog/topics/[slug].astro",
          });
          injectRoute({
            pattern: `/[locale]/${base}/topics`,
            entrypoint: "./src/pages/[locale]/_blog/topics/index.astro",
          });
          injectRoute({
            pattern: `/[locale]/${base}/topics/[slug]`,
            entrypoint: "./src/pages/[locale]/_blog/topics/[slug].astro",
          });
        }
        injectRoute({
          pattern: `/[locale]/${base}`,
          entrypoint: "./src/pages/[locale]/_blog/index.astro",
        });
        injectRoute({
          pattern: `/[locale]/${base}/[slug]`,
          entrypoint: "./src/pages/[locale]/_blog/[slug].astro",
        });
      },
    },
  };
}
