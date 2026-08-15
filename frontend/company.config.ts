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

export interface CompanyConfig {
  hero?: HeroContent;
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
  hero: {
    headline: "Your value proposition in one line.", // PLACEHOLDER
    subhead:
      "A supporting sentence that explains who it is for and why it matters.", // PLACEHOLDER
    primaryCta: { label: "Get started", href: "/" }, // PLACEHOLDER
    secondaryCta: { label: "Learn more", href: "/blog" }, // PLACEHOLDER
  },
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
    heading: "Trusted by", // PLACEHOLDER
    items: [
      // PLACEHOLDER: add logo files to /public and list them here.
      { src: "/logos/example.svg", alt: "Example" },
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
