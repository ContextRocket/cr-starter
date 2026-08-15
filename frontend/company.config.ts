/**
 * company.config.ts — OPTIONAL structured marketing content for
 * company / product forks.
 *
 * This is the ORG counterpart of `profile.config.ts` (the person SoT). A
 * company/marketing site is built from a handful of recurring sections —
 * hero, features, FAQ, testimonials, social-proof logos, stats, CTA — and
 * today each fork hardcodes that content inline in its home page. This file
 * centralizes it so the shared section components render from ONE typed
 * source, and copy lives in one editable place.
 *
 * BOUNDARY (same as profile.config / site.config):
 *   - site.config.ts     = brand identity (name, tagline, domain, theme, legal).
 *   - company.config.ts  = marketing CONTENT (the sections below).
 *   - i18n/messages/*     = UI chrome (buttons, nav, validation).
 * Marketing content is authored here (content, not chrome). A fork that ships
 * multiple locales can localize by keying its own content per locale; the
 * default single-locale marketing site authors copy directly.
 *
 * DESIGN INTENT: mirrors the shape a ContextRocket **company Context Graph**
 * would expose (offerings, proof, positioning). Keep field names aligned as
 * that lands, so a fork can later source these FROM the graph instead of a
 * static file.
 *
 * PERSONAL-BRAND FORKS: delete this file and use `profile.config.ts` instead.
 * Every section is optional — a fork renders only the sections it populates.
 */

import type { FeatureFlagName } from "./site.config";
import { blogBasePath } from "./lib/blog-path";

/** A call to action (button label + destination). */
export interface CallToAction {
  label: string;
  href: string;
}

/** Hero: the first screen — headline, supporting line, primary/secondary CTA. */
export interface HeroContent {
  headline: string;
  subhead?: string;
  primaryCta?: CallToAction;
  secondaryCta?: CallToAction;
  /** Optional hero image path under /public. */
  image?: { src: string; alt: string };
}

/** A feature / offering card. */
export interface FeatureItem {
  title: string;
  description: string;
  /** Optional lucide icon name or image path — renderer decides. */
  icon?: string;
}

/** A frequently-asked question. */
export interface FaqItem {
  question: string;
  answer: string;
}

/** A customer testimonial / quote. */
export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  /** Optional avatar path under /public. */
  avatar?: string;
}

/** A social-proof logo (e.g. "trusted by", integrations, press). */
export interface LogoItem {
  src: string;
  alt: string;
  href?: string;
}

/** A headline statistic. */
export interface StatItem {
  value: string;
  label: string;
}

/** A closing call-to-action band. */
export interface CtaBand {
  headline: string;
  subhead?: string;
  cta: CallToAction;
}

/** A single insight card in the HeroInsights panel (label + metric + support). */
export interface HeroInsightConfigItem {
  /** Small uppercase eyebrow (e.g. "Answer readiness"). */
  label: string;
  /** The headline metric/value (e.g. "92%"). */
  value: string;
  /** One supporting sentence. */
  description?: string;
  /** Accent color for the card icon box. Default "primary". */
  color?: "primary" | "blue" | "yellow" | "green" | "neutral";
}

/**
 * HeroInsights panel: a headline/subhead over a small grid of metric cards.
 * OPTIONAL — omit the whole block and the panel does not render. The shared
 * <HeroInsights layout="grid"> component renders these cards, token-styled and
 * scroll-revealed, with no hero image required. A fork edits copy here alone.
 */
export interface HeroInsightsSection {
  headline: string;
  subhead?: string;
  items: HeroInsightConfigItem[];
}

/** Features section: optional heading fields + the feature cards. */
export interface FeaturesSection {
  label?: string;
  title: string;
  subtitle?: string;
  items: FeatureItem[];
}

/** FAQ section: a heading + the questions. */
export interface FaqSectionContent {
  title: string;
  items: FaqItem[];
}

/** Testimonials section: optional label + a heading + the quotes. */
export interface TestimonialsSection {
  label?: string;
  title: string;
  items: Testimonial[];
}

/**
 * A top-of-page notification bar entry.
 *
 * Config references i18n KEYS (not literal copy) — the [locale] layout resolves
 * `messageKey` / `action.labelKey` with t() before passing resolved strings to
 * the NotificationBarStack, which is i18n-agnostic. `icon` is an optional lucide
 * icon NAME resolved to a component by the layout's curated icon map.
 */
export interface NotificationItemConfig {
  /** Stable id — also the localStorage dismissal key. */
  id: string;
  /** Visual tone: "info" | "warning" | "success" | "neutral". Default neutral. */
  tone?: "info" | "warning" | "success" | "neutral";
  /** Optional lucide icon name (e.g. "Info", "TriangleAlert", "CircleCheck"). */
  icon?: string;
  /** i18n key resolving to the bar message. */
  messageKey: string;
  /** Optional inline action link. `labelKey` is an i18n key; `href` a path/URL. */
  action?: { labelKey: string; href: string };
  /** Whether the bar shows a dismiss × button. Default true. */
  dismissible?: boolean;
}

/**
 * A site-chrome navigation link (header nav OR footer).
 *
 * Config references an i18n KEY (not literal copy) — the [locale] layout
 * resolves `labelKey` with t() and locale-prefixes `href` before passing
 * already-resolved links to the Navbar / footer. This keeps the shared chrome
 * components i18n-agnostic and, critically, means NO app/auth link (Dashboard,
 * Login, ...) is hardcoded in a shared component — a fork controls the entire
 * link set here, down to an empty list.
 *
 * `appOnly` marks a link into the app/auth surface (e.g. Dashboard). App links
 * are AUTH-GATED by the [locale] layout: they render ONLY for an authenticated
 * viewer, so the default/public render everywhere shows zero app links (no fork
 * ever shows "Dashboard" in its public nav). This fails closed — when auth
 * cannot be determined (static export) the viewer is treated as a guest and app
 * links stay hidden. `nav.showAppLinks: false` is an ADDITIONAL fork-level
 * opt-out that drops app links even for authenticated users.
 *
 * `featureFlag` names an optional siteConfig.features flag; the link is dropped
 * when that flag is off (e.g. the Blog link when the blog surface is disabled).
 */
export interface NavLinkConfig {
  /** i18n key resolving to the link label (e.g. "nav.blog"). */
  labelKey: string;
  /**
   * Same-origin path (leading "/") or absolute URL. Same-origin paths are
   * locale-prefixed by the layout; absolute URLs are passed through.
   */
  href: string;
  /**
   * Marks an app/auth link (e.g. Dashboard). Auth-gated by the [locale] layout:
   * shown ONLY to authenticated viewers (never guests / public / static), and
   * additionally hidden for everyone when `nav.showAppLinks` is false.
   * Default false.
   */
  appOnly?: boolean;
  /**
   * Marks a guest-only link (e.g. Login, Sign Up). Auth-gated by the [locale] layout:
   * shown ONLY to unauthenticated viewers, and additionally hidden for everyone
   * when `nav.showAppLinks` is false.
   * Default false.
   */
  guestOnly?: boolean;
  /**
   * Optional visual variant for the link.
   *   "default" — standard nav link.
   *   "primary" — styled as a primary CTA button.
   */
  variant?: "default" | "primary";
  /**
   * Optional siteConfig.features flag name. When set and that flag is false, the
   * link is omitted. Must match a key of siteConfig.features (only "blog" today).
   */
  featureFlag?: FeatureFlagName;
}

/**
 * Site-chrome navigation content.
 *
 * `links` is the header nav link set; `footerLinks` is the footer link set.
 * Both are pure config so a fork sets an arbitrary (or empty) list without
 * touching the shared Navbar / footer. `appOnly` links are auth-gated (shown
 * only to authenticated viewers); `showAppLinks` is an additional fork-level
 * opt-out that drops every `appOnly` link at once even for authenticated users
 * — cr-starter (which has a dashboard) keeps it true; a content/personal fork
 * sets it false so app chrome never appears.
 */
export interface NavigationConfig {
  /**
   * Fork-level opt-out for app/auth links (those with `appOnly: true`). When
   * false, they are hidden even for authenticated users. Auth-gating (guests
   * never see app links) applies regardless of this flag.
   */
  showAppLinks: boolean;
  /** Header navigation links, in order. */
  links: NavLinkConfig[];
  /** Footer links, in order. */
  footerLinks: NavLinkConfig[];
}

export interface CompanyConfig {
  /**
   * Site-chrome navigation (header + footer links). Pure config so a fork owns
   * the entire link set — including app-link gating — without editing shared
   * chrome components.
   */
  nav?: NavigationConfig;
  hero?: HeroContent;
  /**
   * HeroInsights metric panel. OPTIONAL — omit to hide it. The home renders it
   * under the hero when present; delete this block (or the whole key) to remove
   * it from a fork.
   */
  heroInsights?: HeroInsightsSection;
  /** Features / offerings, with a section heading. */
  features?: FeaturesSection;
  /** FAQ, with a section heading. */
  faq?: FaqSectionContent;
  /** Testimonials, with a section heading. */
  testimonials?: TestimonialsSection;
  /** Social-proof logos, with an optional heading. */
  logos?: { heading?: string; items: LogoItem[] };
  stats?: StatItem[];
  cta?: CtaBand;
  /**
   * Top-of-page notification bars (stacked, dismissible). EMPTY by default so
   * nothing renders out of the box — a fork turns bars on by adding entries.
   * The [locale] layout resolves the i18n keys and passes resolved strings to
   * NotificationBarStack.
   */
  notifications?: NotificationItemConfig[];
}

/**
 * Replace the placeholders below with your real marketing content, and delete
 * any section you do not use. The shared section components in
 * `components/sections/` render from this object.
 */
export const company: CompanyConfig = {
  // ── Site-chrome navigation (header + footer links) ────────────────────
  // Pure config: the shared Navbar/footer hardcode NO links. cr-starter has a
  // dashboard, so it ships a Dashboard link marked `appOnly` and keeps
  // `showAppLinks: true`. That Dashboard link is auth-gated by the layout: it
  // appears only for authenticated users, and is absent from the guest/public
  // nav everywhere. A content/personal fork sets `showAppLinks: false` (or
  // replaces `links` entirely, down to an empty list) and app chrome never
  // appears at all. Labels are i18n keys resolved by the [locale] layout.
  nav: {
    showAppLinks: true,
    links: [
      // Blog link is gated on the blog feature flag (default ON in cr-starter);
      // a fork that disables the blog drops it automatically. The href reads
      // siteConfig.blog.basePath so a custom blog segment is honored here too.
      { labelKey: "nav.blog", href: blogBasePath(), featureFlag: "blog" },
      // Dashboard is an app link — auth-gated (authenticated viewers only) and
      // additionally dropped when `showAppLinks` is false.
      { labelKey: "nav.dashboard", href: "/dashboard", appOnly: true },
      // Login/Sign Up are guest links — auth-gated (guests only). They also
      // respect the auth feature flag.
      { labelKey: "nav.login", href: "/auth/login", guestOnly: true, featureFlag: "auth" },
      { labelKey: "nav.signup", href: "/auth/register", guestOnly: true, featureFlag: "auth", variant: "primary" },
    ],
    footerLinks: [
      {
        labelKey: "footer.impressum",
        href: "/impressum",
        featureFlag: "impressum",
      },
      { labelKey: "footer.privacy", href: "/privacy" },
      { labelKey: "footer.faq", href: "/faq" },
      // Attribution link is gated on the attribution feature flag (default ON);
      // a fork that disables the credits page drops the link automatically so
      // there is never a dead footer link into a notFound() route.
      {
        labelKey: "footer.attribution",
        href: "/attribution",
        featureFlag: "attribution",
      },
    ],
  },
  hero: {
    headline: "Your value proposition in one line.", // PLACEHOLDER
    subhead:
      "A supporting sentence that explains who it is for and why it matters.", // PLACEHOLDER
    primaryCta: { label: "Get started", href: "/" }, // PLACEHOLDER
    secondaryCta: { label: "Learn more", href: "/blog" }, // PLACEHOLDER
  },
  // HeroInsights metric GRID panel (`<HeroInsights layout="grid">`) — an
  // OPTIONAL reusable section a fork can turn on by populating this block. The
  // starter home instead renders the animated image-overlay hero
  // (`<HeroInsights layout="overlay">`, see app/[locale]/page.tsx), so this
  // grid block is omitted by default. Add it back (headline/subhead + generic
  // {label, value, description} metric cards) on any page that wants the grid.
  features: {
    label: "Features", // PLACEHOLDER
    title: "Everything you need", // PLACEHOLDER
    subtitle: "A short line describing the section.", // PLACEHOLDER
    items: [
      { title: "Feature one", description: "What it does and why it helps." }, // PLACEHOLDER
      { title: "Feature two", description: "What it does and why it helps." }, // PLACEHOLDER
      { title: "Feature three", description: "What it does and why it helps." }, // PLACEHOLDER
    ],
  },
  faq: {
    title: "Frequently asked questions", // PLACEHOLDER
    items: [
      { question: "What is this?", answer: "A short, plain-language answer." }, // PLACEHOLDER
      { question: "Who is it for?", answer: "A short, plain-language answer." }, // PLACEHOLDER
    ],
  },
  testimonials: {
    label: "Testimonials", // PLACEHOLDER
    title: "What people say", // PLACEHOLDER
    items: [
      {
        quote: "A short, specific quote from a real customer.", // PLACEHOLDER
        author: "Full Name",
        role: "Title",
        company: "Company",
      },
    ],
  },
  logos: {
    // Answer-engine logo row. Framed as "answer-ready across the engines that
    // matter" — the honest promise of an articulation-first brand. Each logo
    // links to contextrocket.ai (opened in a new tab by the LogoCloud section).
    heading: "Answer-ready across the engines that matter",
    items: [
      {
        src: "/logos/ChatGPT_logo.png",
        alt: "ChatGPT",
        href: "https://contextrocket.ai",
      },
      {
        src: "/logos/Claude_AI_logo.png",
        alt: "Claude",
        href: "https://contextrocket.ai",
      },
      {
        src: "/logos/Google_Gemini_logo.png",
        alt: "Google Gemini",
        href: "https://contextrocket.ai",
      },
      {
        src: "/logos/Perplexity_AI_logo.png",
        alt: "Perplexity",
        href: "https://contextrocket.ai",
      },
      {
        src: "/logos/DeepSeek_logo.png",
        alt: "DeepSeek",
        href: "https://contextrocket.ai",
      },
    ],
  },
  stats: [
    { value: "10x", label: "Placeholder metric" }, // PLACEHOLDER
  ],
  cta: {
    headline: "Ready to get started?", // PLACEHOLDER
    subhead: "A short nudge toward the primary action.", // PLACEHOLDER
    cta: { label: "Get started", href: "/" }, // PLACEHOLDER
  },
  // Top-of-page notification bars. EMPTY by default (nothing renders). Turn on
  // by adding entries that reference i18n keys — the [locale] layout resolves
  // them. Example (add the keys under `notifications.*` in i18n/messages/*):
  //   notifications: [
  //     {
  //       id: "beta",
  //       tone: "info",
  //       icon: "Info",
  //       messageKey: "notifications.example.info.message",
  //       action: { labelKey: "notifications.example.info.action", href: "/blog" },
  //     },
  //   ],
  notifications: [],
};
