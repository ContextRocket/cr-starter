/**
 * site.config.ts -- single source of identity for the static starter.
 *
 * Defaults come from site.json. Optional PUBLIC_* env vars override toggles
 * and ContextRocket connection settings. The site builds with no .env file.
 */

import siteData from "../../config/site.json";
import { blogConfig, blogContentDir } from "../../blog.config.mjs";

function env(key: string, fallback: string = ""): string {
  const fromImport =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>)[key]
      : undefined;
  return fromImport || process.env[key] || fallback;
}

function envBool(key: string, fallback: boolean = true): boolean {
  const val = env(key, "");
  if (val === "") return fallback;
  return val === "true" || val === "1";
}

function envEnum<T extends string>(key: string, fallback: T, options: T[]): T {
  const val = env(key, "") as T;
  if (val && options.includes(val)) return val;
  return fallback;
}

const siteDataExt = siteData as typeof siteData & {
  defaultLocale?: string;
  chat?: { fullscreenOnLoad?: boolean };
};
const siteChrome = siteData.chrome as typeof siteData.chrome & {
  exemptPrefixes?: readonly string[];
};

export type LegalEntityType = "company" | "individual" | "unincorporated";
const siteLegal = siteData.legal as typeof siteData.legal & {
  entityType?: LegalEntityType;
  legalForm?: string;
  register?: string;
  vat?: string;
  representedBy?: string;
};

export const siteConfig = {
  companyName: env("PUBLIC_SITE_NAME", siteData.company.name),
  legalName: siteData.company.legalName,
  tagline: siteData.company.tagline,
  description: siteData.company.description,
  siteUrl: env("PUBLIC_SITE_URL", siteData.company.siteUrl).replace(/\/$/, ""),
  contactEmail: env("PUBLIC_CONTACT_EMAIL", siteData.company.contactEmail),
  homeTitle: env("PUBLIC_HOME_TITLE", siteData.company.name),
  verification: {
    google: env("PUBLIC_GOOGLE_VERIFICATION", ""),
  },

  defaultLocale: env(
    "PUBLIC_DEFAULT_LOCALE",
    siteDataExt.defaultLocale ?? siteData.locales[0] ?? "en",
  ),
  locales: siteData.locales as readonly string[],

  theme: siteData.theme,
  // Forks may omit optional brand assets; fall back so chrome can always
  // resolve logo vs wordmark without narrowing on each site.json shape.
  assets: {
    ...siteData.assets,
    wordmark:
      (siteData.assets as { wordmark?: string }).wordmark ??
      siteData.assets.logo,
    wordmarkDark:
      (siteData.assets as { wordmarkDark?: string }).wordmarkDark ??
      siteData.assets.logoDark,
    chatFabIcon:
      (siteData.assets as { chatFabIcon?: string }).chatFabIcon ??
      siteData.assets.logo,
  },
  social: siteData.social,

  features: {
    blog: envBool("PUBLIC_BLOG_ENABLED", siteData.features.blog),
    chatFab: envBool("PUBLIC_CHAT_FAB_ENABLED", siteData.features.chatFab),
    languageSelector: envBool(
      "PUBLIC_LANGUAGE_SELECTOR_ENABLED",
      siteData.features.languageSelector,
    ),
    impressum: envBool(
      "PUBLIC_IMPRESSUM_ENABLED",
      siteData.features.impressum,
    ),
    attribution: envBool(
      "PUBLIC_ATTRIBUTION_ENABLED",
      siteData.features.attribution,
    ),
    poweredByBadge: envBool(
      "PUBLIC_POWERED_BY_BADGE",
      siteData.features.poweredByBadge,
    ),
    cookieConsent: envEnum<"auto" | "on" | "off">(
      "PUBLIC_COOKIE_CONSENT",
      siteData.features.cookieConsent as "auto" | "on" | "off",
      ["auto", "on", "off"],
    ),
  },

  chrome: {
    header: envEnum<"marketing" | "minimal" | "none">(
      "PUBLIC_HEADER_STYLE",
      siteData.chrome.header as "marketing" | "minimal" | "none",
      ["marketing", "minimal", "none"],
    ),
    footer: envEnum<"full" | "minimal" | "none">(
      "PUBLIC_FOOTER_STYLE",
      siteData.chrome.footer as "full" | "minimal" | "none",
      ["full", "minimal", "none"],
    ),
    logoVariant: siteData.chrome.logoVariant as "icon" | "wordmark",
    showBrandLogo: siteData.chrome.showBrandLogo,
    showThemeToggle: siteData.chrome.showThemeToggle,
    defaultTheme: envEnum<"system" | "light" | "dark">(
      "PUBLIC_DEFAULT_THEME",
      (siteData.chrome.defaultTheme ?? "system") as "system" | "light" | "dark",
      ["system", "light", "dark"],
    ),
    cookieBannerStyle: envEnum<"bar" | "card" | "terminal">(
      "PUBLIC_COOKIE_BANNER_STYLE",
      siteData.chrome.cookieBannerStyle as "bar" | "card" | "terminal",
      ["bar", "card", "terminal"],
    ),
    exemptPrefixes: siteChrome.exemptPrefixes ?? [],
  },

  nav: siteData.nav,
  legal: {
    entityType: (siteLegal.entityType ?? "company") as LegalEntityType,
    entity: siteLegal.entity,
    legalForm: siteLegal.legalForm,
    address: siteLegal.address,
    register: siteLegal.register,
    vat: siteLegal.vat,
    representedBy: siteLegal.representedBy,
    privacyContact: siteLegal.privacyContact,
  },

  publicRoutes: siteData.publicRoutes,

  blog: {
    basePath: env("BLOG_BASE_PATH", blogConfig.basePath),
    title: env("BLOG_TITLE", blogConfig.title),
    contentDir: blogContentDir(),
  },

  analytics: {
    webVitalsEndpoint: env("PUBLIC_WEB_VITALS_ENDPOINT", ""),
  },

  chat: {
    mode: envEnum<"demo" | "live">("PUBLIC_CR_CHAT_MODE", "demo", [
      "demo",
      "live",
    ]),
    agentUrl: env("PUBLIC_CR_AGENT_URL", "https://app-api.contextrocket.com"),
    handle: env("PUBLIC_CONTEXTROCKET_HANDLE", "contextrocket"),
    apiKey: env("PUBLIC_CONTEXTROCKET_API_KEY", ""),
  },

  allowAiCrawlers: true,
};

export type SiteConfig = typeof siteConfig;
export type FeatureFlagName = keyof typeof siteConfig.features;

export type NavLinkConfig = {
  labelKey: string;
  href: string;
  appOnly?: boolean;
  variant?: string;
  featureFlag?: FeatureFlagName;
};

/** True when the fork serves exactly one locale (clean URLs, no /en prefix). */
export function isSingleLocale(): boolean {
  return siteConfig.locales.length === 1;
}
