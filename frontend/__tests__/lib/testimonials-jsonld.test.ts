/**
 * Unit tests for lib/testimonials-jsonld.ts
 *
 * The builder is a pure function over the SAME resolved Testimonial[] the
 * section renders, so these tests lock the SEO-correctness invariants:
 *   - aggregateRating average (1 decimal) + reviewCount over rated items only
 *   - aggregateRating omitted when no testimonial carries a rating
 *   - reviewBody === the resolved quote (text-match invariant)
 *   - reviewRating omitted per-review when that testimonial has no rating
 *   - null on an empty testimonials array (no empty <script>)
 *   - itemReviewed @type + name honored
 *   - datePublished from source.capturedAt when present
 *   - a valid schema.org shape (@context + review array)
 */

import { buildTestimonialsJsonLd } from "@/lib/testimonials-jsonld";
import { buildServiceJsonLd, getPrimaryServiceId } from "@/lib/structured-data";
import { getItemReviewed, resolveTestimonials } from "@/lib/testimonials";
import type {
  ItemReviewedConfig,
  RawTestimonial,
  Testimonial,
} from "@/lib/testimonials";

const SERVICE: ItemReviewedConfig = { type: "Service", name: "Acme Service" };

function testimonial(overrides: Partial<Testimonial> = {}): Testimonial {
  return {
    id: "x",
    author: "Author X",
    role: "",
    quote: "A quote",
    featured: false,
    order: 1,
    ...overrides,
  };
}

function raw(overrides: Partial<RawTestimonial> = {}): RawTestimonial {
  return {
    id: "x",
    author: "Author X",
    order: 1,
    quote: { en: "English quote" },
    ...overrides,
  };
}

type Node = Record<string, unknown>;

describe("buildTestimonialsJsonLd -- null / empty", () => {
  it("returns null when there are no testimonials", () => {
    expect(buildTestimonialsJsonLd([], SERVICE)).toBeNull();
  });
});

describe("buildTestimonialsJsonLd -- schema.org shape", () => {
  it("emits @context, the itemReviewed @type, name, and a review array", () => {
    const node = buildTestimonialsJsonLd(
      [testimonial(), testimonial({ id: "y" })],
      SERVICE,
    ) as Node;
    expect(node["@context"]).toBe("https://schema.org");
    expect(node["@type"]).toBe("Service");
    expect(node.name).toBe("Acme Service");
    expect(Array.isArray(node.review)).toBe(true);
    expect((node.review as unknown[]).length).toBe(2);
  });

  it("honors a Product itemReviewed type + name", () => {
    const node = buildTestimonialsJsonLd([testimonial()], {
      type: "Product",
      name: "Widget Pro",
    }) as Node;
    expect(node["@type"]).toBe("Product");
    expect(node.name).toBe("Widget Pro");
  });
});

describe("buildTestimonialsJsonLd -- shared @id (entity collapse)", () => {
  it("stamps the canonical PRIMARY-service @id for a Service item", () => {
    const node = buildTestimonialsJsonLd([testimonial()], SERVICE) as Node;
    expect(node["@id"]).toBe(getPrimaryServiceId("Service"));
  });

  it("stamps the canonical PRIMARY-product @id for a Product item", () => {
    const node = buildTestimonialsJsonLd([testimonial()], {
      type: "Product",
      name: "Widget Pro",
    }) as Node;
    expect(node["@id"]).toBe(getPrimaryServiceId("Product"));
  });

  it("shares the EXACT @id with buildServiceJsonLd so they collapse to one entity", () => {
    // A fork (e.g. cr-kleos) that emits BOTH a Service node and testimonials
    // reviews for the same primary service: both nodes must carry the identical
    // @id so answer engines see ONE entity (Service + aggregateRating/review).
    const service = buildServiceJsonLd({ name: "Consulting" })!;
    const reviews = buildTestimonialsJsonLd([testimonial({ rating: 5 })], {
      type: "Service",
      name: "Consulting",
    }) as Node;
    expect(reviews["@id"]).toBe(service["@id"]);
    // The rating attaches to the same @id as the described Service.
    expect(reviews.aggregateRating).toBeDefined();
  });

  it("leaves Organization-typed review markup unscoped (own #organization anchor)", () => {
    const node = buildTestimonialsJsonLd([testimonial()], {
      type: "Organization",
      name: "Acme",
    }) as Node;
    expect(node["@id"]).toBeUndefined();
  });
});

describe("buildTestimonialsJsonLd -- text-match invariant", () => {
  it("reviewBody equals the RESOLVED quote the section renders", () => {
    // Resolve through the same core the section uses, then build JSON-LD from it.
    const resolved = resolveTestimonials(
      [raw({ quote: { en: "Rendered EN", de: "Gerendert DE" } })],
      "de",
    );
    const node = buildTestimonialsJsonLd(resolved, SERVICE) as Node;
    const review = (node.review as Node[])[0];
    expect(review.reviewBody).toBe("Gerendert DE");
    // And it byte-matches the string the section would print.
    expect(review.reviewBody).toBe(resolved[0].quote);
  });

  it("author.name equals the resolved author (Person node)", () => {
    const node = buildTestimonialsJsonLd(
      [testimonial({ author: "Jane Doe" })],
      SERVICE,
    ) as Node;
    const review = (node.review as Node[])[0];
    expect(review.author).toEqual({ "@type": "Person", name: "Jane Doe" });
  });
});

describe("buildTestimonialsJsonLd -- per-review rating gate", () => {
  it("emits reviewRating only when the testimonial has a rating", () => {
    const node = buildTestimonialsJsonLd(
      [testimonial({ id: "rated", rating: 4 }), testimonial({ id: "unrated" })],
      SERVICE,
    ) as Node;
    const [rated, unrated] = node.review as Node[];
    expect(rated.reviewRating).toEqual({
      "@type": "Rating",
      ratingValue: 4,
      bestRating: "5",
    });
    expect(unrated.reviewRating).toBeUndefined();
  });
});

describe("buildTestimonialsJsonLd -- datePublished", () => {
  it("maps source.capturedAt to datePublished when present", () => {
    const node = buildTestimonialsJsonLd(
      [
        testimonial({
          source: { type: "linkedin", capturedAt: "2024-05-01" },
        }),
      ],
      SERVICE,
    ) as Node;
    expect((node.review as Node[])[0].datePublished).toBe("2024-05-01");
  });

  it("omits datePublished when no capturedAt is present", () => {
    const node = buildTestimonialsJsonLd([testimonial()], SERVICE) as Node;
    expect((node.review as Node[])[0].datePublished).toBeUndefined();
  });
});

describe("buildTestimonialsJsonLd -- aggregateRating", () => {
  it("computes ratingValue (1 decimal) + reviewCount over rated items only", () => {
    const node = buildTestimonialsJsonLd(
      [
        testimonial({ id: "a", rating: 5 }),
        testimonial({ id: "b", rating: 4 }),
        testimonial({ id: "c" }), // unrated: excluded from count + average
      ],
      SERVICE,
    ) as Node;
    expect(node.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 4.5,
      reviewCount: 2,
      bestRating: "5",
    });
  });

  it("rounds the average to a single decimal place", () => {
    const node = buildTestimonialsJsonLd(
      [
        testimonial({ id: "a", rating: 5 }),
        testimonial({ id: "b", rating: 4 }),
        testimonial({ id: "c", rating: 4 }),
      ],
      SERVICE,
    ) as Node;
    // (5 + 4 + 4) / 3 = 4.333... -> 4.3
    expect((node.aggregateRating as Node).ratingValue).toBe(4.3);
  });

  it("omits aggregateRating entirely when no testimonial has a rating", () => {
    const node = buildTestimonialsJsonLd(
      [testimonial({ id: "a" }), testimonial({ id: "b" })],
      SERVICE,
    ) as Node;
    expect(node.aggregateRating).toBeUndefined();
    // But reviews are still emitted (verbatim quotes, no ratings).
    expect((node.review as Node[]).length).toBe(2);
    for (const r of node.review as Node[]) {
      expect(r.reviewRating).toBeUndefined();
    }
  });
});

describe("getItemReviewed -- compliant defaults", () => {
  it("defaults type to Service (NOT Organization) when unset", () => {
    // Google ignores self-serving review markup on Organization; Service is the
    // compliant default.
    expect(getItemReviewed({ name: "X" }).type).toBe("Service");
  });

  it("falls back name to siteConfig.companyName when blank", () => {
    const resolved = getItemReviewed({ type: "Service", name: "   " });
    expect(resolved.name.length).toBeGreaterThan(0);
    expect(resolved.name).not.toBe("   ");
  });

  it("honors an explicit type + name", () => {
    expect(getItemReviewed({ type: "Product", name: "Widget" })).toEqual({
      type: "Product",
      name: "Widget",
    });
  });
});
