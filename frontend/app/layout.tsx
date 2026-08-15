/**
 * Root layout - pass-through only.
 *
 * Each route group that owns an <html> element renders its own layout:
 *   - app/[locale]/layout.tsx  -> all user-facing locale-prefixed routes
 *   - app/embed/               -> chromeless embed widget (no layout)
 *
 * This root layout must NOT render <html>/<body>/<head> - doing so would
 * create a duplicate wrapper around the [locale] layout. Global metadata is
 * exported here and merged by Next.js into each page.
 */
import type { Metadata } from "next";

import { WebVitals } from "@/components/analytics/web-vitals";
import { siteConfig } from "@/site.config";

/**
 * Root metadata -- reads from site.config so forks only edit one file.
 *
 * The title template adds ` | <companyName>` to every page title
 * automatically. Canonical and OG URLs are derived from siteUrl so
 * crawlers always see consistent signals. This is the metadata surface
 * ContextRocket's own taxonomy reads (Organization JSON-LD lives on the
 * home page; metadata wires the search-engine layer here).
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.companyName,
    template: `%s | ${siteConfig.companyName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.companyName,
  authors: [{ name: siteConfig.legalName }],
  keywords: [],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.companyName,
    title: siteConfig.companyName,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.companyName,
    description: siteConfig.description,
    ...(siteConfig.social.twitter
      ? {
          creator: siteConfig.social.twitter,
          site: siteConfig.social.twitter,
        }
      : {}),
  },
  alternates: {
    canonical: siteConfig.siteUrl,
    types: {
      "application/rss+xml": `${siteConfig.siteUrl}/feed.xml`,
    },
  },
  icons: {
    icon: [
      { url: siteConfig.assets.faviconIco },
      { url: siteConfig.assets.icon16, sizes: "16x16", type: "image/png" },
      { url: siteConfig.assets.icon32, sizes: "32x32", type: "image/png" },
      { url: siteConfig.assets.icon192, sizes: "192x192", type: "image/png" },
      { url: siteConfig.assets.icon512, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: siteConfig.assets.appleTouchIcon, sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // <WebVitals /> renders null; it registers the field-performance reporter
  // above every route group. The [locale] layout still owns <html>/<body>.
  return (
    <>
      {children}
      <WebVitals />
    </>
  );
}
