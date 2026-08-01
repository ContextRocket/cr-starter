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
};
