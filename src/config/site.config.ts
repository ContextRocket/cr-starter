/**
 * site.config.ts -- single source of identity for the static starter.
 *
 * Defaults come from site.json. Optional PUBLIC_* env vars override toggles
 * and ContextRocket connection settings. The site builds with no .env file.
 */

import siteData from "../../config/site.json";
import { blogConfig, blogContentDir } from "../../blog.config.mjs";
import type { SiteIntegrationConfig } from "@/lib/integrations";

const contextRocketBrandAssetsUrl =
  "https://contextrocket.cdn.contextrocket.com/brand";

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
  contextrocket?: { handle?: string };
  homeMetaDescription?: string;
  homeMetaTitle?: string;
  titleSeparator?: string;
  chat?: { fullscreen?: boolean; fullscreenOnOpen?: boolean; fullscreenOnLoad?: boolean };
  contactForm?: { mode?: "demo" | "live" };
  integrations?: Record<string, SiteIntegrationConfig>;
  integrationConsentMode?: "auto" | "always" | "external";
};
const siteChrome = siteData.chrome as typeof siteData.chrome & {
  exemptPrefixes?: readonly string[];
  poweredByTone?: "ink" | "white";
};
const contextRocketHandle = env(
  "PUBLIC_CONTEXTROCKET_HANDLE",
  siteDataExt.contextrocket?.handle ?? "",
);
const contextRocketApiBase = env(
  "PUBLIC_CR_AGENT_URL",
  "https://api.contextrocket.com",
).replace(/\/$/, "");

export const siteConfig = {
  trailingSlash: (siteData as typeof siteData & { trailingSlash?: "always" | "never" }).trailingSlash ?? "always",
  companyName: env("PUBLIC_SITE_NAME", siteData.company.name),
  tagline: siteData.company.tagline,
  description: siteData.company.description,
  siteUrl: env("PUBLIC_SITE_URL", siteData.company.siteUrl).replace(/\/$/, ""),
  contextRocketBrandAssetsUrl,
  contactEmail: env("PUBLIC_CONTACT_EMAIL", siteData.company.contactEmail),
  homeTitle: env("PUBLIC_HOME_TITLE", siteData.company.name),
  homeMetaDescription: env("PUBLIC_HOME_META_DESCRIPTION", siteDataExt.homeMetaDescription ?? ""),
  homeMetaTitle: env("PUBLIC_HOME_META_TITLE", siteDataExt.homeMetaTitle ?? ""),
  titleSeparator: siteDataExt.titleSeparator?.trim() || "·",
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
  },
  social: siteData.social,

  features: {
    blog: envBool("PUBLIC_BLOG_ENABLED", siteData.features.blog),
    chatFab: envBool("PUBLIC_CHAT_FAB_ENABLED", siteData.features.chatFab),
    languageSelector: envBool(
      "PUBLIC_LANGUAGE_SELECTOR_ENABLED",
      siteData.features.languageSelector,
    ),
    poweredByBadge: envBool(
      "PUBLIC_POWERED_BY_BADGE",
      siteData.features.poweredByBadge,
    ),
    cookieConsent: envEnum<"on" | "off">(
      "PUBLIC_COOKIE_CONSENT",
      siteData.features.cookieConsent as "on" | "off",
      ["on", "off"],
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
    poweredByTone: (siteChrome.poweredByTone === "white" ? "white" : "ink") as "ink" | "white",
    showBrandLogo: siteData.chrome.showBrandLogo,
    cookieBannerStyle: envEnum<"bar" | "card" | "terminal">(
      "PUBLIC_COOKIE_BANNER_STYLE",
      siteData.chrome.cookieBannerStyle as "bar" | "card" | "terminal",
      ["bar", "card", "terminal"],
    ),
    exemptPrefixes: siteChrome.exemptPrefixes ?? [],
  },

  nav: siteData.nav,
  publicRoutes: siteData.publicRoutes,

  blog: {
    // Build-time route aliases are generated from blog.config.mjs. Keep these
    // values tied to that source so runtime env overrides cannot point links at
    // paths Astro did not emit.
    basePath: blogConfig.basePath,
    title: blogConfig.title,
    contentDir: blogContentDir(),
    feedPath: blogConfig.feedPath ?? "/feed.xml",
  },

  analytics: {
    webVitalsEndpoint: env("PUBLIC_WEB_VITALS_ENDPOINT", ""),
  },

  integrations: siteDataExt.integrations ?? {},
  integrationConsentMode:
    siteDataExt.integrationConsentMode === "always" ||
    siteDataExt.integrationConsentMode === "external"
      ? siteDataExt.integrationConsentMode
      : "auto",

  contextrocket: {
    apiBaseUrl: contextRocketApiBase,
    handle: contextRocketHandle,
  },

  chat: {
    mode: envEnum<"demo" | "live">("PUBLIC_CR_CHAT_MODE", "demo", [
      "demo",
      "live",
    ]),
    agentUrl: contextRocketApiBase,
    handle: contextRocketHandle,
    apiKey: env("PUBLIC_CONTEXTROCKET_API_KEY", ""),
    fullscreen: envBool(
      "PUBLIC_CR_CHAT_FULLSCREEN",
      siteDataExt.chat?.fullscreen ?? true,
    ),
    fullscreenOnOpen: envBool(
      "PUBLIC_CR_CHAT_FULLSCREEN_ON_OPEN",
      siteDataExt.chat?.fullscreenOnOpen ?? false,
    ),
    fullscreenOnLoad: envBool(
      "PUBLIC_CR_CHAT_FULLSCREEN_ON_LOAD",
      siteDataExt.chat?.fullscreenOnLoad ?? false,
    ),
  },

  contactForm: {
    mode: envEnum<"demo" | "live">(
      "PUBLIC_CR_CONTACT_FORM_MODE",
      siteDataExt.contactForm?.mode ?? "demo",
      ["demo", "live"],
    ),
    handle: contextRocketHandle,
    apiBaseUrl: contextRocketApiBase,
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
