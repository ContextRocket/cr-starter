/**
 * site.config.ts -- single source of identity for the static starter.
 *
 * Defaults come from site.json. Optional PUBLIC_* env vars override toggles
 * and ContextRocket connection settings. The site builds with no .env file.
 */

import siteData from "../../config/site.json";
import {
  blogConfig,
  blogContentDir,
  blogTopicsDir,
} from "../../blog.config.mjs";
import type { SiteIntegrationConfig } from "@/lib/integrations";
import { shouldShowConsentBanner } from "@/lib/consent-config";

type CookieConsentCategory = "necessary" | "functional" | "analytics" | "marketing";
type CookieConsentCopy = {
  title?: string;
  body?: string;
  manage?: string;
  manageFooter?: string;
  accept?: string;
  decline?: string;
  preferencesDescription?: string;
  save?: string;
  categories?: Partial<
    Record<
      CookieConsentCategory,
      { label?: string; description?: string; alwaysActiveLabel?: string }
    >
  >;
};

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
  company: typeof siteData.company & { legalName?: string };
  assets: typeof siteData.assets & {
    wordmarkDark?: string;
    logoDark?: string;
  };
  features: typeof siteData.features & {
    gallery?: boolean;
    attribution?: boolean;
    testimonials?: boolean;
    topics?: boolean;
    cookieConsent?: "auto" | "on" | "off";
    cookieConsentCopy?: CookieConsentCopy;
  };
  defaultLocale?: string;
  contextrocket?: { handle?: string; subjectKind?: "company" | "person" };
  homeMetaDescription?: string;
  homeMetaTitle?: string;
  titleSeparator?: string;
  chat?: {
    widgetSrc?: string;
    agentIdentity?: "contextrocket" | "probe";
    agentAvatar?: string;
    launcherAvatar?: string;
    launcherAppearance?: "brand" | "portrait";
    launcherAvatarBackground?: string;
    agentAvatarStyle?: "circle" | "cutout";
    agentHeaderStartColor?: string;
    agentHeaderEndColor?: string;
    position?: "bottom-left" | "bottom-right";
    launcherColor?: string;
    suggestions?: string[];
    fullscreen?: boolean;
    fullscreenOnOpen?: boolean;
    fullscreenOnLoad?: boolean;
  };
  contactForm?: { mode?: "demo" | "live"; scriptSrc?: string };
  integrations?: Record<string, SiteIntegrationConfig>;
  integrationConsentMode?: "auto" | "always" | "external";
  gallery?: {
    manifestPath?: string;
    assetBaseUrl?: string;
    profileImageId?: string;
  };
};
const siteChrome = siteData.chrome as typeof siteData.chrome & {
  exemptPrefixes?: readonly string[];
  navBreakpoint?: "lg" | "xl";
  poweredByTone?: "ink" | "white";
};
type PublicRouteConfig = {
  key: string;
  path: string;
  feature?: string;
  indexable: boolean;
  includeInLlms?: boolean;
  canonicalPath?: string;
  priority?: number;
  changeFrequency?: string;
};
const contextRocketHandle = env(
  "PUBLIC_CONTEXTROCKET_HANDLE",
  siteDataExt.contextrocket?.handle ?? "",
);
const contextRocketApiBase = env(
  "PUBLIC_CR_AGENT_URL",
  "https://api.contextrocket.com",
).replace(/\/$/, "");
const contextRocketSubjectKind = envEnum<"company" | "person">(
  "PUBLIC_CONTEXTROCKET_SUBJECT_KIND",
  siteDataExt.contextrocket?.subjectKind ?? "company",
  ["company", "person"],
);
const integrations = siteDataExt.integrations ?? {};
const integrationConsentMode =
  siteDataExt.integrationConsentMode === "always" ||
  siteDataExt.integrationConsentMode === "external"
    ? siteDataExt.integrationConsentMode
    : "auto";
const cookieConsent = envEnum<"auto" | "on" | "off">(
  "PUBLIC_COOKIE_CONSENT",
  siteDataExt.features.cookieConsent ?? "auto",
  ["auto", "on", "off"],
);
const consentBanner = shouldShowConsentBanner(
  cookieConsent,
  integrationConsentMode,
  integrations,
);

export const siteConfig = {
  trailingSlash:
    (siteData as typeof siteData & { trailingSlash?: "always" | "never" })
      .trailingSlash ?? "always",
  companyName: env("PUBLIC_SITE_NAME", siteData.company.name),
  legalName: siteDataExt.company.legalName,
  tagline: siteData.company.tagline,
  description: siteData.company.description,
  siteUrl: env("PUBLIC_SITE_URL", siteData.company.siteUrl).replace(/\/$/, ""),
  contextRocketBrandAssetsUrl,
  contactEmail: env("PUBLIC_CONTACT_EMAIL", siteData.company.contactEmail),
  homeTitle: env("PUBLIC_HOME_TITLE", siteData.company.name),
  homeMetaDescription: env(
    "PUBLIC_HOME_META_DESCRIPTION",
    siteDataExt.homeMetaDescription ?? "",
  ),
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
    wordmarkDark:
      siteDataExt.assets.wordmarkDark ?? siteDataExt.assets.logoDark,
  },
  social: siteData.social,

  features: {
    blog: envBool("PUBLIC_BLOG_ENABLED", siteData.features.blog),
    chatFab: envBool("PUBLIC_CHAT_FAB_ENABLED", siteData.features.chatFab),
    gallery: envBool(
      "PUBLIC_GALLERY_ENABLED",
      siteDataExt.features.gallery ?? false,
    ),
    attribution: envBool(
      "PUBLIC_ATTRIBUTION_ENABLED",
      siteDataExt.features.attribution ?? false,
    ),
    testimonials: envBool(
      "PUBLIC_TESTIMONIALS_ENABLED",
      siteDataExt.features.testimonials ?? false,
    ),
    topics: siteDataExt.features.topics ?? false,
    languageSelector: envBool(
      "PUBLIC_LANGUAGE_SELECTOR_ENABLED",
      siteData.features.languageSelector,
    ),
    poweredByBadge: envBool(
      "PUBLIC_POWERED_BY_BADGE",
      siteData.features.poweredByBadge,
    ),
    cookieConsent,
    cookieConsentCopy: siteDataExt.features.cookieConsentCopy,
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
    navBreakpoint: (siteChrome.navBreakpoint === "xl" ? "xl" : "lg") as
      | "lg"
      | "xl",
    poweredByTone: (siteChrome.poweredByTone === "white" ? "white" : "ink") as
      "ink" | "white",
    showBrandLogo: siteData.chrome.showBrandLogo,
    cookieBannerStyle: envEnum<"dock" | "bar" | "card" | "terminal">(
      "PUBLIC_COOKIE_BANNER_STYLE",
      siteData.chrome.cookieBannerStyle as "dock" | "bar" | "card" | "terminal",
      ["dock", "bar", "card", "terminal"],
    ),
    exemptPrefixes: siteChrome.exemptPrefixes ?? [],
  },

  nav: siteData.nav,
  publicRoutes: siteData.publicRoutes as PublicRouteConfig[],

  gallery: {
    manifestPath: env(
      "GALLERY_MANIFEST_PATH",
      siteDataExt.gallery?.manifestPath ?? "content/gallery.json",
    ),
    assetBaseUrl: env(
      "PUBLIC_GALLERY_ASSET_BASE_URL",
      siteDataExt.gallery?.assetBaseUrl ?? "",
    ),
    profileImageId: siteDataExt.gallery?.profileImageId || undefined,
  },

  blog: {
    // Build-time route aliases are generated from blog.config.mjs. Keep these
    // values tied to that source so runtime env overrides cannot point links at
    // paths Astro did not emit.
    basePath: blogConfig.basePath,
    title: blogConfig.title,
    postTitleSuffix: blogConfig.postTitleSuffix,
    contentDir: blogContentDir(),
    topicsDir: blogTopicsDir(),
    feedPath: blogConfig.feedPath ?? "/feed.xml",
  },

  analytics: {
    webVitalsEndpoint: env("PUBLIC_WEB_VITALS_ENDPOINT", ""),
  },

  integrations: siteDataExt.integrations ?? {},
  integrationConsentMode,
  consentBanner,
  consentManaged:
    integrationConsentMode === "external" ||
    (integrationConsentMode === "auto" && consentBanner),

  contextrocket: {
    apiBaseUrl: contextRocketApiBase,
    handle: contextRocketHandle,
    subjectKind: contextRocketSubjectKind,
  },

  chat: {
    widgetSrc: env(
      "PUBLIC_CONTEXTROCKET_CHAT_WIDGET_URL",
      siteDataExt.chat?.widgetSrc ?? "/embed/widget.js",
    ),
    agentIdentity: envEnum<"contextrocket" | "probe">(
      "PUBLIC_CR_CHAT_AGENT_IDENTITY",
      siteDataExt.chat?.agentIdentity ?? "contextrocket",
      ["contextrocket", "probe"],
    ),
    agentAvatar: env("PUBLIC_CR_CHAT_AGENT_AVATAR", siteDataExt.chat?.agentAvatar ?? ""),
    launcherAvatar: env("PUBLIC_CR_CHAT_LAUNCHER_AVATAR", siteDataExt.chat?.launcherAvatar ?? ""),
    launcherAppearance: env("PUBLIC_CR_CHAT_LAUNCHER_APPEARANCE", siteDataExt.chat?.launcherAppearance ?? "brand"),
    launcherAvatarBackground: env("PUBLIC_CR_CHAT_LAUNCHER_AVATAR_BACKGROUND", siteDataExt.chat?.launcherAvatarBackground ?? ""),
    agentAvatarStyle: env("PUBLIC_CR_CHAT_AGENT_AVATAR_STYLE", siteDataExt.chat?.agentAvatarStyle ?? "circle"),
    agentHeaderStartColor: env("PUBLIC_CR_CHAT_AGENT_HEADER_START", siteDataExt.chat?.agentHeaderStartColor ?? ""),
    agentHeaderEndColor: env("PUBLIC_CR_CHAT_AGENT_HEADER_END", siteDataExt.chat?.agentHeaderEndColor ?? ""),
    position: envEnum<"bottom-left" | "bottom-right">(
      "PUBLIC_CR_CHAT_POSITION",
      siteDataExt.chat?.position ?? "bottom-right",
      ["bottom-left", "bottom-right"],
    ),
    launcherColor: env(
      "PUBLIC_CR_CHAT_LAUNCHER_COLOR",
      siteDataExt.chat?.launcherColor ?? "pink",
    ),
    mode: envEnum<"demo" | "live">("PUBLIC_CR_CHAT_MODE", "demo", [
      "demo",
      "live",
    ]),
    agentUrl: contextRocketApiBase,
    handle: contextRocketHandle,
    subjectKind: contextRocketSubjectKind,
    apiKey: env("PUBLIC_CONTEXTROCKET_API_KEY", ""),
    suggestions: siteDataExt.chat?.suggestions ?? [],
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
    scriptSrc: env(
      "PUBLIC_CONTEXTROCKET_CONTACT_FORM_SCRIPT_URL",
      siteDataExt.contactForm?.scriptSrc ?? "/embed/contact-form.js",
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
