"use client";

/**
 * SiteChrome -- wraps marketing / content pages with the shared site Navbar and
 * Footer so every such page gets a navbar via the [locale] layout.
 *
 * WHY A PATHNAME GUARD (not a route group):
 *   The [locale] layout wraps EVERY surface, including the dashboard and the
 *   terminal route group, which own their own chrome (sidebar header / terminal
 *   frame). Rendering the marketing navbar there would double up a header. This
 *   component reads the current path and renders NOTHING but its children on
 *   those surfaces, so the app/auth/terminal chrome stays authoritative while
 *   marketing + content pages (home, blog, faq, privacy, impressum, ...) get
 *   the navbar + footer.
 *
 * The locale prefix is stripped before matching (paths here are locale-agnostic
 * because @/i18n/navigation's usePathname returns the path without the [locale]
 * segment).
 */

import { usePathname } from "@/i18n/navigation";
import { Navbar, type NavLink } from "@/components/sections/navbar";
import {
  FooterSection,
  type FooterLink,
} from "@/components/sections/footer-section";

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
}

export function SiteChrome({
  children,
  links,
  logo,
  footerLinks,
  companyName,
}: SiteChromeProps) {
  const pathname = usePathname() || "/";
  const isExempt = CHROME_EXEMPT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isExempt) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar links={links} logo={logo} />
      <div className="flex-1">{children}</div>
      <FooterSection links={footerLinks} companyName={companyName} />
    </div>
  );
}
