import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
import { ChatFab } from "@/components/chat/chat-fab";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { LocaleProvider } from "@/i18n/locale-provider";
import { siteConfig } from "@/site.config";
import type { SupportedLocale } from "@/i18n/messages";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // html lang is set to the default locale at SSR time. The LocaleProvider
  // updates document.documentElement.lang on the client after hydration when
  // a NEXT_LOCALE cookie differs from the default. For full SSR lang accuracy,
  // adopt [locale] URL-segment routing (see i18n/keys.ts upgrade path comment).
  return (
    <html lang={siteConfig.defaultLocale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LocaleProvider
          initialLocale={siteConfig.defaultLocale as SupportedLocale}
        >
          {children}
          <Toaster position="bottom-right" richColors />
          {process.env.NEXT_PUBLIC_CHAT_FAB_ENABLED === "true" && (
            <ChatFab agentUrl={process.env.NEXT_PUBLIC_CR_AGENT_URL} />
          )}
          <CookieConsentBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
