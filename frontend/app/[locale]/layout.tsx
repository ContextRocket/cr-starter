import { Toaster } from "sonner";
import { ChatFab } from "@/components/shared/chat/chat-fab";
import { AosProvider } from "@/components/shared/ui/aos-provider";
import { ThemeProvider } from "@/components/shared/ui/theme-provider";
import { ThemeStyle } from "@/components/shared/layout/theme-style";
import { ThemePlayground } from "@/components/shared/layout/theme-playground";
import { CookieConsentBanner } from "@/components/shared/cookie-consent-banner";
import "@/i18n/messages/register-server";
import { setLocale, t } from "@/i18n/keys";
import { LocaleProvider } from "@/i18n/locale-provider";
import { getServerLocaleTree } from "@/i18n/messages/register-server";
import { SiteChrome } from "@/components/shared/sections/site-chrome";
import { DevNoticeBar } from "@/components/shared/sections/dev-notice-bar";
import type { NavLink } from "@/components/shared/sections/navbar";
import type { FooterLink } from "@/components/shared/sections/footer-section";
import { siteConfig, type NavLinkConfig } from "@/config/site.config";

import {
  resolveLocale,
  ACTIVE_LOCALES,
  type SupportedLocale,
} from "@/i18n/messages";

// No `force-static` here: in dev/SSR mode Next.js renders dynamically per
// request; the layout resolves `t` from the URL locale. For static export
// (STATIC_EXPORT=true), next.config.mjs sets output:"export" which forces
// all pages static -- no layout-level override needed.

export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

/**
 * Locale layout -- the body content for every locale-prefixed route.
 *
 * The <html>/<head>/<body> shell lives in the ROOT layout (app/layout.tsx),
 * which owns the no-flash theme script. This layout only resolves the locale
 * and renders the providers + site chrome.
 *
 * context-rocket URL-segment pattern: the language code lives in the URL
 * (/es, /en, /de). This layout reads it from params, binds the server t()
 * to that locale, and passes the message tree to the client LocaleProvider.
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

  // Server-side locale bound to the URL locale (explicit, no global state),
  // plus the tree serialized to the client LocaleProvider below.
  setLocale(locale);
  const localeMessages = getServerLocaleTree(locale);

  // Dev-visible configuration warning: an unreplaced siteUrl default poisons
  // every canonical/OG/JSON-LD signal. The starter ships the ContextRocket
  // default domain, so a fork that hasn't set its own production domain still
  // sees this notice. Same pattern as the placeholder notice on /impressum.
  const showSiteUrlWarning =
    process.env.NODE_ENV === "development" &&
    siteConfig.siteUrl.includes("contextrocket.com");

  // Site chrome links come entirely from site.json `nav`; feature flags decide
  // whether optional public surfaces such as Blog are rendered.
  const navConfig = siteConfig.nav;
  const resolveChromeLink = (link: NavLinkConfig): NavLink => ({
    label: t(link.labelKey),
    href: link.href.startsWith("/") ? `/${locale}${link.href}` : link.href,
    variant: link.variant as "default" | "primary" | undefined,
  });
  const linkVisible = (link: NavLinkConfig) =>
    !link.featureFlag || siteConfig.features[link.featureFlag] !== false;
  const navLinks: NavLink[] = (navConfig?.links ?? [])
    .filter(linkVisible)
    .map(resolveChromeLink);
  const navLogo = {
    src: siteConfig.assets.logo,
    srcDark: siteConfig.assets.logoDark,
    alt: siteConfig.companyName,
    variant: siteConfig.chrome.logoVariant ?? "icon",
    width: 32,
    height: 32,
  };

  // Footer links
  const footerLinks: FooterLink[] = (navConfig?.footerLinks ?? [])
    .filter(linkVisible)
    .map(resolveChromeLink);

  return (
    <>
      {/* Inject the site design tokens from siteConfig.theme (single source
          of truth) so a fork re-themes by editing config, not globals.css. */}
      <ThemeStyle />
      {/* Dev-only URL preview for the marketing/terminal surface (?surface=). */}
      <ThemePlayground />
      {/* ThemeProvider owns the `.dark` class on <html> (attribute="class").
          It wraps the whole rendered tree so every page -- marketing, blog,
          dashboard, terminal -- reads the same light/dark tokens. */}
      <ThemeProvider>
        <AosProvider />
        <LocaleProvider initialLocale={locale} messages={localeMessages}>
          {showSiteUrlWarning && (
            <DevNoticeBar
              label={t("dev.notice.label")}
              message={t("dev.siteConfigUrlWarning")}
              dismissLabel={t("dev.notice.dismiss")}
            />
          )}
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
          {siteConfig.features.chatFab !== false &&
            process.env.NEXT_PUBLIC_CHAT_FAB_ENABLED !== "false" && (
              <ChatFab
                agentUrl={
                  siteConfig.chat.mode === "live"
                    ? siteConfig.chat.agentUrl
                    : ""
                }
                fullscreenOnLoad={siteConfig.chat.fullscreenOnLoad}
              />
            )}
          <CookieConsentBanner />
        </LocaleProvider>
      </ThemeProvider>
    </>
  );
}
