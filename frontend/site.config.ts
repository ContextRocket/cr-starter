/**
 * site.config.ts -- single source of identity for the starter site.
 *
 * This is the ONE file a fork owner edits to brand the site. Every page,
 * route, and SEO/AEO signal reads from this object. Grep for
 * `siteConfig` to see every consumer -- there should be no other place
 * where company name, tagline, URLs, or legal fields are hardcoded.
 *
 * HOW TO USE:
 *   1. Replace placeholder values below with your real brand information.
 *   2. Run `pnpm run build` to verify everything wires up cleanly.
 *   3. Replace the icon/favicon files in `public/` with your own assets.
 *   4. Fill in the legal section -- Impressum is legally required for
 *      DE/EU commercial websites (see /impressum page).
 *
 * TYPE SAFETY NOTE: This is intentionally a .ts file (not YAML) so the
 * TypeScript compiler catches typos and callers get autocomplete. The
 * exported `siteConfig` constant is the sole interface between brand
 * identity and every piece of code that uses it.
 */

/**
 * Icebreaker entry: a starter question shown in the empty chat state.
 * label is the chip text shown to the user; message is the text sent when
 * the chip is tapped (usually the same or a slightly expanded form).
 */
export interface IcebreakerEntry {
  label: string;
  message: string;
}

/**
 * Per-locale icebreaker configuration.
 * Keys are locale codes matching the supported locales in site.config.
 */
export type IcebreakersByLocale = Record<string, IcebreakerEntry[]>;

/**
 * Conversion-moment nudge configuration.
 * Controls when a guest->registered upgrade nudge appears.
 */
export interface ConversionMomentsConfig {
  /**
   * Number of substantive turns before the nudge appears.
   * A "substantive turn" is one completed assistant response.
   */
  turnThreshold: number;
  /**
   * Maximum number of nudges per session. Always 1 per the contract.
   */
  maxPerSession: 1;
}

/**
 * Chat-surface configuration. Read by chat components at render time.
 * Fork owners may override these defaults in the siteConfig object below.
 */
export interface ChatConfig {
  /**
   * Per-locale icebreaker chips shown in the empty state.
   * Each locale provides 3-5 {label, message} pairs.
   * When the current locale has no entry, falls back to "en".
   */
  icebreakers: IcebreakersByLocale;
  /**
   * Whether the FAB panel expand-to-fullscreen toggle is enabled.
   * Default: true. Set false to disable the expand button.
   */
  fullscreenEnabled: boolean;
  /**
   * How links inside message content and source sheets are opened.
   * "new-tab"  -- target="_blank" + rel="noopener noreferrer" (default, safe for embeds).
   * "preview"  -- in-panel sheet with title + "open in new tab" action.
   * The embed/widget context always forces "new-tab" regardless of this setting.
   */
  linkMode: "new-tab" | "preview";
  /**
   * Conversion-nudge settings. The nudge appears for unauthenticated/guest
   * users only and is dismissed at most once per session (sessionStorage).
   */
  conversionMoments: ConversionMomentsConfig;
  /**
   * Zero-config public demo slug (cr-starter-7lr).
   *
   * When set to a non-empty string AND no org key / bearer token is
   * configured, the FAB sends anon A2A requests with this slug in
   * `metadata.public_slug` so the ContextRocket backend resolves the
   * published org without credentials.
   *
   * The FAB header shows a small "Demo" badge in this mode.
   *
   * Leave as an empty string (the default) to disable demo mode.  Fork
   * owners who provide their own org credential (`NEXT_PUBLIC_CR_ORG_KEY`)
   * are NOT in demo mode even if this field is set -- the credential takes
   * precedence.
   */
  demoPublicSlug: string;
}

export interface SiteConfig {
  /** Public-facing company / product name used in headers, titles, JSON-LD. */
  companyName: string;
  /** Full legal entity name (used in Impressum and copyright notices). */
  legalName: string;
  /** Short brand tagline -- becomes the home page <h1>. */
  tagline: string;
  /** One-sentence product description for meta tags and JSON-LD. */
  description: string;
  /** Canonical production URL, no trailing slash. */
  siteUrl: string;
  /** Primary contact / support email surfaced in JSON-LD and the footer. */
  contactEmail: string;
  /**
   * Default locale code (ISO 639-1). Used as the initial locale in
   * LocaleProvider and as the <html lang> at SSR time.
   *
   * BOUNDARY NOTE: this is a site identity field, not i18n copy.
   *   site.config.ts = brand identity (name, tagline, description, legal, locale).
   *   i18n/messages/*.ts = UI copy (button labels, prompts, validation).
   * Components read brand identity from siteConfig; UI strings from t().
   */
  defaultLocale: string;
  /**
   * All locale codes supported by the UI. Must match the files in
   * i18n/messages/ and the SUPPORTED_LOCALES array in i18n/messages/index.ts.
   */
  locales: readonly string[];
  /** Paths to brand assets served from /public (relative to /public). */
  assets: {
    logo: string;
    faviconIco: string;
    appleTouchIcon: string;
    icon192: string;
    icon512: string;
    icon192Maskable: string;
    icon512Maskable: string;
  };
  social: {
    /** Optional -- leave as empty string to omit from JSON-LD sameAs. */
    twitter: string;
    linkedin: string;
    github: string;
  };
  /**
   * Whether the named AI-crawler tier (GPTBot, ClaudeBot, PerplexityBot,
   * Google-Extended, ...) may crawl the site. Default true: being readable
   * by answer engines is the point of the AEO surface. Set false to switch
   * the whole tier to Disallow in robots.txt.
   */
  allowAiCrawlers: boolean;
  /**
   * Legal / Impressum fields.
   *
   * Impressum is LEGALLY REQUIRED for commercial websites targeting
   * Germany or any EU country. Replace ALL placeholder values before
   * going live. An Impressum with placeholder text does not satisfy the
   * legal requirement.
   */
  legal: {
    /** Legal entity name (matches legalName above). */
    entity: string;
    /** Full registered address. */
    address: string;
    /** Company register entry, e.g. "HRB 12345, Amtsgericht Berlin". */
    register: string;
    /** VAT identification number, e.g. "DE123456789". */
    vat: string;
    /** Name of the legally responsible person (Verantwortlicher). */
    representedBy: string;
    /** Email address for privacy / GDPR contact. */
    privacyContact: string;
  };
  /** Chat surface configuration: icebreakers, FAB behaviors, link policy, nudges. */
  chat: ChatConfig;
}

/**
 * Replace every value below with your real brand data before launch.
 *
 * Fields marked PLACEHOLDER must be replaced -- search for "PLACEHOLDER"
 * to find them all.
 */
export const siteConfig: SiteConfig = {
  // ── Identity ─────────────────────────────────────────────────────────────
  companyName: "ContextRocket Starter",
  legalName: "ContextRocket Starter GmbH", // PLACEHOLDER -- replace with your legal entity name
  tagline: "Build products on ContextRocket.",
  description:
    "A Next.js starter for building AI-powered products on ContextRocket. Auth, dashboard shell, and a streaming chat agent included out of the box.",
  siteUrl: "https://example.com", // PLACEHOLDER -- replace with your production domain
  contactEmail: "hello@example.com", // PLACEHOLDER -- replace with your contact email
  defaultLocale: "en",
  locales: ["en", "es", "de"] as const,

  // ── Brand assets (files live in frontend/public/) ─────────────────────
  assets: {
    logo: "/icon-192.png",
    faviconIco: "/favicon.ico",
    appleTouchIcon: "/apple-icon-180x180.png",
    icon192: "/icon-192.png",
    icon512: "/icon-512.png",
    icon192Maskable: "/icon-192-maskable.png",
    icon512Maskable: "/icon-512-maskable.png",
  },

  // ── Social links (leave blank to omit from structured data) ──────────
  social: {
    twitter: "", // PLACEHOLDER e.g. "https://twitter.com/yourhandle"
    linkedin: "", // PLACEHOLDER e.g. "https://linkedin.com/company/your-co"
    github: "", // PLACEHOLDER e.g. "https://github.com/your-org"
  },

  // ── Crawling posture ──────────────────────────────────────────────────
  // AI answer engines may read this site (see app/robots.ts for the tier).
  allowAiCrawlers: true,

  // ── Legal / Impressum ─────────────────────────────────────────────────
  // Impressum is LEGALLY REQUIRED for commercial websites in Germany/EU.
  // Every field below is a PLACEHOLDER -- replace before going live.
  legal: {
    entity: "ContextRocket Starter GmbH", // PLACEHOLDER
    address: "Musterstraße 1, 10115 Berlin, Germany", // PLACEHOLDER
    register: "HRB 000000, Amtsgericht Berlin Charlottenburg", // PLACEHOLDER
    vat: "DE000000000", // PLACEHOLDER
    representedBy: "Jane Doe", // PLACEHOLDER -- name of managing director / CEO
    privacyContact: "privacy@example.com", // PLACEHOLDER
  },

  // ── Chat surface ──────────────────────────────────────────────────────
  chat: {
    // Icebreaker chips shown in the empty state, one row per locale.
    // These are generic starters; fork owners should replace with corpus-specific questions.
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
        {
          label: "Where do I get started?",
          message: "Where should I get started?",
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
        {
          label: "¿Por dónde empiezo?",
          message: "¿Por dónde debería empezar?",
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
        {
          label: "Wo fange ich an?",
          message: "Wo sollte ich anfangen?",
        },
      ],
    },
    // Expand-to-fullscreen toggle on the FAB panel. Default ON.
    fullscreenEnabled: true,
    // Default link-opening mode. "new-tab" is safe for embed/iframe contexts.
    linkMode: "new-tab",
    // Conversion-moment nudge settings.
    conversionMoments: {
      turnThreshold: 3,
      maxPerSession: 1,
    },
    // Public demo slug: leave empty to disable demo mode.
    // Set to a published org slug (e.g. "my-brand") to enable zero-config demo
    // when no org key is configured.  The FAB shows a "Demo" badge in this mode.
    demoPublicSlug: "",
  },
};
