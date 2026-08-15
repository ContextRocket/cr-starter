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
 *   - footer "full" (default) / "minimal" → FooterSection variant.
 * The nav/footer LINKS are content (company.config.ts) resolved by the layout
 * and passed in — no link is hardcoded in a shared chrome component.
 *
 * WHY A PATHNAME GUARD (not a route group):
 *   The [locale] layout wraps EVERY surface, including the dashboard and the
 *   terminal route group, which own their own chrome (sidebar header / terminal
 *   frame). Rendering the marketing navbar there would double up a header. This
 *   component reads the current path and renders NOTHING but its children on
 *   those surfaces, so the app/auth/terminal chrome stays authoritative while
 *   marketing + content pages (home, blog, faq, privacy, impressum, ...) get
 *   the header + footer.
 *
 * The locale prefix is stripped before matching (paths here are locale-agnostic
 * because @/i18n/navigation's usePathname returns the path without the [locale]
 * segment).
 */

import { usePathname } from "@/i18n/navigation";
import { Navbar, type NavLink } from "@/components/sections/navbar";
import { MinimalHeader } from "@/components/sections/minimal-header";
import {
  FooterSection,
  type FooterLink,
} from "@/components/sections/footer-section";
import { siteConfig } from "@/site.config";

/**
 * Path prefixes that own their own chrome. Pages under these render WITHOUT the
 * marketing navbar/footer to avoid a double header.
 */
const CHROME_EXEMPT_PREFIXES = ["/dashboard", "/auth", "/terminal-demo"];

interface SiteChromeProps {
  children: React.ReactNode;
  links: NavLink[];
  logo: { src: string; alt: string; width: number; height: number };
  footerLinks: FooterLink[];
  companyName: string;
  /** Accessible label for the header nav landmark (i18n-resolved by the layout). */
  navLabel: string;
}

export function SiteChrome({
  children,
  links,
  logo,
  footerLinks,
  companyName,
  navLabel,
}: SiteChromeProps) {
  const pathname = usePathname() || "/";
  const isExempt = CHROME_EXEMPT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isExempt) {
    return <>{children}</>;
  }

  const { header, footer } = siteConfig.chrome;

  return (
    <div className="flex min-h-screen flex-col">
      {header === "minimal" ? (
        <MinimalHeader
          links={links}
          logo={logo}
          brandName={companyName}
          navLabel={navLabel}
        />
      ) : (
        <Navbar links={links} logo={logo} navLabel={navLabel} />
      )}
      <div className="flex-1">{children}</div>
      <FooterSection
        links={footerLinks}
        companyName={companyName}
        variant={footer}
      />
    </div>
  );
}
