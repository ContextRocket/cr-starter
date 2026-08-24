"use client";

/**
 * LocaleProvider -- client-side locale context.
 *
 * The active locale comes from the `[locale]` URL segment, passed in as
 * `initialLocale` by the [locale] layout. Switching locale navigates to
 * the same page under the new prefix (a full route change, so the new
 * page's payload carries the new locale's messages).
 *
 * A NEXT_LOCALE cookie is written on change so the root locale detector
 * (app/page.tsx) can redirect returning visitors to their last choice.
 *
 *   const { locale, changeLocale } = useLocale();
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  setLocale,
  registerLocaleMessages,
  getCurrentLocale,
  getLocaleMessages,
} from "./keys";
import { getIntlTranslator, type IntlTranslator } from "./intl";
import type { SupportedLocale } from "./messages";
import { CLIENT_LOCALE_LOADERS } from "./locale-loaders";

// Track which non-en locales have been registered client-side (per page load).
const _clientRegistered = new Set<SupportedLocale>(["en"]);

interface LocaleContextValue {
  locale: SupportedLocale;
  changeLocale: (newLocale: SupportedLocale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Persist the locale to a cookie (1-year expiry, lax same-site). */
function writeLocaleCookie(locale: SupportedLocale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function LocaleProvider({
  initialLocale,
  messages,
  children,
}: {
  initialLocale: SupportedLocale;
  /**
   * The active non-en locale's message tree, serialized into the RSC payload
   * by the [locale] layout via `getServerLocaleTree(locale)`. Pass null
   * (or omit) when the active locale is "en" -- it is always bundled.
   */
  messages?: Record<string, unknown> | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  // Register the injected non-en messages BEFORE calling setLocale so that
  // the very first render (including hydration) resolves strings correctly.
  // Order matters: register -> setLocale -> children render.
  if (
    messages &&
    initialLocale !== "en" &&
    !_clientRegistered.has(initialLocale)
  ) {
    registerLocaleMessages(initialLocale, messages);
    _clientRegistered.add(initialLocale);
  }

  // Keep i18n module state and <html lang> in sync with current client locale.
  setLocale(locale);
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }

  const changeLocale = useCallback(
    (newLocale: SupportedLocale) => {
      if (newLocale === locale) return;

      const localeCode: string = newLocale;

      const doSwitch = () => {
        writeLocaleCookie(newLocale);
        setLocaleState(newLocale);
        setLocale(newLocale);
        if (typeof document !== "undefined") {
          document.documentElement.lang = newLocale;
        }
        // usePathname returns the locale-stripped path; pass { locale } so the
        // router prefixes the new locale (do not hand-rewrite /es -> /en).
        router.replace(pathname || "/", { locale: newLocale });
      };

      if (
        localeCode === "en" ||
        _clientRegistered.has(localeCode as SupportedLocale)
      ) {
        doSwitch();
        return;
      }

      const loadLocale = CLIENT_LOCALE_LOADERS[localeCode as SupportedLocale];
      if (!loadLocale) {
        console.error(
          `[i18n] changeLocale: no loader registered for "${newLocale}"`,
        );
        return;
      }
      loadLocale()
        .then((tree) => {
          registerLocaleMessages(localeCode as SupportedLocale, tree);
          _clientRegistered.add(localeCode as SupportedLocale);
          doSwitch();
        })
        .catch((err: unknown) => {
          console.error(
            `[i18n] changeLocale: failed to load messages for "${newLocale}"`,
            err,
          );
        });
    },
    [locale, pathname, router],
  );

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Locale + switch API for components. */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}

/** Optional form for shared shells that can also render in isolation. */
export function useLocaleOptional(): LocaleContextValue | null {
  return useContext(LocaleContext);
}

/**
 * Locale-bound translator for client components. next-intl-compatible: pass an
 * optional `namespace` to resolve keys relative to it, and use `t.rich`,
 * `t.raw`, `t.has` on the returned function.
 *
 * This is especially important during SSR: a client component is rendered on
 * the server before LocaleProvider hydrates, so reading the global `t()` state
 * can pick up another request's locale. The provider's explicit locale is
 * stable for that render and also handles forks that add locales such as zh.
 */
export function useTranslations(namespace?: string): IntlTranslator {
  const context = useLocaleOptional();
  const locale = context?.locale ?? getCurrentLocale();
  return useMemo(
    () => getIntlTranslator(locale, getLocaleMessages(locale), namespace),
    [locale, namespace],
  );
}
