/**
 * Root layout - owns <html>/<head>/<body> for every route.
 *
 * The <html> lives HERE (not in app/[locale]/layout.tsx) so the no-flash theme
 * script can be rendered once at the document level: a `beforeInteractive`
 * script injected into the initial HTML and never re-rendered on client
 * navigation. If the script lived in the [locale] layout it would re-render on
 * every language switch and trip React 19's "Encountered a script tag" warning.
 *
 * The [locale] layout (app/[locale]/layout.tsx) renders only the page body.
 */

import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { headers } from "next/headers";

import { WebVitals } from "@/components/shared/analytics/web-vitals";
import { createNoFlashScript } from "@/components/shared/ui/theme-init-script";
import { siteConfig } from "@/config/site.config";
import { SUPPORTED_LOCALES } from "@/i18n/messages";
import { blogTitle } from "@/lib/blog-path";
import "./globals.css";

// Fonts: swap the src for a different face, or replace with
// next/font/google for Inter/JetBrains Mono -- no component changes needed.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

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
    default: siteConfig.homeTitle || siteConfig.companyName,
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
    title: siteConfig.homeTitle || siteConfig.companyName,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.homeTitle || siteConfig.companyName,
    description: siteConfig.description,
    ...(siteConfig.social.twitter
      ? {
          creator: siteConfig.social.twitter,
          site: siteConfig.social.twitter,
        }
      : {}),
  },
  verification: siteConfig.verification,
  alternates: {
    canonical: siteConfig.siteUrl,
    ...(siteConfig.features.blog
      ? {
          types: {
            "application/rss+xml": `${siteConfig.siteUrl}/feed.xml`,
          },
        }
      : {}),
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
      {
        url: siteConfig.assets.appleTouchIcon,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // <html lang> resolves from the URL locale. The proxy middleware stamps the
  // detected locale as an `x-locale` request header (dynamic SSR); static
  // export has no request context, so it falls back to the site default and
  // the client I18nProvider corrects it on hydration.
  let locale: string = siteConfig.defaultLocale;
  try {
    const h = await headers();
    const headerLocale = h.get("x-locale");
    if (
      headerLocale &&
      (SUPPORTED_LOCALES as readonly string[]).includes(headerLocale)
    ) {
      locale = headerLocale;
    }
  } catch {
    // Static export -- no headers API available.
  }

  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Prevent Chrome from suggesting translation for supported locales. */}
        <meta name="google" content="notranslate" />
        {/* No-flash theme bootstrap: injected once into the initial HTML and
            never re-rendered on client navigation, so a language switch cannot
            trip React 19's client-script warning. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: createNoFlashScript(siteConfig.chrome.defaultTheme),
          }}
        />
        {siteConfig.features.blog ? (
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`${siteConfig.companyName} -- ${blogTitle()}`}
            href={`${origin}/feed.xml`}
          />
        ) : null}
      </head>
      <body
        data-surface="marketing"
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
        <WebVitals />
      </body>
    </html>
  );
}
