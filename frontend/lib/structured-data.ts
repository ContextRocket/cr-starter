/**
 * Structured data (JSON-LD) builders for the starter site.
 *
 * Generates schema.org Organization and WebSite entities from site.config.
 * These are the signals ContextRocket's taxonomy reads when crawling a site
 * to assess AI-readiness -- Organization JSON-LD with a contactPoint and
 * optional sameAs links is a high-value AEO signal.
 *
 * Usage: import `buildHomeJsonLd` in the home page Server Component and
 * render via `<StructuredDataScripts>`.
 *
 * Adapted from context-rocket/frontend/lib/public-structured-data.ts and
 * context-rocket/frontend/components/public/structured-data-scripts.tsx.
 */

import { siteConfig } from "@/site.config";

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
