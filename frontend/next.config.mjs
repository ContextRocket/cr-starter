import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogRewrites } from './blog.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STATIC_EXPORT = process.env.STATIC_EXPORT === "true";

// Helper: resolves a project-relative path to an absolute filesystem path.
const rel = (...segments) => path.resolve(__dirname, ...segments);

// Server-action modules to swap for stubs during static export.
// "use server" modules are not supported with output: "export".
const ACTION_STUBS = {
  'login-action': rel('components/actions/static-stubs/login-action.ts'),
  'register-action': rel('components/actions/static-stubs/register-action.ts'),
  'logout-action': rel('components/actions/static-stubs/logout-action.ts'),
  'password-reset-action': rel('components/actions/static-stubs/password-reset-action.ts'),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export (S3 / CloudFront): pnpm build:static (STATIC_EXPORT=true).
  // When enabled, generates /out/ with pure HTML/CSS/JS. No server needed.
  // Chat connects via widget.js embed. No auth, no API routes, no SSR.
  //
  // NOTE: static export runs the WEBPACK build. Turbopack has no equivalent
  // of NormalModuleReplacementPlugin, so the server-action stub swap below
  // (and this whole webpack() hook) only executes under `pnpm build:static`.
  // The default `pnpm build` is Turbopack and skips this section entirely.
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
  webpack: (config, { isServer, webpack }) => {
    // Static export: swap server-action modules for no-op stubs.
    // Next.js detects "use server" at the source level; the only way
    // to avoid it is to never load the original files during the build.
    if (STATIC_EXPORT && webpack) {
      for (const [fileStem, stubPath] of Object.entries(ACTION_STUBS)) {
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            new RegExp(`[\\\\/]components[\\\\/]actions[\\\\/]${fileStem}\\.ts$`),
            stubPath,
          ),
        );
      }
    }

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

// Wires next-intl's i18n/request.ts into the Next.js build. The request.ts
// file resolves locale + messages for every server-side request. This is the
// context-rocket URL-segment locale pattern: language codes live in the URL
// (/es, /en) instead of a cookie.
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);
