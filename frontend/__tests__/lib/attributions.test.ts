/**
 * Tests for lib/attributions.ts — the pure parser for the attributions atom.
 *
 * Covers the { images, libraries } schema and the fail-loud contract: a valid
 * atom parses into typed image + library credits; a malformed atom throws with
 * file/section context (never a silent empty result).
 *
 * Pure (no filesystem): we drive parseAttributions(source, filePath) directly.
 */

import { describe, it, expect } from "vitest";
import { parseAttributions } from "@/lib/attributions";

const FILE = "content/attributions.json";

const VALID = JSON.stringify({
  images: [
    {
      filename: "ai-brain-future.jpg",
      thumbnail: "/images/blog/ai-brain-future.jpg",
      author: { name: "Growtika", url: "https://unsplash.com/@growtika" },
      source: { name: "Unsplash", url: "https://unsplash.com/photos/x" },
      url: "https://unsplash.com/photos/x",
    },
  ],
  libraries: [
    { name: "Inter", url: "https://rsms.me/inter/", license: "OFL-1.1" },
  ],
});

describe("parseAttributions — valid atom", () => {
  it("parses image credits with author + source links", () => {
    const data = parseAttributions(VALID, FILE);
    expect(data.images).toHaveLength(1);
    const img = data.images[0];
    expect(img.filename).toBe("ai-brain-future.jpg");
    expect(img.author.name).toBe("Growtika");
    expect(img.source.url).toBe("https://unsplash.com/photos/x");
  });

  it("parses library credits", () => {
    const data = parseAttributions(VALID, FILE);
    expect(data.libraries).toHaveLength(1);
    expect(data.libraries[0].name).toBe("Inter");
    expect(data.libraries[0].license).toBe("OFL-1.1");
  });

  it("accepts explicit empty sections", () => {
    const data = parseAttributions(
      JSON.stringify({ images: [], libraries: [] }),
      FILE,
    );
    expect(data.images).toEqual([]);
    expect(data.libraries).toEqual([]);
  });
});

describe("parseAttributions — fail-loud contract", () => {
  it("throws on invalid JSON", () => {
    expect(() => parseAttributions("{ not json", FILE)).toThrow(/Invalid JSON/);
  });

  it("throws when the root is an array (old flat schema)", () => {
    expect(() => parseAttributions("[]", FILE)).toThrow(/must be a JSON object/);
  });

  it("throws when images is missing / not an array", () => {
    expect(() =>
      parseAttributions(JSON.stringify({ libraries: [] }), FILE),
    ).toThrow(/"images" .* must be a JSON array/);
  });

  it("throws when an image entry is missing author/source", () => {
    const bad = JSON.stringify({
      images: [{ filename: "x.jpg", thumbnail: "/x.jpg", url: "https://x" }],
      libraries: [],
    });
    expect(() => parseAttributions(bad, FILE)).toThrow(/author/);
  });

  it("throws when a library entry has no name", () => {
    const bad = JSON.stringify({
      images: [],
      libraries: [{ url: "https://x" }],
    });
    expect(() => parseAttributions(bad, FILE)).toThrow(/"name"/);
  });
});
