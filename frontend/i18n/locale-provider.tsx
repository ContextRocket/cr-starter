"use client";

/**
 * LocaleProvider -- cookie-persisted locale context for the cr-starter.
 *
 * Adapted from context-rocket/frontend/i18n/locale-provider.tsx.
 *
 * This implementation uses a cookie (NEXT_LOCALE) + React context to track
 * the active locale WITHOUT URL segments. The active locale is read on mount
 * from the cookie, and persisted back on change.
 *
 * UPGRADE PATH: for full SEO/hreflang support, consider switching to
 * Next.js [locale] URL-segment routing. The message files and LocaleProvider
 * contract are compatible with that upgrade; the main change is reading the
 * locale from the URL param rather than a cookie, and using next-intl or
 * similar. Until then, the cookie approach gives a working multi-locale UI
 * without restructuring the route tree.
 *
 * html lang: updated on the client by this provider after hydration.
 * The <html lang> attribute in app/layout.tsx reflects siteConfig.defaultLocale
 * at SSR time. This is a known limitation of the cookie/provider approach.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { setLocale, registerLocaleMessages } from "./keys";
import { resolveLocale, type SupportedLocale } from "./messages";

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

/** Read the NEXT_LOCALE cookie (browser-safe). */
function readLocaleCookie(): SupportedLocale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  return resolveLocale(match?.[1]);
}

/** Persist the locale to a cookie (1-year expiry, lax same-site). */
function writeLocaleCookie(locale: SupportedLocale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  /**
   * The locale to initialise with. Pass siteConfig.defaultLocale from the
   * root server layout; the provider will override this on mount if a
   * NEXT_LOCALE cookie is present.
   */
  initialLocale: SupportedLocale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  // On mount: read the persisted cookie and switch to it if different.
  // This runs client-side only, avoiding SSR/hydration mismatch.
  // The empty dependency array is intentional: we only want this to run once
  // on mount (reading the cookie), not on every locale change.
  useEffect(() => {
    const persisted = readLocaleCookie();
    if (persisted !== locale) {
      void ensureRegistered(persisted).then(() => {
        setLocaleState(persisted);
        setLocale(persisted);
        document.documentElement.lang = persisted;
      });
    }
    // The empty dep array is intentional: mount-once cookie read.
    // Adding `locale` would cause a loop (locale changes -> effect runs -> locale changes).
  }, []); // mount-once

  // Keep i18n module state and <html lang> in sync.
  setLocale(locale);
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }

  const changeLocale = useCallback(
    (newLocale: SupportedLocale) => {
      if (newLocale === locale) return;

      void ensureRegistered(newLocale).then(() => {
        writeLocaleCookie(newLocale);
        setLocaleState(newLocale);
        setLocale(newLocale);
        if (typeof document !== "undefined") {
          document.documentElement.lang = newLocale;
        }
      });
    },
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Ensure the locale's message tree is loaded and registered.
 * `en` is always bundled. Non-en locales are loaded on first use.
 */
async function ensureRegistered(locale: SupportedLocale): Promise<void> {
  if (locale === "en" || _clientRegistered.has(locale)) return;

  const loader = CLIENT_LOCALE_LOADERS[locale];
  if (!loader) {
    console.error(`[i18n] No loader registered for locale "${locale}"`);
    return;
  }

  try {
    const mod = await loader();
    const tree = mod[locale] as Record<string, unknown> | undefined;
    if (!tree) {
      console.error(
        `[i18n] Locale module for "${locale}" did not export expected key`,
      );
      return;
    }
    registerLocaleMessages(locale, tree);
    _clientRegistered.add(locale);
  } catch (err) {
    console.error(`[i18n] Failed to load messages for "${locale}"`, err);
  }
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
