/**
 * site.config.ts -- single source of identity for the starter site.
 *
 * Every value here has a sensible default, so the site runs out of the box
 * with no env file. Defaults come from two places:
 *   - site.json for content (nav, features, company info)
 *   - hardcoded fallbacks below for toggles, theme, and endpoints
 *
 * `.env.local` (copy from config/.env.example) is an OPTIONAL override layer.
 * Any env var set there wins over the defaults here.
 *
 * Basic users: edit site.json (content) and, if needed, .env.local (toggles).
 * Advanced users: override anything here.
 */

import siteData from "./site.json";
import { blogConfig } from "../blog.config.mjs";

// Helper to read env vars with defaults
function env(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

function envBool(key: string, fallback: boolean = true): boolean {
  const val = process.env[key];
  if (val === undefined) return fallback;
  return val === "true" || val === "1";
}

function envEnum<T extends string>(key: string, fallback: T, options: T[]): T {
  const val = process.env[key] as T | undefined;
  if (val && options.includes(val)) return val;
  return fallback;
}

// Keep the seam migration-friendly for forks that have not added the gallery
// block to site.json yet. The starter ships the complete shape, but a fork
// should be able to pull the shared code before it updates its own content.
const siteFeatures = siteData.features as typeof siteData.features & {
  gallery?: boolean;
};
const siteGallery = siteData as typeof siteData & {
  defaultLocale?: string;
  gallery?: {
    manifestPath?: string;
    assetBaseUrl?: string;
    profileImageId?: string;
  };
  chat?: { fullscreenOnLoad?: boolean };
};
const siteChrome = siteData.chrome as typeof siteData.chrome & {
  exemptPrefixes?: readonly string[];
};

// ── Identity (from site.json + .env) ─────────────────────────────────────────

export const siteConfig = {
  // Company identity -- override with .env or edit site.json
  companyName: env("NEXT_PUBLIC_SITE_NAME", siteData.company.name),
  legalName: siteData.company.legalName,
  tagline: siteData.company.tagline,
  description: siteData.company.description,
  siteUrl: env("NEXT_PUBLIC_SITE_URL", siteData.company.siteUrl),
  contactEmail: env("NEXT_PUBLIC_CONTACT_EMAIL", siteData.company.contactEmail),
  homeTitle: env("NEXT_PUBLIC_HOME_TITLE", siteData.company.name),
  verification: {
    google: env("NEXT_PUBLIC_GOOGLE_VERIFICATION", ""),
  },

  // Locale
  defaultLocale: env(
    "NEXT_PUBLIC_DEFAULT_LOCALE",
    siteGallery.defaultLocale ?? siteData.locales[0] ?? "en",
  ),
  locales: siteData.locales as readonly string[],

  // ── Theme ──────────────────────────────────────────────────────────────────
  // Single source of truth for the design tokens. `light`/`dark` map CSS
  // custom-property names to values; <ThemeStyle /> injects them into
  // :root / .dark so a fork re-themes by editing THIS object alone (no
  // globals.css edits). globals.css :root/.dark remain as the fallback for any
  // token omitted here.
  // ── Theme ──────────────────────────────────────────────────────────
  // Fork-owned data: the design tokens live in site.json under `theme`
  // (light/dark CSS-variable maps + radius). <ThemeStyle /> injects them
  // into :root/.dark. Edit site.json to re-theme; never edit this file.
  theme: siteData.theme,

  // ── Assets ─────────────────────────────────────────────────────────────────
  // Fork-owned paths live beside the brand data in site.json. This keeps
  // replacing a logo or favicon a data-only change in a fork.
  assets: siteData.assets,

  // ── Social ─────────────────────────────────────────────────────────────────
  social: siteData.social,

  // ── Features (from .env) ───────────────────────────────────────────────────
  features: {
    blog: envBool("NEXT_PUBLIC_BLOG_ENABLED", siteData.features.blog),
    chatFab: envBool("NEXT_PUBLIC_CHAT_FAB_ENABLED", siteData.features.chatFab),
    gallery: envBool(
      "NEXT_PUBLIC_GALLERY_ENABLED",
      siteFeatures.gallery ?? false,
    ),
    languageSelector: envBool(
      "NEXT_PUBLIC_LANGUAGE_SELECTOR_ENABLED",
      siteData.features.languageSelector,
    ),
    impressum: envBool(
      "NEXT_PUBLIC_IMPRESSUM_ENABLED",
      siteData.features.impressum,
    ),
    attribution: envBool(
      "NEXT_PUBLIC_ATTRIBUTION_ENABLED",
      siteData.features.attribution,
    ),
    testimonials: envBool(
      "NEXT_PUBLIC_TESTIMONIALS_ENABLED",
      siteData.features.testimonials,
    ),
    poweredByBadge: envBool(
      "NEXT_PUBLIC_POWERED_BY_BADGE",
      siteData.features.poweredByBadge,
    ),
    cookieConsent: envEnum<"auto" | "on" | "off">(
      "NEXT_PUBLIC_COOKIE_CONSENT",
      siteData.features.cookieConsent as "auto" | "on" | "off",
      ["auto", "on", "off"],
    ),
  },

  // ── Chrome ─────────────────────────────────────────────────────────────────
  chrome: {
    header: envEnum<"marketing" | "minimal" | "none">(
      "NEXT_PUBLIC_HEADER_STYLE",
      siteData.chrome.header as "marketing" | "minimal" | "none",
      ["marketing", "minimal", "none"],
    ),
    footer: envEnum<"full" | "minimal" | "none">(
      "NEXT_PUBLIC_FOOTER_STYLE",
      siteData.chrome.footer as "full" | "minimal" | "none",
      ["full", "minimal", "none"],
    ),
    logoVariant: siteData.chrome.logoVariant as "icon" | "wordmark",
    showBrandLogo: siteData.chrome.showBrandLogo,
    showThemeToggle: siteData.chrome.showThemeToggle,
    defaultTheme: envEnum<"system" | "light" | "dark">(
      "NEXT_PUBLIC_DEFAULT_THEME",
      (siteData.chrome.defaultTheme ?? "system") as "system" | "light" | "dark",
      ["system", "light", "dark"],
    ),
    cookieBannerStyle: envEnum<"bar" | "card" | "terminal">(
      "NEXT_PUBLIC_COOKIE_BANNER_STYLE",
      siteData.chrome.cookieBannerStyle as "bar" | "card" | "terminal",
      ["bar", "card", "terminal"],
    ),
    exemptPrefixes: siteChrome.exemptPrefixes ?? ["/terminal-demo"],
  },

  // ── Data (from site.json) ──────────────────────────────────────────────────
  // Structural data only (nav links, stat values, legal fields). All
  // human-readable copy lives in i18n/messages/site/ and is resolved via t().
  nav: siteData.nav,
  stats: siteData.stats,
  legal: siteData.legal,

  // ── Paths ──────────────────────────────────────────────────────────────────
  paths: {
    home: "/",
    blog: "/blog",
    pricing: "/pricing",
    features: "/features",
    about: "/about",
    faq: "/faq",
    privacy: "/privacy",
    contact: "/contact",
    chat: "/chat",
    gallery: "/gallery",
  },

  // ── Gallery ───────────────────────────────────────────────────────────────
  // The manifest stores stable IDs and paths relative to public/. A fork can
  // point those same paths at a CDN later without changing its content model.
  gallery: {
    manifestPath: env(
      "GALLERY_MANIFEST_PATH",
      siteGallery.gallery?.manifestPath ?? "content/gallery.json",
    ),
    assetBaseUrl: env(
      "NEXT_PUBLIC_GALLERY_ASSET_BASE_URL",
      siteGallery.gallery?.assetBaseUrl ?? "",
    ),
    profileImageId: siteGallery.gallery?.profileImageId || undefined,
  },

  // ── Blog ───────────────────────────────────────────────────────────────────
  blog: {
    basePath: env("BLOG_BASE_PATH", blogConfig.basePath),
    title: env("BLOG_TITLE", blogConfig.title),
  },

  // ── Forms ──────────────────────────────────────────────────────────────────
  forms: {
    subscribe: {
      endpoint: env("SUBSCRIBE_ENDPOINT", ""),
      method: "POST" as const,
      meta: { source: "subscribe" },
    },
    waitlist: {
      endpoint: env("WAITLIST_ENDPOINT", ""),
      method: "POST" as const,
      meta: { source: "waitlist" },
    },
    contact: {
      endpoint: env("CONTACT_ENDPOINT", ""),
      method: "POST" as const,
      meta: { source: "contact" },
    },
  } as Record<
    string,
    {
      endpoint: string;
      method?: string;
      headers?: Record<string, string>;
      meta?: Record<string, string>;
    }
  >,

  // ── Analytics ──────────────────────────────────────────────────────────────
  analytics: {
    webVitalsEndpoint: env("NEXT_PUBLIC_WEB_VITALS_ENDPOINT", ""),
  },

  // ── Chat ───────────────────────────────────────────────────────────────────
  chat: {
    // EXAMPLE DATA: demo placeholders for the ChatFab showcase.
    // Replaced by real ContextRocket A2A agent data when connected.
    // Not i18n -- config data, not UI copy.
    icebreakers: {
      en: [
        {
          label: "What can you help me with?",
          message: "What can you help me with?",
        },
        {
          label: "Give me a quick overview",
          message:
            "Give me a quick overview of what you know about this topic.",
        },
        {
          label: "What are the key facts?",
          message: "What are the most important facts I should know?",
        },
      ],
      es: [
        {
          label: "¿En qué puedes ayudarme?",
          message: "¿En qué puedes ayudarme?",
        },
        {
          label: "Dame un resumen rápido",
          message: "Dame un resumen rápido de lo que sabes sobre este tema.",
        },
        {
          label: "¿Cuáles son los datos clave?",
          message: "¿Cuáles son los datos más importantes que debo conocer?",
        },
      ],
      de: [
        {
          label: "Womit kannst du mir helfen?",
          message: "Womit kannst du mir helfen?",
        },
        {
          label: "Gib mir einen kurzen Überblick",
          message:
            "Gib mir einen kurzen Überblick über das, was du zu diesem Thema weißt.",
        },
        {
          label: "Was sind die wichtigsten Fakten?",
          message: "Was sind die wichtigsten Fakten, die ich wissen sollte?",
        },
      ],
    } as Record<string, { label: string; message: string }[]>,
    /** Show the chat fullscreen immediately on page load when enabled by a fork. */
    fullscreenOnLoad: envBool(
      "NEXT_PUBLIC_CHAT_FULLSCREEN_ON_LOAD",
      siteGallery.chat?.fullscreenOnLoad ?? false,
    ),
    linkMode: "new-tab" as const,
    /** `demo` is the safe default so static exports work without an API. */
    mode: envEnum<"demo" | "live">("NEXT_PUBLIC_CR_CHAT_MODE", "demo", [
      "demo",
      "live",
    ]),
    agentUrl: env("NEXT_PUBLIC_CR_AGENT_URL", ""),
    handle: env("NEXT_PUBLIC_CONTEXTROCKET_HANDLE", ""),
    /** Website API key; never put a server-side secret here. */
    apiKey: env("NEXT_PUBLIC_CONTEXTROCKET_API_KEY", ""),
  },

  // ── Deployment ─────────────────────────────────────────────────────────────
  deployment: envBool("STATIC_EXPORT", false)
    ? ("static" as const)
    : ("server" as const),

  // ── AI Crawlers ────────────────────────────────────────────────────────────
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

export type FeaturesConfig = typeof siteConfig.features;

// Forms config
export type FormKey = "subscribe" | "waitlist" | "contact";
export type FormEndpoint = {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  meta?: Record<string, string>;
};
export const forms = siteConfig.forms;

// Analytics config
export const analytics = siteConfig.analytics;
