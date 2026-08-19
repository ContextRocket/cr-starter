import "server-only";

import {
  redirect as nextRedirect,
  permanentRedirect as nextPermanentRedirect,
} from "next/navigation";

import { getCurrentLocale } from "./keys";
import { SUPPORTED_LOCALES } from "./messages";

/**
 * Locale-aware redirect helpers for server components and server actions.
 *
 * The target locale resolves from the NEXT_LOCALE cookie (written by the
 * I18nProvider on every client-side switch) and falls back to the site default.
 * Call sites keep a string href.
 *
 * Always `return await redirect(...)` so TypeScript treats the path as
 * unreachable (Promise<never> alone does not narrow).
 *
 * Client components must not import this module -- use `useRouter` from
 * `@/i18n/navigation` instead.
 */

const LOCALES = SUPPORTED_LOCALES as readonly string[];

function prefixLocale(href: string, locale: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  const first = href.split("/")[1] ?? "";
  if (LOCALES.includes(first)) return href; // already locale-prefixed
  const normalized = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export async function redirect(href: string, locale?: string): Promise<never> {
  const resolved = locale ?? getCurrentLocale();
  return nextRedirect(prefixLocale(href, resolved));
}

export async function permanentRedirect(
  href: string,
  locale?: string,
): Promise<never> {
  const resolved = locale ?? getCurrentLocale();
  return nextPermanentRedirect(prefixLocale(href, resolved));
}
