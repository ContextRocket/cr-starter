/**
 * Unit tests for lib/testimonials.ts
 *
 * Covers the pure resolution core + the file adapter's injected-data path
 * (no filesystem access needed — the JSON is imported at module scope, and the
 * adapter accepts an injected RawTestimonial[] for tests):
 *   - published filter (published === false is dropped; absent/true kept)
 *   - order sort (ascending by `order`)
 *   - locale resolve with en fallback for role + quote
 *   - featured defaults to false; optional fields pass through
 *   - the shipped testimonials.config.json parses through the default adapter
 */

import {
  resolveTestimonials,
  FileTestimonialsAdapter,
  getTestimonials,
  type RawTestimonial,
} from "@/lib/testimonials";

function raw(overrides: Partial<RawTestimonial> = {}): RawTestimonial {
  return {
    id: "x",
    author: "Author X",
    order: 1,
    quote: { en: "English quote" },
    ...overrides,
  };
}

describe("resolveTestimonials — published filter", () => {
  it("drops entries with published === false", () => {
    const out = resolveTestimonials(
      [
        raw({ id: "keep", published: true }),
        raw({ id: "drop", published: false }),
      ],
      "en",
    );
    expect(out.map((t) => t.id)).toEqual(["keep"]);
  });

  it("keeps entries with published absent or true", () => {
    const out = resolveTestimonials(
      [raw({ id: "absent" }), raw({ id: "true", published: true })],
      "en",
    );
    expect(out.map((t) => t.id).sort()).toEqual(["absent", "true"]);
  });
});

describe("resolveTestimonials — order sort", () => {
  it("sorts ascending by order", () => {
    const out = resolveTestimonials(
      [
        raw({ id: "c", order: 3 }),
        raw({ id: "a", order: 1 }),
        raw({ id: "b", order: 2 }),
      ],
      "en",
    );
    expect(out.map((t) => t.id)).toEqual(["a", "b", "c"]);
  });
});

describe("resolveTestimonials — locale resolve + en fallback", () => {
  it("resolves role and quote for the requested locale", () => {
    const out = resolveTestimonials(
      [
        raw({
          role: { en: "Head of Growth", de: "Leiterin Wachstum" },
          quote: { en: "English quote", de: "Deutsches Zitat" },
        }),
      ],
      "de",
    );
    expect(out[0].role).toBe("Leiterin Wachstum");
    expect(out[0].quote).toBe("Deutsches Zitat");
  });

  it("falls back to en when the locale key is missing", () => {
    const out = resolveTestimonials(
      [
        raw({
          role: { en: "Head of Growth" },
          quote: { en: "English quote" },
        }),
      ],
      "es",
    );
    expect(out[0].role).toBe("Head of Growth");
    expect(out[0].quote).toBe("English quote");
  });

  it("falls back to en when the locale value is empty", () => {
    const out = resolveTestimonials(
      [raw({ quote: { en: "English quote", es: "" } })],
      "es",
    );
    expect(out[0].quote).toBe("English quote");
  });

  it("resolves role to empty string when role is absent (not an error)", () => {
    const out = resolveTestimonials([raw({ role: undefined })], "en");
    expect(out[0].role).toBe("");
  });
});

describe("resolveTestimonials — field passthrough", () => {
  it("defaults featured to false and passes rating/company/avatar/source", () => {
    const out = resolveTestimonials(
      [
        raw({
          company: "Acme",
          avatar: "/a.jpg",
          rating: 5,
          source: { type: "linkedin", url: "", capturedAt: "2024-01-01" },
        }),
      ],
      "en",
    );
    expect(out[0].featured).toBe(false);
    expect(out[0].rating).toBe(5);
    expect(out[0].company).toBe("Acme");
    expect(out[0].avatar).toBe("/a.jpg");
    expect(out[0].source?.type).toBe("linkedin");
  });

  it("honors an explicit featured flag", () => {
    const out = resolveTestimonials([raw({ featured: true })], "en");
    expect(out[0].featured).toBe(true);
  });
});

describe("FileTestimonialsAdapter", () => {
  it("resolves an injected raw array through the same contract", () => {
    const adapter = new FileTestimonialsAdapter([
      raw({ id: "b", order: 2 }),
      raw({ id: "a", order: 1, published: true }),
      raw({ id: "hidden", order: 0, published: false }),
    ]);
    const out = adapter.getTestimonials("en");
    expect(out.map((t) => t.id)).toEqual(["a", "b"]);
  });
});

describe("getTestimonials — shipped config", () => {
  it("parses testimonials.config.json without throwing and returns resolved items", () => {
    const out = getTestimonials("en");
    expect(Array.isArray(out)).toBe(true);
    // The shipped example config has published items.
    expect(out.length).toBeGreaterThan(0);
    for (const t of out) {
      expect(typeof t.id).toBe("string");
      expect(typeof t.quote).toBe("string");
      expect(t.quote.length).toBeGreaterThan(0);
    }
  });

  it("resolves shipped es content (or falls back to en) without empties", () => {
    const out = getTestimonials("es");
    for (const t of out) {
      expect(t.quote.length).toBeGreaterThan(0);
    }
  });
});
