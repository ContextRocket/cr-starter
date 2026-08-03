"use client";

/**
 * LocaleProvider - URL-segment locale context for the cr-starter.
 *
 * Adopted from context-rocket/frontend/i18n/locale-provider.tsx (the exact
 * pattern the starter follows: language code lives in the URL, /en /es /de).
 *
 * The active locale comes from the `[locale]` route segment (passed in as
 * `initialLocale` by the [locale] layout). Switching locale navigates to the
 * same page under the new prefix via next-intl's router - no cookie needed.
 *
 * A NEXT_LOCALE cookie is still written on change so the root locale
 * detector (app/page.tsx) can redirect first-time visitors to their last
 * chosen language instead of the site default.
 *
 * html lang: set by the [locale] layout from the URL segment, and kept in
 * sync here on the client after a locale switch.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { setLocale, registerLocaleMessages } from "./keys";
import type { SupportedLocale } from "./messages";

/**
 * Explicit per-locale lazy loaders.
 *
 * MUST be an explicit map, NOT a template-literal dynamic import -- a computed
 * dynamic import causes webpack to include the entire messages/ directory context,
 * which may pull in unexpected modules. Named imports emit exactly two lazy chunks.
 * `en` is always bundled (fallback).
 */
type LocaleLoader = () => Promise<{ [key: string]: unknown }>;
const CLIENT_LOCALE_LOADERS: Partial<Record<SupportedLocale, LocaleLoader>> = {
  es: () => import("./messages/es") as Promise<{ [key: string]: unknown }>,
  de: () => import("./messages/de") as Promise<{ [key: string]: unknown }>,
};

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
   * The active non-en locale's message tree, serialised into the RSC payload
   * by the [locale] layout via `getServerLocaleTree(locale)`. Pass `null`
   * (or omit) when the active locale is `en` - it is always bundled.
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

      const doSwitch = () => {
        writeLocaleCookie(newLocale);
        setLocaleState(newLocale);
        setLocale(newLocale);
        if (typeof document !== "undefined") {
          document.documentElement.lang = newLocale;
        }

        // usePathname from @/i18n/navigation returns the locale-stripped path
        // (e.g. "/privacy", not "/es/privacy"). Pass { locale } so next-intl
        // prefixes the new locale - do not hand-rewrite /es -> /en.
        router.replace(pathname || "/", { locale: newLocale });
      };

      if (newLocale === "en" || _clientRegistered.has(newLocale)) {
        // en is always bundled; already-registered locales need no import.
        doSwitch();
        return;
      }

      // Lazy-load the target locale's tree via its explicit loader (emits a
      // per-locale chunk; never a directory context - see CLIENT_LOCALE_LOADERS).
      const loadLocale = CLIENT_LOCALE_LOADERS[newLocale];
      if (!loadLocale) {
        // No loader (unexpected locale) - do not switch to an unloaded locale.
        console.error(
          `[i18n] changeLocale: no loader registered for "${newLocale}"`,
        );
        return;
      }
      loadLocale()
        .then((mod: Record<string, unknown>) => {
          const tree = mod[newLocale] as Record<string, unknown> | undefined;
          if (!tree) {
            // Malformed module - do not switch to an unloaded locale.
            console.error(
              `[i18n] changeLocale: module for "${newLocale}" did not export expected key`,
            );
            return;
          }
          registerLocaleMessages(newLocale, tree);
          _clientRegistered.add(newLocale);
          doSwitch();
        })
        .catch((err: unknown) => {
          // Network or parse failure - stay on the current locale. Never
          // switch to a locale whose tree isn't loaded (raw keys would leak).
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

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
