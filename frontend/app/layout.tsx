import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
import { ChatFab } from "@/components/chat/chat-fab";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { siteConfig } from "@/site.config";

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
  return (
    <html lang={siteConfig.locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Toaster position="bottom-right" richColors />
        {process.env.NEXT_PUBLIC_CHAT_FAB_ENABLED === "true" && (
          <ChatFab agentUrl={process.env.NEXT_PUBLIC_CR_AGENT_URL} />
        )}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
