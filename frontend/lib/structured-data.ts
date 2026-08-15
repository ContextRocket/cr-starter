/**
 * Structured data (JSON-LD) builders for the starter site.
 *
 * Generates schema.org Organization, WebSite, and FAQPage entities from
 * site.config and the FAQ seam. These are the signals ContextRocket's
 * taxonomy reads when crawling a site to assess AI-readiness.
 *
 * Usage: import `buildHomeJsonLd` in the home page Server Component and
 * render via `<StructuredDataScripts>`. Import `buildFaqJsonLd` in the
 * /faq page Server Component for FAQPage structured data.
 *
 * Adapted from context-rocket/frontend/lib/public-structured-data.ts and
 * context-rocket/frontend/components/public/structured-data-scripts.tsx.
 */

import { siteConfig } from "@/site.config";
import type { FaqEntry } from "@/lib/faq";

export type JsonLdNode = Record<string, unknown>;

/**
 * Canonical `@id` for the site's PRIMARY reviewed entity (its Service or
 * Product). This is the single reconciliation anchor so that a page's `Service`
 * node (`buildServiceJsonLd`) and the testimonials reviewed-item node
 * (`buildTestimonialsJsonLd`) collapse into ONE schema.org entity instead of two
 * name-matched siblings — the `Service`/`Product` description + provider and the
 * `aggregateRating`/`review` then attach to the same node.
 *
 * The id is derived purely from `siteConfig.siteUrl` (never from the display
 * name, so a copy edit never forks the entity) and is type-scoped so a fork that
 * reviews a concrete `Product` and a fork that reviews a `Service` get distinct
 * stable anchors. Both builders MUST route their `@id` through this helper.
 */
export function getPrimaryServiceId(
  type: "Product" | "Service" = "Service",
): string {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  return `${origin}/#primary-${type.toLowerCase()}`;
}

/**
 * Escape `<` characters so a JSON-LD script block cannot be used to inject
 * HTML tags when embedded in a page. This is the same serializer used by
 * Google's recommended JSON-LD injection pattern.
 */
export function serializeJsonLd(node: JsonLdNode): string {
  return JSON.stringify(node).replaceAll("<", "\\u003c");
}

/**
 * Collect non-empty social profile URLs for sameAs.
 * ContextRocket's taxonomy uses sameAs links to reconcile entity identity
 * across sources -- populate as many as available.
 */
function buildSameAs(): string[] {
  return [
    siteConfig.social.twitter,
    siteConfig.social.linkedin,
    siteConfig.social.github,
  ].filter(Boolean);
}

/**
 * Base Organization entity.
 *
 * Emitting an Organization node with a logo, contactPoint, and sameAs list is
 * the single highest-value JSON-LD signal for AI-answer-engine readiness. This
 * is the entity ContextRocket's crawler looks for first.
 *
 * Every emitted field maps to a real, configured value:
 *   - `logo` is an `ImageObject` pointing at the absolute `siteConfig.assets.logo`
 *     URL (schema.org accepts an ImageObject or a URL for `logo`; the ImageObject
 *     form lets crawlers reconcile the same asset across nodes).
 *   - `sameAs` is emitted ONLY when at least one social/profile URL is configured
 *     (empty array is omitted, never a fabricated placeholder).
 *   - `contactPoint` is emitted ONLY when a real contact email is configured.
 */
function buildOrganization(origin: string): JsonLdNode {
  const sameAs = buildSameAs();
  const contactEmail = siteConfig.contactEmail.trim();

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: siteConfig.companyName,
    legalName: siteConfig.legalName,
    url: origin,
    logo: {
      "@type": "ImageObject",
      url: `${origin}${siteConfig.assets.logo}`,
    },
  };

  // Emit sameAs only when a profile URL is actually configured.
  if (sameAs.length > 0) {
    node.sameAs = sameAs;
  }

  // Emit contactPoint only when a real contact email exists.
  if (contactEmail) {
    node.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: contactEmail,
      availableLanguage: [siteConfig.defaultLocale],
    };
  }

  return node;
}

/**
 * JSON-LD payload for the home page.
 *
 * Returns Organization + WebSite nodes so search and AI crawlers can
 * anchor all other content to a clear entity. Inject via
 * `<StructuredDataScripts items={buildHomeJsonLd()} />` in the home
 * page Server Component.
 */
export function buildHomeJsonLd(): JsonLdNode[] {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return [
    buildOrganization(origin),
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: siteConfig.companyName,
      url: origin,
      inLanguage: siteConfig.defaultLocale,
      publisher: {
        "@id": `${origin}/#organization`,
      },
    },
  ];
}

/**
 * JSON-LD FAQPage payload for the /faq page.
 *
 * Returns a single FAQPage node with one mainEntity per Q&A pair.
 * Answers are plain text (HTML stripped from Markdown for AEO safety).
 * Inject via `<StructuredDataScripts items={[buildFaqJsonLd(entries)]} />`
 * in the /faq page Server Component.
 *
 * @param entries Ordered list of FaqEntry objects from the FAQ seam.
 */
export function buildFaqJsonLd(entries: FaqEntry[]): JsonLdNode {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${origin}/faq`,
    url: `${origin}/faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        // Strip Markdown syntax for plain-text answers in JSON-LD.
        // This covers the most common cases (links, code fences, bold, italic).
        // Full Markdown parsing is unnecessary for structured-data plain-text.
        text: stripMarkdown(entry.answerMarkdown),
      },
    })),
  };
}

/**
 * Input for a Person JSON-LD node. Strings are already resolved to the
 * active locale by the caller (the about page resolves them via t() before
 * building the node), keeping this builder pure and locale-agnostic.
 */
export interface PersonJsonLdInput {
  name: string;
  jobTitle: string;
  description: string;
  imageUrl: string;
  sameAs: string[];
  knowsAbout: string[];
}

/**
 * JSON-LD Person payload for an about/founder/team page.
 *
 * Emits a schema.org Person node (name, jobTitle, description, image,
 * sameAs, knowsAbout) with worksFor anchored to the site Organization, so
 * crawlers reconcile the person to the same entity as the home page.
 * Inject via `<StructuredDataScripts items={[buildPersonJsonLd(input)]} />`.
 */
export function buildPersonJsonLd(input: PersonJsonLdInput): JsonLdNode {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${origin}/#person-${slugify(input.name)}`,
    name: input.name,
    jobTitle: input.jobTitle,
    description: input.description,
    // Absolute-ize a relative image path; keep an absolute http(s) URL as-is.
    image: input.imageUrl.startsWith("http")
      ? input.imageUrl
      : `${origin}${input.imageUrl}`,
    url: `${origin}/about`,
    sameAs: input.sameAs.filter(Boolean),
    knowsAbout: input.knowsAbout,
    worksFor: {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: siteConfig.companyName,
      url: origin,
    },
  };
}

/**
 * JSON-LD BreadcrumbList for a non-home indexable page.
 *
 * Emits a schema.org BreadcrumbList with one ListItem per crumb, numbered
 * 1..n. Callers pass already-resolved (locale-aware) names and absolute
 * URLs, so this builder stays pure and locale-agnostic. Inject via
 * `<StructuredDataScripts items={[buildBreadcrumbListJsonLd(items)]} />`.
 *
 * @param items Ordered crumb chain, e.g.
 *   `[{ name: "Home", url: origin }, { name: "Blog", url: `${origin}/en/blog` }]`.
 */
export function buildBreadcrumbListJsonLd(
  items: { name: string; url: string }[],
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Input for a BlogPosting JSON-LD node. All strings are already resolved
 * to absolute URLs / active-locale copy by the caller (the blog post page
 * resolves title/description and builds the locale-prefixed url), keeping
 * this builder pure and locale-agnostic.
 */
export interface BlogPostingJsonLdInput {
  title: string;
  description: string;
  /** Absolute canonical URL of the post (locale-prefixed). */
  url: string;
  /** ISO date string (YYYY-MM-DD). */
  datePublished: string;
  /** ISO date string; defaults to `datePublished` when omitted. */
  dateModified?: string;
  /** Author display name. */
  author: string;
  /** Absolute or root-relative hero image URL; falls back to the site logo. */
  imageUrl?: string;
}

/**
 * JSON-LD BlogPosting / Article payload for a single blog post.
 *
 * Anchors `publisher` (and, when no image is supplied, `image`) to the site
 * Organization node emitted on the home page (`${origin}/#organization`) so
 * crawlers reconcile the article to the same entity. `mainEntityOfPage`
 * points back at the canonical URL. Inject via
 * `<StructuredDataScripts items={[buildBlogPostingJsonLd(input)]} />`.
 */
export function buildBlogPostingJsonLd(input: BlogPostingJsonLdInput): JsonLdNode {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const imageUrl = input.imageUrl
    ? input.imageUrl.startsWith("http")
      ? input.imageUrl
      : `${origin}${input.imageUrl.startsWith("/") ? "" : "/"}${input.imageUrl}`
    : `${origin}${siteConfig.assets.logo}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${input.url}#article`,
    headline: input.title,
    description: input.description,
    image: imageUrl,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    url: input.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    author: {
      "@type": "Person",
      name: input.author,
    },
    publisher: {
      "@id": `${origin}/#organization`,
    },
  };
}

/**
 * Input for a SoftwareApplication JSON-LD node. Every field is optional so a
 * fork with pricing can pass its product name / description / offers while
 * the generic starter falls back to `siteConfig`.
 */
export interface SoftwareApplicationJsonLdInput {
  /** Product name; defaults to `siteConfig.companyName`. */
  name?: string;
  /** Product description; defaults to `siteConfig.description`. */
  description?: string;
  /**
   * schema.org Offer / AggregateOffer node describing pricing. Passed through
   * verbatim so a fork can shape it (single Offer, AggregateOffer with tiers,
   * etc.). Omitted entirely when not supplied.
   */
  offers?: JsonLdNode;
}

/**
 * JSON-LD SoftwareApplication payload for a product landing page.
 *
 * NOTE: the generic starter ships no product / pricing page, so nothing wires
 * this today. It is exported as an available helper so a fork that adds a
 * pricing page can emit a SoftwareApplication node (with its `offers`) in one
 * line, anchored to the site Organization as publisher. Inject via
 * `<StructuredDataScripts items={[buildSoftwareApplicationJsonLd({ offers })]} />`.
 */
export function buildSoftwareApplicationJsonLd(
  input: SoftwareApplicationJsonLdInput = {},
): JsonLdNode {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${origin}/#software`,
    name: input.name ?? siteConfig.companyName,
    url: origin,
    description: input.description ?? siteConfig.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    publisher: {
      "@id": `${origin}/#organization`,
    },
    ...(input.offers ? { offers: input.offers } : {}),
  };
}

/**
 * Input for a single podcast episode. All strings are already resolved by the
 * caller; the builder never fabricates a value — every optional field is
 * emitted only when supplied, so the JSON-LD matches real, visible content.
 */
export interface PodcastEpisodeInput {
  /** Episode title. */
  name: string;
  /** Absolute canonical URL of the episode page. */
  url: string;
  /** ISO 8601 date (e.g. "2026-01-15") — omitted when unknown. */
  datePublished?: string;
  /** Plain-text episode description — omitted when absent. */
  description?: string;
  /** ISO 8601 duration (e.g. "PT42M13S") — omitted when unknown. */
  duration?: string;
  /** Direct audio file URL; emitted as an AudioObject when supplied. */
  audioUrl?: string;
}

/**
 * Input for a podcast series (show) plus its episodes. Generic content shape —
 * a fork (e.g. cr-kleos) wires this to its real episode data.
 */
export interface PodcastSeriesInput {
  /** Show title. */
  name: string;
  /** Show description — omitted when absent. */
  description?: string;
  /** Absolute canonical URL of the show/index page. */
  url: string;
  /** RSS feed URL — emitted as schema.org `webFeed` when supplied. */
  webFeedUrl?: string;
  /** Cover-art image URL (absolute or root-relative) — omitted when absent. */
  imageUrl?: string;
  /** Directory/profile URLs (Spotify, Apple, ...) for `sameAs` — omitted when empty. */
  sameAs?: string[];
}

/**
 * JSON-LD PodcastSeries payload for a podcast show page.
 *
 * Emits a schema.org `PodcastSeries` node with one `PodcastEpisode` per episode
 * (each carrying an `AudioObject` when an audio URL is supplied and a
 * `partOfSeries` back-reference to the show `@id`). `publisher` anchors to the
 * site Organization so crawlers reconcile the show to the same entity.
 *
 * NOTE: Google retired its dedicated podcast rich result, but `PodcastSeries` /
 * `PodcastEpisode` remain valid schema.org that answer engines and other
 * consumers read — emitting it is exactly the AI-readiness signal this library
 * exists to produce.
 *
 * Generic + pure: takes already-resolved `{ series, episodes }` data, returns a
 * plain object or `null` when there is no series (so the caller emits no empty
 * <script>). No hardcoded content.
 *
 * @param series Resolved show metadata.
 * @param episodes Resolved episode list (may be empty — the series still emits).
 */
export function buildPodcastSeriesJsonLd(
  series: PodcastSeriesInput | null | undefined,
  episodes: PodcastEpisodeInput[] = [],
): JsonLdNode | null {
  if (!series) return null;

  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const seriesId = `${series.url}#podcast-series`;

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "@id": seriesId,
    name: series.name,
    url: series.url,
    publisher: {
      "@id": `${origin}/#organization`,
    },
  };

  if (series.description) node.description = series.description;
  if (series.webFeedUrl) node.webFeed = series.webFeedUrl;
  if (series.imageUrl) {
    node.image = series.imageUrl.startsWith("http")
      ? series.imageUrl
      : `${origin}${series.imageUrl.startsWith("/") ? "" : "/"}${series.imageUrl}`;
  }
  const sameAs = (series.sameAs ?? []).filter(Boolean);
  if (sameAs.length > 0) node.sameAs = sameAs;

  if (episodes.length > 0) {
    node.episode = episodes.map((ep) => {
      const epNode: JsonLdNode = {
        "@type": "PodcastEpisode",
        name: ep.name,
        url: ep.url,
        partOfSeries: {
          "@type": "PodcastSeries",
          "@id": seriesId,
        },
      };
      if (ep.datePublished) epNode.datePublished = ep.datePublished;
      if (ep.description) epNode.description = ep.description;
      if (ep.duration) epNode.duration = ep.duration;
      if (ep.audioUrl) {
        const audio: JsonLdNode = {
          "@type": "AudioObject",
          contentUrl: ep.audioUrl,
        };
        if (ep.duration) audio.duration = ep.duration;
        // `associatedMedia` is the schema.org property; `audio` is a common
        // alias consumers read — emit both so the media is discoverable.
        epNode.associatedMedia = audio;
        epNode.audio = audio;
      }
      return epNode;
    });
  }

  return node;
}

/** A single price offer for a Service / Product node. */
export interface OfferInput {
  /** Numeric or string price (e.g. 49 or "49.00"). */
  price: number | string;
  /** ISO 4217 currency code (e.g. "USD", "EUR"). */
  priceCurrency: string;
  /** schema.org availability URL or token — omitted when absent. */
  availability?: string;
  /** URL where the offer can be purchased — omitted when absent. */
  url?: string;
  /** Offer name / tier label — omitted when absent. */
  name?: string;
}

/**
 * Input for a Service (or Product) node with optional pricing offers. Generic
 * content shape — a fork wires this to its real service/pricing content.
 */
export interface ServiceJsonLdInput {
  /** schema.org type; defaults to "Service". Use "Product" for goods. */
  type?: "Service" | "Product";
  /** Service/product name. */
  name: string;
  /** Description — omitted when absent. */
  description?: string;
  /** Absolute canonical URL of the service/pricing page — omitted when absent. */
  url?: string;
  /** Geographic area served (e.g. "Worldwide", "DE") — omitted when absent. */
  areaServed?: string;
  /** Pricing offers — omitted entirely when empty. */
  offers?: OfferInput[];
}

/**
 * JSON-LD Service (or Product) payload for a service / pricing page.
 *
 * Emits a schema.org `Service` (or `Product`) node with `provider` anchored to
 * the site Organization and optional `offers` (one `Offer` per tier). This also
 * gives the testimonials builder's `itemReviewed` a real, described entity to
 * point at (same `@id` reconciliation).
 *
 * Generic + pure: takes already-resolved data, returns a plain object or `null`
 * when there is no service (no fabricated fields). Every optional value is
 * emitted only when supplied.
 *
 * @param service Resolved service metadata + optional pricing offers.
 */
export function buildServiceJsonLd(
  service: ServiceJsonLdInput | null | undefined,
): JsonLdNode | null {
  if (!service || !service.name) return null;

  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const type = service.type ?? "Service";

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": type,
    // Canonical, name-independent id shared with the testimonials reviewed-item
    // node so Service/Product + aggregateRating/review collapse into one entity.
    "@id": getPrimaryServiceId(type),
    name: service.name,
    provider: {
      "@id": `${origin}/#organization`,
    },
  };

  if (service.description) node.description = service.description;
  if (service.url) node.url = service.url;
  if (service.areaServed) node.areaServed = service.areaServed;

  const offers = (service.offers ?? []).filter(Boolean);
  if (offers.length > 0) {
    node.offers = offers.map((offer) => {
      const offerNode: JsonLdNode = {
        "@type": "Offer",
        price: offer.price,
        priceCurrency: offer.priceCurrency,
      };
      if (offer.name) offerNode.name = offer.name;
      if (offer.availability) offerNode.availability = offer.availability;
      if (offer.url) offerNode.url = offer.url;
      return offerNode;
    });
  }

  return node;
}

/** A single step in a HowTo. */
export interface HowToStepInput {
  /** Step title. */
  name: string;
  /** Step body text (plain text). */
  text: string;
  /** Illustrative image URL — omitted when absent. */
  imageUrl?: string;
  /** Anchor/URL for this step — omitted when absent. */
  url?: string;
}

/** Input for a HowTo (a sequenced set of steps). Generic content shape. */
export interface HowToJsonLdInput {
  /** HowTo title (e.g. "How it works"). */
  name: string;
  /** Description — omitted when absent. */
  description?: string;
  /** Ordered steps — the HowTo is null when empty. */
  steps: HowToStepInput[];
}

/**
 * JSON-LD HowTo payload for a step/sequence section (e.g. a "how it works").
 *
 * Emits a schema.org `HowTo` node with one `HowToStep` per step (position-order
 * is the array order). Generic + pure: takes already-resolved steps, returns a
 * plain object or `null` when there is no name or no steps (no fabricated
 * content). Every optional per-step value is emitted only when supplied.
 *
 * @param howto Resolved HowTo metadata + ordered steps.
 */
export function buildHowToJsonLd(
  howto: HowToJsonLdInput | null | undefined,
): JsonLdNode | null {
  if (!howto || !howto.name || howto.steps.length === 0) return null;

  const origin = siteConfig.siteUrl.replace(/\/$/, "");

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${origin}/#howto-${slugify(howto.name)}`,
    name: howto.name,
    step: howto.steps.map((step, index) => {
      const stepNode: JsonLdNode = {
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
      };
      if (step.imageUrl) {
        stepNode.image = step.imageUrl.startsWith("http")
          ? step.imageUrl
          : `${origin}${step.imageUrl.startsWith("/") ? "" : "/"}${step.imageUrl}`;
      }
      if (step.url) stepNode.url = step.url;
      return stepNode;
    }),
  };

  if (howto.description) node.description = howto.description;

  return node;
}

/** Lowercase, hyphenate a name for use in a stable @id fragment. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Strip common Markdown syntax to produce a plain-text string suitable for
 * JSON-LD answer text. Language-agnostic; does not alter word content.
 *
 * Handles: code fences, inline code, links, bold, italic, headings, bullets.
 */
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "") // fenced code blocks
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1)) // inline code -> bare text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links -> link text only
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^\s*[-*+]\s+/gm, "") // list bullets
    .replace(/\n{2,}/g, " ") // collapse blank lines to spaces
    .replace(/\n/g, " ") // remaining newlines to spaces
    .trim();
}
