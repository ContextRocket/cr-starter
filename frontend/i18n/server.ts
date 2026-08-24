/**
 * i18n/server.ts -- next-intl-compatible SERVER surface.
 *
 * Drop-in replacement for `import { ... } from "next-intl/server"`:
 *
 *   const t = await getTranslations("namespace");
 *   const locale = await getLocale();
 *
 * The active locale comes from the request-scoped store set by `setLocale()` in
 * the [locale] layout (the same mechanism the existing server `t()` uses), so
 * these functions are request-scoped without threading a locale through props.
 */

import { getCurrentLocale, getLocaleMessages, setLocale } from "./keys";
import { getIntlTranslator, type IntlTranslator } from "./intl";
import { createFormatter, type Formatter } from "./format";
import type { SupportedLocale, Messages } from "./keys";

interface GetTranslationsOptions {
  locale?: SupportedLocale;
  namespace?: string;
}

/** next-intl's `getTranslations`: `getTranslations("ns")` or `getTranslations({ locale, namespace })`. */
export async function getTranslations(
  nsOrOptions?: string | GetTranslationsOptions,
): Promise<IntlTranslator> {
  let namespace: string | undefined;
  let locale: SupportedLocale | undefined;
  if (typeof nsOrOptions === "string") {
    namespace = nsOrOptions;
  } else if (nsOrOptions) {
    namespace = nsOrOptions.namespace;
    locale = nsOrOptions.locale;
  }
  const active = locale ?? getCurrentLocale();
  return getIntlTranslator(active, getLocaleMessages(active), namespace);
}

/** The active request locale (next-intl's `getLocale`). */
export async function getLocale(): Promise<SupportedLocale> {
  return getCurrentLocale();
}

/** Locale-bound `Intl.*` formatter (next-intl's `getFormatter`). */
export async function getFormatter(): Promise<Formatter> {
  return createFormatter(getCurrentLocale());
}

/** The active locale's message tree (next-intl's `getMessages`). */
export async function getMessages(): Promise<Messages> {
  return getLocaleMessages(getCurrentLocale());
}

/** A "now" for the request (next-intl's `getNow`). */
export async function getNow(): Promise<Date> {
  return new Date();
}

/**
 * Pin the request locale for static rendering (next-intl's `setRequestLocale`,
 * previously `unstable_setRequestLocale`). Maps onto our `setLocale`.
 */
export function setRequestLocale(locale: SupportedLocale): void {
  setLocale(locale);
}

export { setRequestLocale as unstable_setRequestLocale };
