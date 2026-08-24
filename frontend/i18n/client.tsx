"use client";

/**
 * i18n/client.tsx -- next-intl-compatible CLIENT surface.
 *
 * This barrel is a drop-in replacement for `import { ... } from "next-intl"`:
 * repoint the import here and the call sites work unchanged.
 *
 *   import { useTranslations, useLocale, useFormatter } from "@/i18n/client";
 *
 * It intentionally does NOT re-export the provider hooks that already exist with
 * a different (richer) shape in i18n/locale-provider (`useLocale` there returns
 * `{ locale, changeLocale }`); this file's `useLocale()` returns a `string` to
 * match next-intl.
 */

import { useMemo, useState, type ReactNode } from "react";
import {
  LocaleProvider,
  useLocaleOptional,
  useTranslations,
} from "./locale-provider";
import { getCurrentLocale, getLocaleMessages } from "./keys";
import { createFormatter, type Formatter } from "./format";
import type { SupportedLocale, Messages } from "./keys";

export { useTranslations };
export type { IntlTranslator } from "./intl";

/** The active locale as a string (next-intl's `useLocale`). */
export function useLocale(): SupportedLocale {
  const context = useLocaleOptional();
  return context?.locale ?? getCurrentLocale();
}

/** Locale-bound `Intl.*` formatter (next-intl's `useFormatter`). */
export function useFormatter(): Formatter {
  const locale = useLocale();
  return useMemo(() => createFormatter(locale), [locale]);
}

/** The active locale's message tree (next-intl's `useMessages`). */
export function useMessages(): Messages {
  const locale = useLocale();
  return getLocaleMessages(locale);
}

/** A stable "now" for the render (next-intl's `useNow`). */
export function useNow(): Date {
  const [now] = useState(() => new Date());
  return now;
}

/**
 * Drop-in adapter for next-intl's `NextIntlClientProvider`. Maps its
 * `{ locale, messages }` props onto our `LocaleProvider`, which registers the
 * locale tree and drives the client translator.
 */
export function NextIntlClientProvider({
  locale,
  messages,
  children,
}: {
  locale: SupportedLocale;
  messages?: Record<string, unknown> | null;
  children: ReactNode;
  // Extra next-intl props (timeZone, now, formats, ...) are accepted and ignored.
  [key: string]: unknown;
}) {
  return (
    <LocaleProvider initialLocale={locale} messages={messages}>
      {children}
    </LocaleProvider>
  );
}
