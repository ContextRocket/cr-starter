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

// The blog surface (public URL segment + title) lives in `blog.config.mjs` — a
// dependency-free ESM module SHARED with `next.config.mjs` (which runs before
// the TS build and cannot import this file). A fork edits basePath/title there;
// `siteConfig.blog` re-exposes those values to app code, and `lib/blog-path.ts`
// is the typed accessor every emission point uses.
import { blogConfig } from "./blog.config.mjs";

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

export interface ThemeConfig {
  /** <body> background color. Uses CSS light-dark() in globals.css. */
  background: string;
  /** Default text color. */
  foreground: string;
  /** Card / surface background. */
  card: string;
  /** Card text color. */
  cardForeground: string;
  /**
   * Layer-1 generic design tokens. These mirror the globals.css :root contract
   * (see the DESIGN-TOKEN CONTRACT comment in app/globals.css) and are the
   * source of truth a derived product aliases from (e.g. --cr-pink:
   * var(--primary)). Runtime injection of siteConfig.theme into :root is a
   * tracked follow-up; today these names define the frozen contract.
   */
  /** Primary accent color (buttons, links, highlights). */
  primary: string;
  /** Text color on primary backgrounds. */
  primaryForeground: string;
  /** Primary hover state color. */
  primaryHover: string;
  /** Soft/tinted primary surface (badges, subtle fills). */
  primarySoft: string;
  /** Secondary surface/background color. */
  secondary: string;
  /** Text color on secondary backgrounds. */
  secondaryForeground: string;
  /** Secondary hover state color. */
  secondaryHover: string;
  /** Soft/tinted secondary surface. */
  secondarySoft: string;
  /** Tertiary surface/background color. */
  tertiary: string;
  /** Text color on tertiary backgrounds. */
  tertiaryForeground: string;
  /** Tertiary hover state color. */
  tertiaryHover: string;
  /** Soft/tinted tertiary surface. */
  tertiarySoft: string;
  /** Muted/section background. */
  muted: string;
  /** Muted text color (body, descriptions). */
  mutedForeground: string;
  /** Border color. Use rgba() for translucent borders on dark backgrounds. */
  border: string;
  /** Focus ring color. */
  ring: string;
  /** Border radius: sm, md, lg, xl, 2xl, 3xl or px unit. */
  radius: string;
}

/**
 * Internal link-target map.
 *
 * Next.js routes are file-based, so this does NOT create or move route files.
 * It governs where internal LINKS point (nav items, "view all" hrefs, CTA
 * targets), letting a fork remap a link -- e.g. point "blog" at a different
 * path or an external URL -- without editing component code.
 *
 * Every field is REQUIRED so callers get a total, typo-safe map; the siteConfig
 * object supplies sensible defaults, so a fork only overrides the keys that
 * differ. Values are same-origin paths (leading "/") or absolute URLs.
 */
export interface PathsConfig {
  /** Home / landing target. Default "/". */
  home: string;
  /** Blog index target. Default "/blog". */
  blog: string;
  /** Pricing page target. Default "/pricing". */
  pricing: string;
  /** Features page target. Default "/features". */
  features: string;
  /** About page target. Default "/about". */
  about: string;
  /** FAQ page target. Default "/faq". */
  faq: string;
  /** Privacy policy target. Default "/privacy". */
  privacy: string;
  /** Contact page target. Default "/contact". */
  contact: string;
  /** Sign-up / register target. Default "/auth/register". */
  signup: string;
  /** Login target. Default "/auth/login". */
  login: string;
}

/**
 * Site-chrome configuration — which header/footer STYLE a fork renders.
 *
 * The [locale] layout wraps every marketing/content page in SiteChrome, which
 * reads these variants and renders the matching header + footer. This lets a
 * fork pick a whole different chrome STYLE (e.g. a minimal personal-brand
 * header with no app links) WITHOUT editing the shared components.
 *
 * The actual nav/footer LINKS are content and live in company.config.ts
 * (`nav` / `footerLinks`), so a fork controls both style (here) and links
 * (there) purely from config.
 */
export interface ChromeConfig {
  /**
   * Header STYLE.
   *   "marketing" — the full Navbar (logo + nav links + mobile menu). DEFAULT;
   *                 preserves cr-starter's existing behavior.
   *   "minimal"   — a compact personal-brand header (brand left, a small inline
   *                 link set right, no app chrome / CTA). See minimal-header.tsx.
   */
  header: "marketing" | "minimal";
  /**
   * Footer STYLE.
   *   "full"    — the current FooterSection (copyright + inline links). DEFAULT.
   *   "minimal" — the same compact row rendered in a personal-brand style
   *               (brand name + copyright + a few links). See footer-section.tsx.
   */
  footer: "full" | "minimal";
  /**
   * Whether the header renders the brand MARK (the logo image from
   * `assets.logo`). Default true preserves cr-starter's marketing header. Set
   * to false for a personal-brand fork whose `assets.logo` is only a PWA/app
   * icon (not a wordmark): the header then shows the brand NAME as text. Only
   * meaningful for the "minimal" header (the marketing Navbar always renders a
   * logo).
   */
  showBrandLogo?: boolean;
  /**
   * Whether the header renders the light/dark THEME TOGGLE (see
   * components/ui/theme-toggle.tsx). Default true (undefined is treated as
   * true) so cr-starter and every fork ship a working theme switch out of the
   * box. Set to false for a fork that wants a single fixed theme and no toggle
   * in the chrome. Honored by BOTH the marketing Navbar and the minimal header.
   */
  showThemeToggle?: boolean;
}

/**
 * Feature flags — toggle whole surfaces on/off for a fork.
 *
 * cr-starter is the reusable base: features default ON here so the reference
 * site shows the full product. A fork that does not want a given surface flips
 * the flag to `false`; the nav link disappears and the routes render an empty
 * state (the route files still exist — Next.js routing is file-based — but the
 * link into them is gated so the surface is effectively hidden).
 */
export interface FeaturesConfig {
  /**
   * Whether the conventional blog surface is enabled. When true, the Blog nav
   * link is shown and /blog renders the index + posts. Default true.
   */
  blog: boolean;
  /**
   * Whether the marketing-home testimonials section is enabled. When true (and
   * there is at least one published testimonial in testimonials.config.json),
   * the home renders <TestimonialsSection>. Default FALSE — the base ships
   * example testimonials to show the shape, but the flag keeps them from
   * rendering until a fork supplies real quotes and flips this on.
   */
  testimonials: boolean;
}

/** Names of the feature flags a config-driven nav link may gate on. */
export type FeatureFlagName = keyof FeaturesConfig;

/**
 * Blog surface configuration — the PUBLIC URL segment and display name of the
 * blog.
 *
 * The physical Next.js route stays at `app/[locale]/blog/` (routes are
 * file-system based). This config governs the public URL a fork publishes the
 * blog under and the human-facing title, so a fork can serve its blog at, e.g.,
 * `/the-creator-economy-for-b2b` titled "The Creator Economy for B2B" WITHOUT
 * renaming route files. Every place that EMITS a blog URL or label (nav link,
 * post links, index `<h1>`/`<title>`, canonical + hreflang, breadcrumbs,
 * sitemap, RSS) reads these values through `lib/blog-path.ts`.
 *
 * For a custom `basePath`, `next.config.mjs` emits a rewrite mapping the custom
 * public segment onto the physical `/blog` route (SSR / standard build only —
 * see the static-export caveat in `lib/blog-path.ts`). When `basePath` is the
 * default `/blog`, no rewrite is emitted and behavior is byte-for-byte
 * unchanged.
 */
export interface BlogConfig {
  /**
   * Public URL segment for the blog, leading "/" and NO trailing slash, e.g.
   * `/blog` (default) or `/the-creator-economy-for-b2b`. This is the segment
   * that appears in every emitted blog URL (after the `[locale]` prefix). It is
   * normalized by `lib/blog-path.ts` (leading slash added, trailing slash
   * stripped) so a fork can be lenient here.
   */
  basePath: string;
  /**
   * Human-facing blog name used for the index `<h1>` + `<title>`, breadcrumb
   * label, and RSS channel title, e.g. "Blog" (default) or "The Creator
   * Economy for B2B".
   */
  title: string;
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
   * Set to a single locale (e.g. ["en"]) to hide the LocaleSwitcher and
   * collapse multi-language infrastructure.
   */
  locales: readonly string[];
  /** Visual design tokens. The fork owner's only design touchpoint — edit
   * these to change colors, borders, and radius without touching globals.css. */
  theme: ThemeConfig;
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
   * Internal link targets. Next.js routes are file-based; this map governs
   * where LINKS point (nav, "view all", CTAs), letting a fork remap a link
   * (e.g. point "blog" at a different path or an external URL) without editing
   * components. Values are same-origin paths (leading "/") or absolute URLs.
   */
  paths: PathsConfig;
  /**
   * Feature flags. Toggle whole surfaces on/off for a fork. Defaults are ON
   * in cr-starter (the reference) so the full product is visible; a fork flips
   * a flag to false to hide that surface.
   */
  features: FeaturesConfig;
  /**
   * Blog surface: the public URL segment + display title. Defaults to `/blog`
   * + "Blog"; a fork overrides these to publish its blog under a custom path
   * and name without renaming route files. Read via `lib/blog-path.ts`.
   */
  blog: BlogConfig;
  /**
   * Site-chrome style. Which header/footer VARIANT SiteChrome renders. Defaults
   * preserve cr-starter's current chrome ({ header: "marketing", footer:
   * "full" }); a personal-brand fork flips these to "minimal". Nav/footer LINKS
   * are separate content in company.config.ts. A fork may also drop the header
   * brand MARK (logo image) via `chrome.showBrandLogo: false` so the header
   * shows the brand NAME as text (the personal-brand default look).
   */
  chrome: ChromeConfig;
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
  companyName: "ContextRocket Starter", // PLACEHOLDER -- replace with your public brand / product name
  legalName: "ContextRocket Starter GmbH", // PLACEHOLDER -- replace with your legal entity name
  tagline: "Build products on ContextRocket.", // PLACEHOLDER -- replace with your brand tagline (home page <h1>)
  // PLACEHOLDER -- replace with your one-sentence product description (meta tags + JSON-LD)
  description:
    "A Next.js starter for building AI-powered products on ContextRocket. Auth, dashboard shell, and a streaming chat agent included out of the box.",
  siteUrl: "https://example.com", // PLACEHOLDER -- replace with your production domain
  contactEmail: "hello@example.com", // PLACEHOLDER -- replace with your contact email
  defaultLocale: "en",
  locales: ["en", "es", "de"] as const,

  // ── Design tokens ───────────────────────────────────────────────────────
  // These flow into globals.css via :root {} variables. Change colors here
  // instead of editing globals.css directly — the fork's only design surface.
  // Use hsl() for colors to support light-dark() in globals.css, or hex for
  // simplicity. The default below is a neutral light theme.
  theme: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(0 0% 3.9%)",
    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(0 0% 3.9%)",
    primary: "hsl(0 0% 9%)",
    primaryForeground: "hsl(0 0% 98%)",
    // Layer-1 generic tokens — mirror the globals.css :root light values.
    // Runtime injection into :root is a tracked follow-up.
    primaryHover: "hsl(0 0% 20%)",
    primarySoft: "hsl(0 0% 9% / 0.08)",
    secondary: "hsl(0 0% 96.1%)",
    secondaryForeground: "hsl(0 0% 9%)",
    secondaryHover: "hsl(0 0% 92%)",
    secondarySoft: "hsl(0 0% 9% / 0.05)",
    tertiary: "hsl(0 0% 92%)",
    tertiaryForeground: "hsl(0 0% 9%)",
    tertiaryHover: "hsl(0 0% 86%)",
    tertiarySoft: "hsl(0 0% 9% / 0.05)",
    muted: "hsl(0 0% 96.1%)",
    mutedForeground: "hsl(0 0% 45.1%)",
    border: "hsl(0 0% 89.8%)",
    ring: "hsl(0 0% 3.9%)",
    radius: "0.5rem",
  },

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

  // ── Internal link targets ─────────────────────────────────────────────
  // Where internal LINKS point (nav, "view all", CTAs). Next.js routes are
  // file-based, so this does not create or move route files -- it only remaps
  // link hrefs. A fork overrides ONLY the keys that differ (e.g. a fork ported
  // from another site can point "blog" at its existing path or an external URL)
  // and inherits the defaults below for the rest. Values are same-origin paths
  // (leading "/") or absolute URLs. Resolve via lib/paths.ts `path(key)`.
  paths: {
    home: "/",
    blog: "/blog",
    pricing: "/pricing",
    features: "/features",
    about: "/about",
    faq: "/faq",
    privacy: "/privacy",
    contact: "/contact",
    signup: "/auth/register",
    login: "/auth/login",
  },

  // ── Feature flags ─────────────────────────────────────────────────────
  // Toggle whole surfaces on/off. cr-starter is the reusable base, so flags
  // default ON and the reference site shows the full product. A fork flips a
  // flag to false to hide that surface (the nav link disappears; the routes
  // render an empty state).
  features: {
    blog: true,
    // Testimonials ship OFF by default: the base includes generic example
    // testimonials (testimonials.config.json) to show the shape, but a fork
    // must supply real quotes and flip this to true before they render.
    testimonials: false,
  },

  // ── Blog surface (public URL segment + title) ─────────────────────────
  // cr-starter ships the conventional `/blog` + "Blog". A fork publishing its
  // blog under a custom path/name edits `blog.config.mjs` (the SHARED source —
  // `next.config.mjs` needs the same values to emit the custom-path rewrite and
  // cannot import this .ts file), e.g. basePath: "/the-creator-economy-for-b2b",
  // title: "The Creator Economy for B2B". Every emitted blog URL/label then
  // follows via lib/blog-path — no route files are renamed. When basePath is the
  // default "/blog", next.config emits no rewrite and behavior is unchanged. See
  // lib/blog-path.ts for the static-export caveat.
  blog: blogConfig,

  // ── Site chrome ───────────────────────────────────────────────────────
  // Which header/footer STYLE the site renders. cr-starter is the reference
  // company site, so it ships the full marketing chrome. A personal-brand fork
  // flips these to "minimal" for a compact header (brand + tiny link set, no app
  // chrome) and a compact footer. The nav/footer LINKS live in company.config.ts.
  chrome: {
    header: "marketing",
    footer: "full",
    showThemeToggle: true,
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
