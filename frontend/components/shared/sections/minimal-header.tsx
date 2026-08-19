"use client";

/**
 * minimal-header.tsx -- a compact personal-brand header.
 *
 * The lightweight counterpart to the marketing Navbar: brand name / logo on the
 * left, a small optional inline link set on the right, and nothing else -- no app
 * chrome, no CTA button, no mobile hamburger dialog. This is the header a
 * personal-brand fork selects via `siteConfig.chrome.header = "minimal"`.
 *
 * Token-styled only (no hardcoded hex) so it inherits the fork's theme. Links
 * are already-resolved (label + locale-prefixed href) -- the same i18n-agnostic
 * contract the Navbar uses -- so the [locale] layout owns t() and locale
 * prefixing and this component stays a pure primitive.
 */

import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import type { NavLink } from "@/components/shared/sections/navbar";
import { ThemeToggle } from "@/components/shared/ui/theme-toggle";
import { LocaleSwitcher } from "@/i18n/locale-switcher";
import { BrandLogo, type BrandLogoAsset } from "@/components/shared/sections/brand-logo";

export interface MinimalHeaderProps {
  /** Right-aligned inline links. Empty → just the brand, no link set. */
  links: NavLink[];
  /** Optional theme-aware brand logo. When omitted, the brand NAME is shown. */
  logo?: BrandLogoAsset;
  /** Brand name -- shown as text when no logo, and as the logo alt fallback. */
  brandName: string;
  /** Accessible label for the primary nav landmark. */
  navLabel: string;
  /** Render the light/dark theme toggle on the right. Default true. */
  showThemeToggle?: boolean;
  /** Render the language selector. Default true. */
  showLanguageSelector?: boolean;
  className?: string;
  /** Inner container class. Defaults to max-w-screen-md px-4 sm:px-6. */
  containerClassName?: string;
}

export function MinimalHeader({
  links,
  logo,
  brandName,
  navLabel,
  showThemeToggle = true,
  showLanguageSelector = true,
  className = "",
  containerClassName = "max-w-screen-md px-4 sm:px-6",
}: MinimalHeaderProps) {
  return (
    <header
      className={`w-full border-b border-border bg-background text-foreground ${className}`}
    >
      <nav
        aria-label={navLabel}
        className={`mx-auto flex h-14 items-center justify-between ${containerClassName}`}
      >
        {/* Brand -- logo if provided, otherwise the brand name as text. */}
        <LocaleLink
          href="/"
          className="shrink-0 text-base font-semibold tracking-tight hover:text-primary transition-colors"
        >
          {logo ? <BrandLogo logo={logo} brandName={brandName} /> : brandName}
        </LocaleLink>

        {/* Right side: optional inline link set + theme toggle + language. */}
        {(links.length > 0 || showThemeToggle || showLanguageSelector) && (
          <div className="flex items-center gap-4 sm:gap-6">
            {links.map((link) => {
              if (link.variant === "primary") {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-2">
              {showLanguageSelector && <LocaleSwitcher />}
              {showThemeToggle && <ThemeToggle />}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
