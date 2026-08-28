"use client";

/**
 * SiteChrome -- wraps marketing / content pages with the shared site header and
 * footer so every such page gets chrome via the [locale] layout.
 *
 * CHROME STYLE IS CONFIG-DRIVEN (siteConfig.chrome):
 *   - header "marketing" (default) → the full Navbar (logo + nav links + mobile
 *     menu). Preserves cr-starter's existing behavior.
 *   - header "minimal"             → MinimalHeader (compact personal-brand
 *     header: brand left, tiny link set right, no app chrome).
 *   - header "none"                → no shared header (for a fork-owned
 *     bespoke header).
 *   - footer "full" (default) / "minimal" → FooterSection variant.
 *   - footer "none"                 → no shared footer (for a fork-owned
 *     bespoke footer).
 * The nav/footer LINKS are content (company.config.ts) resolved by the layout
 * and passed in -- no link is hardcoded in a shared chrome component.
 *
 * WHY A PATHNAME GUARD (not a route group):
 *   Some product surfaces own their own frame. Rendering the marketing navbar
 *   there would double up a header, so each product lists those prefixes in
 *   site.json under chrome.exemptPrefixes.
 *
 * The locale prefix is stripped before matching (paths here are locale-agnostic
 * because @/i18n/navigation's usePathname returns the path without the [locale]
 * segment).
 */

import { usePathname } from "@/i18n/navigation";
import { SUPPORTED_LOCALES } from "@/i18n/messages";
import { Navbar, type NavLink } from "@/components/shared/sections/navbar";
import { MinimalHeader } from "@/components/shared/sections/minimal-header";
import type { BrandLogoAsset } from "@/components/shared/sections/brand-logo";
import {
  FooterSection,
  type FooterLink,
} from "@/components/shared/sections/footer-section";
import { siteConfig } from "@/config/site.config";

/**
 * Path prefixes that own their own chrome. Pages under these render WITHOUT the
 * marketing navbar/footer to avoid a double header.
 */
interface SiteChromeProps {
  children: React.ReactNode;
  links: NavLink[];
  /**
   * Header brand mark. Optional: when omitted (a fork with
   * chrome.showBrandLogo === false), the minimal header shows the brand NAME as
   * text. The marketing Navbar always renders a logo, so a marketing fork must
   * supply one.
   */
  logo?: BrandLogoAsset;
  footerLinks: FooterLink[];
  companyName: string;
  /** Accessible label for the header nav landmark (i18n-resolved by the layout). */
  navLabel: string;
  /** Optional container class passed down to the MinimalHeader and MinimalFooter. */
  containerClassName?: string;
}

export function SiteChrome({
  children,
  links,
  logo,
  footerLinks,
  companyName,
  navLabel,
  containerClassName,
}: SiteChromeProps) {
  // Strip a leading locale segment before matching exempt prefixes. In
  // single-language (`fast`) mode our `usePathname` returns the path WITH the
  // locale (e.g. `/en/probe`), so a bare `/probe` prefix would never match.
  const rawPathname = usePathname() || "/";
  const segments = rawPathname.split("/");
  const pathname =
    segments.length > 1 &&
    (SUPPORTED_LOCALES as readonly string[]).includes(segments[1])
      ? `/${segments.slice(2).join("/")}`
      : rawPathname;
  const exemptPrefixes = siteConfig.chrome.exemptPrefixes ?? [
    "/dashboard",
    "/auth",
    "/terminal-demo",
  ];
  const isExempt = exemptPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isExempt) {
    return <>{children}</>;
  }

  const { header, footer } = siteConfig.chrome;
  // Theme toggle defaults ON (undefined → true) so every fork ships a working
  // light/dark switch; a fork sets chrome.showThemeToggle: false to hide it.
  const showThemeToggle = siteConfig.chrome.showThemeToggle ?? true;
  const showLanguageSelector = siteConfig.features.languageSelector ?? true;
  const showPoweredByBadge = siteConfig.features.poweredByBadge ?? true;

  return (
    <div className="flex min-h-screen flex-col">
      {header === "none" ? null : header === "minimal" ? (
        <MinimalHeader
          links={links}
          logo={logo}
          brandName={companyName}
          navLabel={navLabel}
          showThemeToggle={showThemeToggle}
          showLanguageSelector={showLanguageSelector}
          containerClassName={containerClassName}
        />
      ) : (
        <Navbar
          links={links}
          logo={logo}
          brandName={companyName}
          navLabel={navLabel}
          showThemeToggle={showThemeToggle}
          showLanguageSelector={showLanguageSelector}
        />
      )}
      <div className="flex-1">{children}</div>
      {footer !== "none" && (
        <FooterSection
          links={footerLinks}
          companyName={companyName}
          variant={footer}
          containerClassName={containerClassName}
          showPoweredByBadge={showPoweredByBadge}
        />
      )}
    </div>
  );
}
