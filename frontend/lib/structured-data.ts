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
 * Emitting an Organization node with a contactPoint and sameAs list is the
 * single highest-value JSON-LD signal for AI-answer-engine readiness. This
 * is the entity ContextRocket's crawler looks for first.
 */
function buildOrganization(origin: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: siteConfig.companyName,
    legalName: siteConfig.legalName,
    url: origin,
    logo: `${origin}${siteConfig.assets.logo}`,
    sameAs: buildSameAs(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.contactEmail,
      availableLanguage: [siteConfig.defaultLocale],
    },
  };
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
