/**
 * lib/testimonials-jsonld.ts -- schema.org Review / AggregateRating JSON-LD.
 *
 * Builds the structured-data node for the marketing-home testimonials section
 * from the SAME resolved `Testimonial[]` the section renders (for the SAME
 * active locale). This is the load-bearing SEO-correctness invariant:
 *
 *   TEXT-MATCH INVARIANT — the JSON-LD text MUST byte-match the visible page
 *   text, or search engines penalize/ignore the markup. Because this builder
 *   consumes the already-resolved `Testimonial.quote` / `.author` (the exact
 *   strings `TestimonialsSection` prints), `reviewBody === rendered quote` and
 *   `author.name === rendered author` STRUCTURALLY — there is no second data
 *   path to drift from. Callers MUST pass `getTestimonials(locale)` for the
 *   locale being rendered; never build this from raw/localized config.
 *
 *   RATING-VISIBILITY INVARIANT — a `reviewRating` / `aggregateRating` is only
 *   emitted for testimonials whose `rating` is a number, and `TestimonialsSection`
 *   renders a star row for exactly that condition (`typeof item.rating ===
 *   "number"`). So every emitted rating is visibly rendered as stars on the
 *   page. If the section is ever changed to hide ratings, this builder's rating
 *   gate MUST be changed in lock-step (or callers must strip ratings before
 *   passing them in) so the markup never claims a rating the page does not show.
 *
 * Pure + unit-testable: returns a plain object (or null); the caller serializes
 * with JSON.stringify. No HTML, no filesystem, no locale logic here.
 *
 * schema.org mapping (see lib/testimonials.ts):
 *   Testimonial.quote             -> Review.reviewBody
 *   Testimonial.author            -> Review.author.name (Person)
 *   Testimonial.rating            -> Review.reviewRating.ratingValue + AggregateRating
 *   Testimonial.source.capturedAt -> Review.datePublished
 */

import type { ItemReviewedConfig, Testimonial } from "@/lib/testimonials";

/** schema.org best-rating for a 1-5 star scale (string per Google examples). */
const BEST_RATING = "5";

type JsonLdNode = Record<string, unknown>;

/** Round to a single decimal place (schema.org aggregateRating convention). */
function toOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Build the schema.org reviewed-item node with `review` + optional
 * `aggregateRating`, from the resolved testimonials the section renders.
 *
 * @param testimonials Resolved `Testimonial[]` for the active locale — the SAME
 *   array passed to `<TestimonialsSection items=... />`.
 * @param itemReviewed What the reviews are ABOUT (type + name); resolve via
 *   `getItemReviewed()` (defaults to { type: "Service", name: companyName }).
 * @returns A JSON-LD object, or `null` when there are no testimonials (so the
 *   caller emits no empty <script>).
 */
export function buildTestimonialsJsonLd(
  testimonials: Testimonial[],
  itemReviewed: ItemReviewedConfig,
): JsonLdNode | null {
  if (testimonials.length === 0) return null;

  const rated = testimonials.filter(
    (t): t is Testimonial & { rating: number } => typeof t.rating === "number",
  );

  const review = testimonials.map((t) => {
    const node: JsonLdNode = {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.author,
      },
      // Verbatim resolved quote — byte-matches the rendered <blockquote> text.
      reviewBody: t.quote,
    };
    // reviewRating only when a rating exists (and is thus rendered as stars).
    if (typeof t.rating === "number") {
      node.reviewRating = {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: BEST_RATING,
      };
    }
    // datePublished only when provenance carries a capture date.
    if (t.source?.capturedAt) {
      node.datePublished = t.source.capturedAt;
    }
    return node;
  });

  const node: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": itemReviewed.type,
    name: itemReviewed.name,
    review,
  };

  // aggregateRating only when at least one testimonial carries a numeric rating
  // (every counted rating is visibly rendered as stars on the page).
  if (rated.length > 0) {
    const sum = rated.reduce((acc, t) => acc + t.rating, 0);
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: toOneDecimal(sum / rated.length),
      reviewCount: rated.length,
      bestRating: BEST_RATING,
    };
  }

  return node;
}
