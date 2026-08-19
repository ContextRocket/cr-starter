import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { blogRewrites } from './blog.config.mjs';

const STATIC_EXPORT = process.env.STATIC_EXPORT === "true";

// E2E cookie-consent regression only: when E2E_COOKIE_CONSENT_AUTO=1, alias the
// site config to a build-time override that pins `cookieConsent: "auto"` (the
// shipped default) so the Playwright build exercises the REAL analytics-gated
// banner path without editing the tracked site.config.ts (which may carry a
// local review toggle). Inert for every normal build. See
// e2e/fixtures/site-config-cookie-auto.ts.
const E2E_COOKIE_CONSENT_AUTO = process.env.E2E_COOKIE_CONSENT_AUTO === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export (S3 / CloudFront): pnpm build:static (STATIC_EXPORT=true).
  // When enabled, generates /out/ with pure HTML/CSS/JS. No server needed.
  // Chat connects via widget.js embed. No auth, no API routes, no SSR.
  //
  // Static export runs the webpack build. The public starter has no server
  // actions, so the same application is valid for both server and static use.
  ...(STATIC_EXPORT && {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
  }),
  // Custom blog URL segment (siteConfig.blog.basePath). When a fork sets a
  // basePath other than "/blog", map the custom public path onto the physical
  // /blog route (never renamed — Next routes are file-system based). Default
  // "/blog" emits NO rewrite, so behavior is byte-for-byte unchanged.
  //
  // STATIC-EXPORT CAVEAT: `output: "export"` does not run rewrites, so this is
  // an SSR / standard-build feature. We omit the rewrites() key entirely under
  // static export to avoid the "rewrites are not supported with output: export"
  // build error. A static-export fork needing a custom segment must physically
  // alias app/[locale]/blog. See blog.config.mjs / lib/blog-path.ts.
  ...(!STATIC_EXPORT && blogRewrites().length > 0
    ? { async rewrites() { return blogRewrites(); } }
    : {}),
  // E2E cookie-consent build: isolate the build output (own distDir, suffixed
  // per analytics/no-analytics mode) and alias the site config to the "auto"
  // override. Both are gated behind E2E_COOKIE_CONSENT_AUTO so the normal build
  // and a concurrent local review build are never touched.
  ...(E2E_COOKIE_CONSENT_AUTO
    ? {
        distDir: `.next-e2e-cookie-consent${process.env.E2E_COOKIE_CONSENT_DIST_SUFFIX ? `-${process.env.E2E_COOKIE_CONSENT_DIST_SUFFIX}` : ""}`,
        turbopack: {
          resolveAlias: { "@/config/site.config": "./e2e/fixtures/site-config-cookie-auto.ts" },
        },
      }
    : {}),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin({
          async: true, // Run type checking synchronously to block the build
          typescript: {
            configOverwrite: {
              compilerOptions: {
                skipLibCheck: true,
              },
            },
          },
        })
      );
    }
    return config;
  },
};

// Locale routing is fully custom (i18n/messages registry + i18n/navigation
// wrapper over next/navigation). No next-intl plugin needed -- language codes
// live in the URL segment (/es, /en).
export default nextConfig;
