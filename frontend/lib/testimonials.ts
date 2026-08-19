/**
 * lib/testimonials.ts -- Testimonials seam: port + file-backed adapter.
 *
 * A single config-style JSON file (frontend/testimonials.config.json) is the
 * managed data source for customer testimonials. It sits alongside
 * site.config.ts / company.config.ts conceptually: fork owners edit the JSON,
 * never the component. Each testimonial carries per-locale `role`/`quote` text
 * inline plus non-localized identity (author, company, avatar) and metadata
 * (rating, featured, order, published, source provenance).
 *
 * SCHEMA.ORG MAPPING (see lib/testimonials-jsonld.ts):
 *   The stored fields map 1:1 onto schema.org Review / AggregateRating so the
 *   SAME resolved data drives both the visible section AND the JSON-LD markup:
 *     quote            -> Review.reviewBody
 *     author           -> Review.author.name (schema.org Person)
 *     rating           -> Review.reviewRating.ratingValue (and AggregateRating)
 *     source.capturedAt-> Review.datePublished
 *   The reviewed item (what the reviews are ABOUT) is configured via the
 *   optional top-level `itemReviewed` key (see ItemReviewedConfig). It defaults
 *   to { type: "Service", name: siteConfig.companyName }.
 *
 *   WHY "Service" (not Organization/LocalBusiness) BY DEFAULT: Google's
 *   structured-data policy IGNORES (and can penalize) self-serving review /
 *   aggregateRating markup placed on an Organization or LocalBusiness node.
 *   Product and Service are the compliant item types for review markup, so the
 *   base defaults to "Service" -- a fork selling a concrete product flips it to
 *   "Product". Do NOT default this to Organization to chase rich results.
 *
 * JSON SHAPE (frontend/testimonials.config.json):
 *   {
 *     "itemReviewed": { "type": "Service", "name": "" }, // optional; see below
 *     "testimonials": [
 *       {
 *         "id": "jane-doe",                     // stable key (required)
 *         "author": "Jane Doe",                  // name, not localized (required)
 *         "company": "Acme Inc",                 // not localized (optional)
 *         "avatar": "/testimonials/example.jpg", // path or omit (optional)
 *         "role":  { "en": "...", "es": "...", "de": "..." },   // localized (optional)
 *         "quote": { "en": "...", "es": "...", "de": "..." },   // localized (required)
 *         "rating": 5,                           // 1-5 (optional)
 *         "featured": false,                     // (optional)
 *         "order": 1,                            // display order (required)
 *         "published": true,                     // publish gate (optional, default true)
 *         "source": { "type": "linkedin", "url": "", "capturedAt": "2024-01-01" }
 *       }
 *     ]
 *   }
 *
 * RESOLVE CONTRACT (getTestimonials / resolveTestimonials):
 *   - Filters out entries where `published === false` (absent/true both pass).
 *   - Sorts ascending by `order` (stable for equal orders).
 *   - Resolves `role`/`quote` for the requested locale with an `en` fallback
 *     when the locale key is missing, returning FLAT resolved strings so the
 *     component stays i18n-agnostic.
 *   - Returns [] when there are no published items (the home wires "render
 *     nothing" off an empty result, so there is no layout shift).
 *
 * PORT / ADAPTER PATTERN (the point of this file):
 *   - `TestimonialsPort` is the interface. The marketing home and any future
 *     consumer depend ONLY on this port, never on the JSON file directly.
 *   - `FileTestimonialsAdapter` is the production file-backed implementation.
 *   - `resolveTestimonials` is the pure locale-resolution core, shared by any
 *     adapter and unit-tested without touching the filesystem.
 *   - A future ContextRocket feature can provide a DB/API-backed adapter that
 *     implements the SAME `TestimonialsPort` (fetch RawTestimonial[] from
 *     Postgres or an API, then hand them to `resolveTestimonials`) and swap it
 *     in at the call site WITHOUT touching the component. The component only
 *     ever sees resolved `Testimonial` objects.
 *
 * SERVER-SIDE ONLY: the file adapter imports the JSON at module scope, which is
 * fine in Server Components and at build time. The resolved output is plain
 * serializable data safe to pass to a Client Component.
 */

import rawConfig from "@/testimonials.config.json";
import { siteConfig } from "@/config/site.config";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The thing the testimonials are reviews OF, for schema.org Review markup.
 *
 * `type` MUST be a review-eligible schema.org type. Per Google's structured-data
 * policy, review / aggregateRating markup on Organization or LocalBusiness is
 * self-serving and ignored, so this is deliberately restricted to Product /
 * Service / Organization only for callers that knowingly opt in -- the DEFAULT
 * (see `getItemReviewed`) is "Service".
 */
export interface ItemReviewedConfig {
  /** schema.org @type of the reviewed item. Default "Service". */
  type: "Product" | "Service" | "Organization";
  /** Display name of the reviewed item. Empty -> siteConfig.companyName. */
  name: string;
}

/** Per-locale localized text map. `en` is the canonical fallback key. */
export interface LocalizedText {
  en: string;
  es?: string;
  de?: string;
  [locale: string]: string | undefined;
}

/** Provenance for a testimonial (where the quote came from). */
export interface TestimonialSource {
  /** Free-form source type, e.g. "linkedin", "email", "g2", "manual". */
  type: string;
  /** Optional link back to the original source. */
  url?: string;
  /** Optional ISO date (YYYY-MM-DD) the quote was captured. */
  capturedAt?: string;
}

/**
 * A raw testimonial as stored in the JSON (localized fields NOT yet resolved).
 * This is the shape a future DB/API adapter would also produce before handing
 * off to `resolveTestimonials`.
 */
export interface RawTestimonial {
  /** Stable key, unique per testimonial. */
  id: string;
  /** Author display name (not localized). */
  author: string;
  /** Company / affiliation (not localized). */
  company?: string;
  /** Optional avatar path (relative to /public) or absolute URL. */
  avatar?: string;
  /** Localized role/title. */
  role?: LocalizedText;
  /** Localized quote body. */
  quote: LocalizedText;
  /** Optional 1-5 star rating. */
  rating?: number;
  /** Optional "featured" flag for emphasis. */
  featured?: boolean;
  /** Display order (ascending). */
  order: number;
  /** Publish gate. Absent or true -> published; false -> hidden. */
  published?: boolean;
  /** Optional provenance. */
  source?: TestimonialSource;
}

/**
 * A testimonial with localized fields RESOLVED to flat strings for the current
 * locale. This is all the component ever sees, keeping it i18n-agnostic.
 */
export interface Testimonial {
  id: string;
  author: string;
  company?: string;
  avatar?: string;
  /** Resolved role for the requested locale (may be empty string). */
  role: string;
  /** Resolved quote for the requested locale. */
  quote: string;
  rating?: number;
  featured: boolean;
  order: number;
  source?: TestimonialSource;
}

/**
 * Port: the minimal interface consumers depend on. The file adapter is the
 * default; a future CR DB/API adapter implements the same shape.
 */
export interface TestimonialsPort {
  /**
   * Return published testimonials, sorted by `order` ascending, with `role`
   * and `quote` resolved to flat strings for `locale` (en fallback).
   */
  getTestimonials(locale: string): Testimonial[];
}

// ---------------------------------------------------------------------------
// Pure resolution core (shared by all adapters; no filesystem access)
// ---------------------------------------------------------------------------

/**
 * Resolve one localized text map to a flat string for `locale`, falling back
 * to `en` when the locale key is absent or empty. Returns "" when nothing is
 * available (never throws -- a missing optional field is not an error).
 */
function resolveLocalized(
  text: LocalizedText | undefined,
  locale: string,
): string {
  if (!text) return "";
  const forLocale = text[locale];
  if (forLocale && forLocale.trim()) return forLocale;
  return text.en ?? "";
}

/**
 * Pure core: filter published, sort by order, resolve localized fields.
 * Adapters (file / DB / API) all funnel their RawTestimonial[] through here so
 * the publish/sort/locale-resolve contract lives in exactly one place.
 */
export function resolveTestimonials(
  raw: RawTestimonial[],
  locale: string,
): Testimonial[] {
  return raw
    .filter((t) => t.published !== false)
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((t) => ({
      id: t.id,
      author: t.author,
      company: t.company,
      avatar: t.avatar,
      role: resolveLocalized(t.role, locale),
      quote: resolveLocalized(t.quote, locale),
      rating: t.rating,
      featured: t.featured ?? false,
      order: t.order,
      source: t.source,
    }));
}

// ---------------------------------------------------------------------------
// File adapter (production default)
// ---------------------------------------------------------------------------

interface TestimonialsConfigFile {
  testimonials: RawTestimonial[];
  itemReviewed?: Partial<ItemReviewedConfig>;
}

/**
 * Production TestimonialsPort: reads from testimonials.config.json.
 *
 * The JSON is imported at module scope (bundled at build time), so this adapter
 * does no runtime filesystem I/O. It accepts an injected raw array for tests.
 */
export class FileTestimonialsAdapter implements TestimonialsPort {
  private readonly raw: RawTestimonial[];

  constructor(raw?: RawTestimonial[]) {
    this.raw = raw ?? (rawConfig as TestimonialsConfigFile).testimonials ?? [];
  }

  getTestimonials(locale: string): Testimonial[] {
    return resolveTestimonials(this.raw, locale);
  }
}

/** Singleton file-backed adapter for production use. */
export const fileTestimonialsAdapter: TestimonialsPort =
  new FileTestimonialsAdapter();

/**
 * Convenience default: resolve published testimonials for `locale` via the
 * file-backed adapter. Consumers that want to swap in a DB/API adapter should
 * depend on `TestimonialsPort` instead of calling this directly.
 */
export function getTestimonials(locale: string): Testimonial[] {
  return fileTestimonialsAdapter.getTestimonials(locale);
}

/**
 * Resolve the reviewed-item config for JSON-LD Review markup.
 *
 * Reads the optional top-level `itemReviewed` key from testimonials.config.json
 * (a fork may also pass an explicit config for tests). Applies the compliant
 * defaults: `type: "Service"` (NOT Organization -- see ItemReviewedConfig) and
 * `name: siteConfig.companyName` when name is blank/absent. The returned object
 * is what `buildTestimonialsJsonLd` uses as the reviewed item.
 */
export function getItemReviewed(
  override?: Partial<ItemReviewedConfig>,
): ItemReviewedConfig {
  const configured =
    override ?? (rawConfig as TestimonialsConfigFile).itemReviewed ?? {};
  const name = configured.name?.trim() ? configured.name : siteConfig.companyName;
  return {
    type: configured.type ?? "Service",
    name,
  };
}
