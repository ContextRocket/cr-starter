/**
 * Structured data (JSON-LD) builders for the static starter.
 *
 * Generates schema.org Organization, WebSite, Person, Service, BlogPosting,
 * BreadcrumbList, and related entities from site.config and page inputs.
 * These are the signals ContextRocket's taxonomy reads when crawling a site.
 *
 * Ported from the Next public-site seam; adapted for Astro (no React scripts).
 */

import { siteConfig } from "@/config/site.config";

export type JsonLdNode = Record<string, unknown>;

/**
 * Canonical `@id` for the site's PRIMARY reviewed entity (Service or Product).
 * Shared by `buildServiceJsonLd` and `buildTestimonialsJsonLd` so reviews and
 * service description collapse into one schema.org entity.
 */
export function getPrimaryServiceId(
  type: "Product" | "Service" = "Service",
): string {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  return `${origin}/#primary-${type.toLowerCase()}`;
}

/**
 * Escape `<` so a JSON-LD script block cannot inject HTML tags.
 * Accepts a single node or an array (BaseLayout merges home + extras).
 */
export function serializeJsonLd(node: JsonLdNode | JsonLdNode[]): string {
  return JSON.stringify(node).replaceAll("<", "\\u003c");
}

function buildSameAs(): string[] {
  return [
    siteConfig.social.twitter,
    siteConfig.social.linkedin,
    siteConfig.social.github,
  ].filter(Boolean) as string[];
}

function buildOrganization(origin: string): JsonLdNode {
  const sameAs = buildSameAs();
  const contactEmail = siteConfig.contactEmail.trim();
  const logoPath = siteConfig.assets.logo || siteConfig.assets.icon512;

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: siteConfig.companyName,
    legalName: siteConfig.legalName,
    url: origin,
  };

  if (logoPath) {
    node.logo = {
      "@type": "ImageObject",
      url: logoPath.startsWith("http") ? logoPath : `${origin}${logoPath}`,
    };
  }

  if (sameAs.length > 0) {
    node.sameAs = sameAs;
  }

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

/** Organization + WebSite nodes for the public site home. */
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
      description: siteConfig.description,
    },
  ];
}

/** Minimal FAQ shape (avoids a hard dependency on a faq module). */
export interface FaqEntry {
  question: string;
  answerMarkdown: string;
}

/** FAQPage JSON-LD for a FAQ surface. */
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
        text: stripMarkdown(entry.answerMarkdown),
      },
    })),
  };
}

export interface PersonJsonLdInput {
  name: string;
  jobTitle: string;
  description: string;
  imageUrl: string;
  sameAs: string[];
  /** Optional expertise list; omitted from JSON-LD when empty/undefined. */
  knowsAbout?: string[];
  /**
   * Absolute page URL for the person. Defaults to the site origin (home),
   * which fits personal-brand homes; pass a dedicated about URL when needed.
   */
  url?: string;
}

/** Person JSON-LD (about / personal-brand home). */
export function buildPersonJsonLd(input: PersonJsonLdInput): JsonLdNode {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const sameAs = input.sameAs.filter(Boolean);
  const knowsAbout = (input.knowsAbout ?? []).filter(Boolean);

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${origin}/#person-${slugify(input.name)}`,
    name: input.name,
    jobTitle: input.jobTitle,
    description: input.description,
    image: input.imageUrl.startsWith("http")
      ? input.imageUrl
      : `${origin}${input.imageUrl.startsWith("/") ? "" : "/"}${input.imageUrl}`,
    url: input.url ?? origin,
    worksFor: {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: siteConfig.companyName,
      url: origin,
    },
  };

  if (sameAs.length > 0) {
    node.sameAs = sameAs;
  }
  if (knowsAbout.length > 0) {
    node.knowsAbout = knowsAbout;
  }

  return node;
}

/** BreadcrumbList for a non-home indexable page. */
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

export interface BlogPostingJsonLdInput {
  title: string;
  description: string;
  /** Absolute canonical URL of the post (locale-prefixed when multi-locale). */
  url: string;
  /** ISO date string (YYYY-MM-DD). */
  datePublished: string;
  /** ISO date string; defaults to `datePublished` when omitted. */
  dateModified?: string;
  /** Author display name. */
  authorName: string;
  /** Absolute or root-relative hero image URL; falls back to the site logo. */
  imageUrl?: string;
}

/** BlogPosting JSON-LD for a single post. */
export function buildBlogPostingJsonLd(
  input: BlogPostingJsonLdInput,
): JsonLdNode {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const logoPath = siteConfig.assets.logo || siteConfig.assets.icon512 || "";
  const imageUrl = input.imageUrl
    ? input.imageUrl.startsWith("http")
      ? input.imageUrl
      : `${origin}${input.imageUrl.startsWith("/") ? "" : "/"}${input.imageUrl}`
    : logoPath
      ? logoPath.startsWith("http")
        ? logoPath
        : `${origin}${logoPath}`
      : undefined;

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${input.url}#article`,
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    url: input.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    publisher: {
      "@id": `${origin}/#organization`,
    },
  };

  if (imageUrl) {
    node.image = imageUrl;
  }

  return node;
}

export interface SoftwareApplicationJsonLdInput {
  name?: string;
  description?: string;
  offers?: JsonLdNode;
}

/** SoftwareApplication helper for product/pricing forks. */
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

export interface PodcastEpisodeInput {
  name: string;
  url: string;
  datePublished?: string;
  description?: string;
  duration?: string;
  audioUrl?: string;
}

export interface PodcastSeriesInput {
  name: string;
  description?: string;
  url: string;
  webFeedUrl?: string;
  imageUrl?: string;
  sameAs?: string[];
}

/** PodcastSeries + episodes for a show page. */
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
        epNode.associatedMedia = audio;
        epNode.audio = audio;
      }
      return epNode;
    });
  }

  return node;
}

export interface OfferInput {
  price: number | string;
  priceCurrency: string;
  availability?: string;
  url?: string;
  name?: string;
}

export interface ServiceJsonLdInput {
  type?: "Service" | "Product";
  name: string;
  description?: string;
  url?: string;
  areaServed?: string;
  offers?: OfferInput[];
}

/** Service (or Product) JSON-LD; shares `@id` with testimonials reviews. */
export function buildServiceJsonLd(
  service: ServiceJsonLdInput | null | undefined,
): JsonLdNode | null {
  if (!service || !service.name) return null;

  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const type = service.type ?? "Service";

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": type,
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

export interface HowToStepInput {
  name: string;
  text: string;
  imageUrl?: string;
  url?: string;
}

export interface HowToJsonLdInput {
  name: string;
  description?: string;
  steps: HowToStepInput[];
}

/** HowTo JSON-LD for sequenced "how it works" sections. */
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\n/g, " ")
    .trim();
}
