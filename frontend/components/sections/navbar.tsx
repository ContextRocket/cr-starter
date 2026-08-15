"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BrandLogo, type BrandLogoAsset } from "@/components/sections/brand-logo";

export interface NavLink {
  label: string;
  href: string;
  variant?: "default" | "primary";
}

export interface NavbarProps {
  links: NavLink[];
  /**
   * Brand mark (theme-aware icon or wordmark). Optional: when omitted, the brand
   * NAME (`brandName`) is shown as text instead of an image — so a fork whose
   * `assets.logo` is only an app icon can render a wordmark-free header.
   */
  logo?: BrandLogoAsset;
  /** Brand name — shown as text when no `logo`, and as the logo alt fallback. */
  brandName?: string;
  /**
   * Accessible label for the primary nav landmark. i18n-resolved by the caller.
   * Falls back to "Global" only when a caller has not supplied one.
   */
  navLabel?: string;
  /** Render the light/dark theme toggle on the right. Default true. */
  showThemeToggle?: boolean;
  className?: string;
}

export function Navbar({
  links,
  logo,
  brandName = "",
  navLabel = "Global",
  showThemeToggle = true,
  className = "",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`w-full bg-background text-foreground shadow-sm overflow-visible relative z-50 ${className}`}
    >
      <nav
        aria-label={navLabel}
        className="max-w-screen-xl px-4 sm:px-8 mx-auto flex items-center justify-between h-16"
      >
        {/* Logo (theme-aware image) or the brand NAME as text when no logo. */}
        <LocaleLink href="/" className="shrink-0 flex items-center">
          {logo ? (
            <BrandLogo logo={logo} />
          ) : (
            <span className="text-base font-semibold tracking-tight text-foreground">
              {brandName}
            </span>
          )}
        </LocaleLink>

        {/* Desktop links + right-side controls (theme toggle) */}
        <div className="hidden lg:flex items-center gap-8">
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

        {/* Mobile controls: theme toggle + hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          {showThemeToggle && <ThemeToggle />}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
          >
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background text-foreground px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <LocaleLink
              href="/"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              {logo ? (
                <BrandLogo logo={logo} />
              ) : (
                <span className="text-base font-semibold tracking-tight text-foreground">
                  {brandName}
                </span>
              )}
            </LocaleLink>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-muted-foreground"
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
