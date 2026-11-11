"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { BrandLogo, type BrandLogoAsset } from "./BrandLogo";
import { LocaleSwitcher, type LocaleOption } from "./LocaleSwitcher";

export interface NavLink {
  label: string;
  href: string;
  variant?: "default" | "primary";
}

export interface NavbarProps {
  links: NavLink[];
  logo?: BrandLogoAsset;
  brandName?: string;
  homeHref?: string;
  navLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  showLanguageSelector?: boolean;
  locale?: string;
  localeOptions?: LocaleOption[];
  changeLanguageLabel: string;
  className?: string;
}

export function Navbar({
  links,
  logo,
  brandName = "",
  homeHref = "/",
  navLabel,
  openMenuLabel,
  closeMenuLabel,
  showLanguageSelector = true,
  locale = "en",
  localeOptions = [],
  changeLanguageLabel,
  className = "",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showLocale =
    showLanguageSelector && localeOptions.length > 1;

  return (
    <header
      className={`relative z-50 w-full overflow-visible bg-background text-foreground shadow-sm ${className}`}
    >
      <nav
        aria-label={navLabel}
        className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-8"
      >
        <a href={homeHref} className="flex shrink-0 items-center">
          {logo ? (
            <BrandLogo logo={logo} brandName={brandName} />
          ) : (
            <span className="text-base font-semibold tracking-tight text-foreground">
              {brandName}
            </span>
          )}
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) =>
            link.variant === "primary" ? (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ),
          )}
          <div className="flex items-center gap-2">
            {showLocale && (
              <LocaleSwitcher
                locale={locale}
                options={localeOptions}
                changeLanguageLabel={changeLanguageLabel}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          {showLocale && (
            <LocaleSwitcher
              locale={locale}
              options={localeOptions}
              changeLanguageLabel={changeLanguageLabel}
            />
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={openMenuLabel}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-panel"
          >
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>

      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel id="mobile-navigation-panel" className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 text-foreground sm:max-w-sm sm:ring-1 sm:ring-border">
          <DialogTitle className="sr-only">{navLabel}</DialogTitle>
          <div className="flex items-center justify-between">
            <a
              href={homeHref}
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              {logo ? (
                <BrandLogo logo={logo} brandName={brandName} />
              ) : (
                <span className="text-base font-semibold tracking-tight text-foreground">
                  {brandName}
                </span>
              )}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={closeMenuLabel}
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="space-y-2">
              {links.map((link) =>
                link.variant === "primary" ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-4 block w-full rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
