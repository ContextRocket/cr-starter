"use client";

/**
 * minimal-header.tsx — a compact personal-brand header.
 *
 * The lightweight counterpart to the marketing Navbar: brand name / logo on the
 * left, a small optional inline link set on the right, and nothing else — no app
 * chrome, no CTA button, no mobile hamburger dialog. This is the header a
 * personal-brand fork selects via `siteConfig.chrome.header = "minimal"`.
 *
 * Token-styled only (no hardcoded hex) so it inherits the fork's theme. Links
 * are already-resolved (label + locale-prefixed href) — the same i18n-agnostic
 * contract the Navbar uses — so the [locale] layout owns t() and locale
 * prefixing and this component stays a pure primitive.
 */

import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import type { NavLink } from "@/components/sections/navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo, type BrandLogoAsset } from "@/components/sections/brand-logo";

export interface MinimalHeaderProps {
  /** Right-aligned inline links. Empty → just the brand, no link set. */
  links: NavLink[];
  /** Optional theme-aware brand logo. When omitted, the brand NAME is shown. */
  logo?: BrandLogoAsset;
  /** Brand name — shown as text when no logo, and as the logo alt fallback. */
  brandName: string;
  /** Accessible label for the primary nav landmark. */
  navLabel: string;
  /** Render the light/dark theme toggle on the right. Default true. */
  showThemeToggle?: boolean;
  className?: string;
}

export function MinimalHeader({
  links,
  logo,
  brandName,
  navLabel,
  showThemeToggle = true,
  className = "",
}: MinimalHeaderProps) {
  return (
    <header
      className={`w-full border-b border-border bg-background text-foreground ${className}`}
    >
      <nav
        aria-label={navLabel}
        className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4 sm:px-6"
      >
        {/* Brand — logo if provided, otherwise the brand name as text. */}
        <LocaleLink
          href="/"
          className="shrink-0 text-base font-semibold tracking-tight hover:text-primary transition-colors"
        >
          {logo ? <BrandLogo logo={logo} brandName={brandName} /> : brandName}
        </LocaleLink>

        {/* Right side: optional inline link set + theme toggle. Renders when
            there are links OR the toggle is enabled; always keyboard-accessible. */}
        {(links.length > 0 || showThemeToggle) && (
          <div className="flex items-center gap-4 sm:gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {showThemeToggle && <ThemeToggle />}
          </div>
        )}
      </nav>
    </header>
  );
}
