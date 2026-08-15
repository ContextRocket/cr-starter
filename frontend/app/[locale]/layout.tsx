import localFont from "next/font/local";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { ChatFab } from "@/components/chat/chat-fab";
import { AosProvider } from "@/components/ui/aos-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeInitScript } from "@/components/ui/theme-init-script";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { LocaleProvider } from "@/i18n/locale-provider";
import { SiteChrome } from "@/components/sections/site-chrome";
import { DevNoticeBar } from "@/components/sections/dev-notice-bar";
import {
  NotificationBarStack,
  type NotificationItem,
} from "@/components/sections/notification-bar";
import type { NavLink } from "@/components/sections/navbar";
import type { FooterLink } from "@/components/sections/footer-section";
import { company, type NavLinkConfig } from "@/company.config";
import { isChromeLinkVisible } from "@/lib/nav-visibility";
// Register all locale trees server-side before any t() call.
// MUST be imported before `t` so the registry is populated for SSR.
import { getServerLocaleTree } from "@/i18n/messages/register-server";
import { setLocale, t } from "@/i18n/keys";
import {
  resolveLocale,
  ACTIVE_LOCALES,
  type SupportedLocale,
} from "@/i18n/messages";
import { siteConfig } from "@/site.config";
import { blogTitle } from "@/lib/blog-path";

// Fonts: swap the src for a different face, or replace with
// next/font/google for Inter/JetBrains Mono — no component changes needed.
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const dynamic = "force-static";

export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
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
  // Static export has no request context — default to guest.
  let isGuest: boolean;
  try {
    const cookieStore = await cookies();
    isGuest = !cookieStore.get("accessToken")?.value;
  } catch {
    // Static export — no cookies API available.
    isGuest = true;
  }

  // Dev-visible configuration warning: an unreplaced siteUrl default poisons
  // every canonical/OG/JSON-LD signal. The starter ships the ContextRocket
  // default domain, so a fork that hasn't set its own production domain still
  // sees this notice. Same pattern as the placeholder notice on /impressum.
  const showSiteUrlWarning =
    process.env.NODE_ENV === "development" &&
    siteConfig.siteUrl.includes("contextrocket.com");

  // Serialise the active non-en locale's tree into the RSC payload so the
  // client receives it without a separate network request. For `en`, pass
  // null - it is always bundled as the fallback.
  const localeMessages = getServerLocaleTree(locale);

  // next-intl: read the message tree resolved by request.ts so client hooks
  // (useTranslations, useLocale) and @/i18n/navigation's Link have a context.
  // Pass `locale` EXPLICITLY - relying on the ambient request locale returned
  // `en` for non-en static routes.
  const messages = await getMessages({ locale });

  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  // Site chrome links come ENTIRELY from company.config `nav` — no link is
  // hardcoded here or in the shared Navbar/footer. We resolve each config entry
  // to a rendered link: drop it if its `featureFlag` is off (e.g. Blog when the
  // blog surface is disabled) or if it is `appOnly` and the viewer is a guest
  // (auth-gating — app links like Dashboard render ONLY for authenticated
  // users, so the default/public render everywhere shows zero app links; a
  // fork's `showAppLinks: false` is an additional opt-out); resolve its
  // `labelKey` via t(); and locale-prefix same-origin hrefs (absolute URLs pass
  // through). Fails closed: when auth is unknown (static export) `isGuest` is
  // already true above, so app links stay hidden. The dashboard/auth/terminal
  // surfaces render their own chrome — SiteChrome hides this header there so
  // there is no double header.
  const navConfig = company.nav;
  const showAppLinks = navConfig?.showAppLinks ?? true;
  const resolveChromeLink = (link: NavLinkConfig) => ({
    label: t(link.labelKey),
    href: link.href.startsWith("/") ? `/${locale}${link.href}` : link.href,
  });
  const linkVisible = (link: NavLinkConfig) =>
    isChromeLinkVisible(link, isGuest, showAppLinks);
  const navLinks: NavLink[] = (navConfig?.links ?? [])
    .filter(linkVisible)
    .map(resolveChromeLink);
  // Header brand mark: pass the logo image unless the fork opts out
  // (chrome.showBrandLogo === false) — then the header falls back to the brand
  // NAME as text (the personal-brand look). The marketing Navbar always needs a
  // logo, so this opt-out is only honored by the minimal header.
  // Brand-mark VARIANT (default "icon"): the icon-only rocket glyph (~square,
  // small) or the wide wordmark. Both variants are theme-aware — a light asset
  // plus a dark asset the BrandLogo swaps in under `.dark`. `width`/`height`
  // are intrinsic-ratio hints for next/image layout reservation.
  const logoVariant = siteConfig.chrome.logoVariant ?? "icon";
  const navLogo =
    siteConfig.chrome.showBrandLogo === false
      ? undefined
      : logoVariant === "wordmark"
        ? {
            src: siteConfig.assets.wordmark,
            srcDark: siteConfig.assets.wordmarkDark,
            alt: siteConfig.companyName,
            variant: "wordmark" as const,
            width: 178,
            height: 24,
          }
        : {
            src: siteConfig.assets.logo,
            // Keep the brand-PINK rocket in dark mode too (not the white
            // variant): the icon is the only brand-color moment in the header,
            // and #FF2B67 reads clearly on the near-black dark background. Both
            // themes therefore render the same pink glyph, so no dark swap.
            srcDark: siteConfig.assets.logo,
            alt: siteConfig.companyName,
            variant: "icon" as const,
            width: 32,
            height: 32,
          };

  // Top-of-page notification bars: resolve config i18n keys → already-resolved
  // strings so the NotificationBarStack stays i18n-agnostic. Empty config →
  // empty array → the stack renders nothing (no layout shift).
  const resolvedNotifications: NotificationItem[] = (
    company.notifications ?? []
  ).map((n) => ({
    id: n.id,
    tone: n.tone,
    iconName: n.icon,
    message: t(n.messageKey),
    action: n.action
      ? { label: t(n.action.labelKey), href: n.action.href }
      : undefined,
    dismissible: n.dismissible,
  }));
  // Footer links also come entirely from company.config `nav.footerLinks`
  // (same resolve/gate contract as the header links above).
  const footerLinks: FooterLink[] = (navConfig?.footerLinks ?? [])
    .filter(linkVisible)
    .map(resolveChromeLink);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* No-flash theme bootstrap. Rendered here in the RSC <head> (not by
            next-themes' client script) so it ships in the initial HTML and runs
            before first paint — sets the .dark/.light class + color-scheme with
            zero flash, and avoids the React 19 "script tag while rendering"
            client-render warning. See components/ui/theme-init-script.tsx. */}
        <ThemeInitScript />
        {/* RSS feed discovery. The root layout sets `alternates.types`, but
            each locale page overrides `alternates` (canonical + hreflang), so
            we emit the discovery <link> here where it survives on every
            user-facing page. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.companyName} — ${blogTitle()}`}
          href={`${origin}/feed.xml`}
        />
      </head>
      <body
        data-surface="marketing"
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {/* ThemeProvider owns the `.dark` class on <html> (attribute="class").
            It wraps the whole rendered tree so every page — marketing, blog,
            dashboard, terminal — reads the same light/dark tokens. */}
        <ThemeProvider>
          <AosProvider />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <LocaleProvider initialLocale={locale} messages={localeMessages}>
              {showSiteUrlWarning && (
                <DevNoticeBar
                  label={t("dev.notice.label")}
                  message={t("dev.siteConfigUrlWarning")}
                  dismissLabel={t("dev.notice.dismiss")}
                />
              )}
              <NotificationBarStack
                items={resolvedNotifications}
                regionLabel={t("notifications.region")}
                dismissLabel={t("notifications.dismiss")}
              />
              <SiteChrome
                links={navLinks}
                logo={navLogo}
                footerLinks={footerLinks}
                companyName={siteConfig.companyName}
                navLabel={t("nav.aria.primary")}
              >
                {children}
              </SiteChrome>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
