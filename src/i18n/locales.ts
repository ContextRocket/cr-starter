import { siteConfig } from "@/config/site.config";
import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
  isSupportedLocale,
} from "./messages/registry";

/** Locales the site actually serves (from site.json). */
export function getActiveLocales(): SupportedLocale[] {
  const configured = siteConfig.locales.filter(isSupportedLocale);
  return configured.length > 0 ? configured : ["en"];
}

export function getDefaultLocale(): SupportedLocale {
  const active = getActiveLocales();
  const preferred = siteConfig.defaultLocale;
  if (isSupportedLocale(preferred) && active.includes(preferred)) {
    return preferred;
  }
  return active[0] ?? "en";
}

export function resolveLocale(raw: string | undefined): SupportedLocale {
  if (raw && isSupportedLocale(raw) && getActiveLocales().includes(raw)) {
    return raw;
  }
  return getDefaultLocale();
}

export { SUPPORTED_LOCALES, isSupportedLocale };
export type { SupportedLocale };
