import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import createNextIntlPlugin from 'next-intl/plugin';

const STATIC_EXPORT = process.env.STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export (S3 / CloudFront): STATIC_EXPORT=true pnpm build
  // When enabled, generates /out/ with pure HTML/CSS/JS. No server needed.
  // Chat connects via widget.js embed. No auth, no API routes, no SSR.
  ...(STATIC_EXPORT && {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
  }),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin({
          async: true,
          typescript: {
            configOverwrite: {
              compilerOptions: { skipLibCheck: true },
            },
          },
        })
      );
    }
    return config;
  },
};

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);
