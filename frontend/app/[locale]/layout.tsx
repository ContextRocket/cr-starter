import localFont from "next/font/local";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { ChatFab } from "@/components/chat/chat-fab";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { LocaleProvider } from "@/i18n/locale-provider";
// Register all locale trees server-side before any t() call.
// MUST be imported before `t` so the registry is populated for SSR.
import { getServerLocaleTree } from "@/i18n/messages/register-server";
import { setLocale, t } from "@/i18n/keys";
import {
  resolveLocale,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/i18n/messages";
import { siteConfig } from "@/site.config";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/**
 * Locale layout - owns <html>/<body>, the locale prefix (lang attribute),
 * and the providers that make both the custom t() system and next-intl
 * resolve from the URL segment.
 *
 * context-rocket URL-segment pattern: the language code lives in the URL
 * (/es, /en, /de). This layout reads it from params, sets the per-request
 * locale for server t() calls, and passes the tree to the client provider.
 */
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale) as SupportedLocale;

  // keys.ts: per-request locale so all server t() call sites under this
  // layout resolve from the URL-derived locale.
  setLocale(locale);

  // Server-derived guest signal: no auth cookie means the visitor is a guest.
  // This is what arms the chat conversion-moment nudge; without it the nudge
  // could never fire. (A logged-in visitor never sees the nudge.)
  const cookieStore = await cookies();
  const isGuest = !cookieStore.get("accessToken")?.value;

  // Dev-visible configuration warning: an unreplaced siteUrl placeholder
  // poisons every canonical/OG/JSON-LD signal. Same pattern as the
  // placeholder notice on /impressum.
  const showSiteUrlWarning =
    process.env.NODE_ENV === "development" &&
    siteConfig.siteUrl.includes("example.com");

  // Serialise the active non-en locale's tree into the RSC payload so the
  // client receives it without a separate network request. For `en`, pass
  // null - it is always bundled as the fallback.
  const localeMessages = getServerLocaleTree(locale);

  // next-intl: read the message tree resolved by request.ts so client hooks
  // (useTranslations, useLocale) and @/i18n/navigation's Link have a context.
  // Pass `locale` EXPLICITLY - relying on the ambient request locale returned
  // `en` for non-en static routes.
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleProvider initialLocale={locale} messages={localeMessages}>
            {showSiteUrlWarning && (
              <div
                role="alert"
                data-testid="siteurl-placeholder-warning"
                className="border-b border-yellow-500 bg-yellow-50 px-4 py-2 text-center text-sm text-yellow-900"
              >
                <strong>{t("DEV_NOTICE_LABEL")}</strong>{" "}
                {t("SITE_CONFIG_URL_WARNING")}
              </div>
            )}
            {children}
            <Toaster position="bottom-right" richColors />
            {process.env.NEXT_PUBLIC_CHAT_FAB_ENABLED === "true" && (
              <ChatFab
                agentUrl={process.env.NEXT_PUBLIC_CR_AGENT_URL}
                isGuest={isGuest}
              />
            )}
            <CookieConsentBanner />
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
