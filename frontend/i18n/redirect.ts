import "server-only";

import { getLocale } from "next-intl/server";

import {
  permanentRedirect as intlPermanentRedirect,
  redirect as intlRedirect,
} from "@/i18n/navigation";

/**
 * Locale-aware redirect helpers for server components and server actions.
 *
 * next-intl's createNavigation `redirect` requires `{ href, locale }`. These
 * wrappers resolve the request locale so call sites keep a string href.
 *
 * Always `return await redirect(...)` so TypeScript treats the path as
 * unreachable (Promise<never> alone does not narrow).
 *
 * Client components must not import this module - use `useRouter` from
 * `@/i18n/navigation` instead.
 */

export async function redirect(href: string, locale?: string): Promise<never> {
  const resolved = locale ?? (await getLocale());
  return intlRedirect({ href, locale: resolved });
}

export async function permanentRedirect(
  href: string,
  locale?: string,
): Promise<never> {
  const resolved = locale ?? (await getLocale());
  return intlPermanentRedirect({ href, locale: resolved });
}
