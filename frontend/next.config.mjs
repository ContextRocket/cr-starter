import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
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

// Wires next-intl's i18n/request.ts into the Next.js build. The request.ts
// file resolves locale + messages for every server-side request. This is the
// context-rocket URL-segment locale pattern: language codes live in the URL
// (/es, /en) instead of a cookie.
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

export default withNextIntl(nextConfig);
