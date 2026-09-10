"use client";

/**
 * Compact personal-brand header (chrome.header === "minimal").
 */

import React from "react";
import { BrandLogo, type BrandLogoAsset } from "./BrandLogo";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher, type LocaleOption } from "./LocaleSwitcher";
import type { NavLink } from "./Navbar";

export interface MinimalHeaderProps {
  links: NavLink[];
  logo?: BrandLogoAsset;
  brandName: string;
  homeHref?: string;
  navLabel: string;
  showThemeToggle?: boolean;
  showLanguageSelector?: boolean;
  locale?: string;
  localeOptions?: LocaleOption[];
  changeLanguageLabel?: string;
  themeLabels?: {
    toggle: string;
    light: string;
    dark: string;
  };
  className?: string;
  containerClassName?: string;
}

export function MinimalHeader({
  links,
  logo,
  brandName,
  homeHref = "/",
  navLabel,
  showThemeToggle = true,
  showLanguageSelector = true,
  locale = "en",
  localeOptions = [],
  changeLanguageLabel,
  themeLabels,
  className = "",
  containerClassName = "max-w-screen-md px-4 sm:px-6",
}: MinimalHeaderProps) {
  const showLocale =
    showLanguageSelector && localeOptions.length > 1;

  return (
    <header
      className={`w-full border-b border-border bg-background text-foreground ${className}`}
    >
      <nav
        aria-label={navLabel}
        className={`mx-auto flex h-14 items-center justify-between ${containerClassName}`}
      >
        <a
          href={homeHref}
          className="shrink-0 text-base font-semibold tracking-tight transition-colors hover:text-primary"
        >
          {logo ? (
            <BrandLogo logo={logo} brandName={brandName} />
          ) : (
            brandName
          )}
        </a>

        {(links.length > 0 || showThemeToggle || showLocale) && (
          <div className="flex items-center gap-4 sm:gap-6">
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
              {showThemeToggle && (
                <ThemeToggle
                  labelToggle={themeLabels?.toggle}
                  labelLight={themeLabels?.light}
                  labelDark={themeLabels?.dark}
                />
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
