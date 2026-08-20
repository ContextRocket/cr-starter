/**
 * Locale-aware navigation helpers -- a thin wrapper over next/navigation.
 *
 * Replaces next-intl's `createNavigation` so cr-starter has no next-intl
 * runtime dependency. The locale is always the first URL segment (localePrefix
 * is "always"), so it is derived from the pathname rather than a provider.
 *
 * Client:
 *   import { Link, useRouter, usePathname } from "@/i18n/navigation";
 *
 * Server components / server actions (string hrefs):
 *   import { redirect, permanentRedirect } from "@/i18n/redirect";
 *
 * Still from `next/navigation` (not provided here):
 *   useSearchParams, notFound, useParams
 */

"use client";

import NextLink from "next/link";
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from "next/navigation";
import {
  SUPPORTED_LOCALES,
  ACTIVE_LOCALES,
  resolveLocale,
  type SupportedLocale,
} from "./messages";
import type { ComponentProps } from "react";

const LOCALES = SUPPORTED_LOCALES as readonly string[];
const SINGLE_LOCALE = ACTIVE_LOCALES.length === 1;

/** The locale in a pathname's first segment, or null when absent. */
function localeFromPathname(pathname: string): SupportedLocale | null {
  const first = pathname.split("/")[1] ?? "";
  return LOCALES.includes(first) ? (first as SupportedLocale) : null;
}

/** True for URLs that must pass through un-prefixed. */
function isExternal(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

/** Prefix a (possibly already-prefixed) href with the target locale. */
export function prefixLocale(href: string, locale: string): string {
  if (isExternal(href)) return href;
  // Single-language mode: no locale prefix in URLs.
  if (SINGLE_LOCALE) return href;
  const first = href.split("/")[1] ?? "";
  if (LOCALES.includes(first)) return href; // already locale-prefixed
  const normalized = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

type LinkProps = ComponentProps<typeof NextLink> & { locale?: string };

/** next/link that prefixes the href with the active (or given) locale. */
export function Link({ href, locale, ...props }: LinkProps) {
  const pathname = useNextPathname();
  const target = locale ?? localeFromPathname(pathname) ?? resolveLocale(null);
  return <NextLink href={prefixLocale(String(href), target)} {...props} />;
}

/** Locale-stripped pathname (e.g. "/es/privacy" -> "/privacy"). */
export function usePathname(): string {
  const pathname = useNextPathname();
  // Single-language mode: no locale prefix to strip.
  if (SINGLE_LOCALE) return pathname;
  const locale = localeFromPathname(pathname);
  return locale ? pathname.replace(`/${locale}`, "") || "/" : pathname;
}

type RouterOptions = { locale?: string; scroll?: boolean };

/** next/navigation router whose push/replace prefix the locale. */
export function useRouter() {
  const router = useNextRouter();
  const pathname = useNextPathname();
  const current = localeFromPathname(pathname) ?? resolveLocale(null);

  // Single-language mode: no locale prefixing.
  if (SINGLE_LOCALE) {
    return {
      ...router,
      push: (href: string, options?: RouterOptions) => {
        const { locale: _locale, ...rest } = options ?? {};
        return router.push(href, rest);
      },
      replace: (href: string, options?: RouterOptions) => {
        const { locale: _locale, ...rest } = options ?? {};
        return router.replace(href, rest);
      },
    };
  }

  return {
    ...router,
    push: (href: string, options?: RouterOptions) => {
      const { locale, ...rest } = options ?? {};
      return router.push(prefixLocale(href, locale ?? current), rest);
    },
    replace: (href: string, options?: RouterOptions) => {
      const { locale, ...rest } = options ?? {};
      return router.replace(prefixLocale(href, locale ?? current), rest);
    },
  };
}
