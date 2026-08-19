import { createTranslator, createArrayTranslator, translateError } from "@/i18n/translator";
import { en } from "@/i18n/messages/en";

describe("createTranslator", () => {
  it("resolves a dot-path key", () => {
    const t = createTranslator("en", en as unknown as Record<string, unknown>);
    expect(t("chat.empty.title")).toBeTypeOf("string");
    expect(t("chat.empty.title").length).toBeGreaterThan(0);
  });

  it("throws for a missing key", () => {
    const t = createTranslator("en", en as unknown as Record<string, unknown>);
    expect(() => t("NONEXISTENT_KEY_XYZ")).toThrow(/Missing key/);
  });

  it("falls back to English for a locale missing a key", () => {
    const t = createTranslator("es", {});
    expect(t("chat.empty.title")).toBeTypeOf("string");
  });

  it("supports {param} interpolation", () => {
    const t = createTranslator("en", en as unknown as Record<string, unknown>);
    const result = t("home.testimonials.ratingLabel", { rating: "4.8" });
    expect(result).toContain("4.8");
  });

  it("leaves unresolved {placeholders} as-is when params missing", () => {
    const t = createTranslator("en", en as unknown as Record<string, unknown>);
    const result = t("home.testimonials.ratingLabel");
    expect(result).toContain("{rating}");
  });

  it("returns the same string when no params and no placeholders", () => {
    const t = createTranslator("en", en as unknown as Record<string, unknown>);
    const result = t("chat.empty.title");
    expect(result).toBeTypeOf("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("createArrayTranslator", () => {
  it("returns an array for array-shaped keys", () => {
    const messages = { items: ["a", "b", "c"] };
    const tArray = createArrayTranslator("en", messages);
    expect(tArray("items")).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for non-array keys", () => {
    const tArray = createArrayTranslator("en", en as unknown as Record<string, unknown>);
    expect(tArray("chat.empty.title")).toEqual([]);
  });

  it("returns empty array for missing keys", () => {
    const tArray = createArrayTranslator("en", {});
    expect(tArray("NONEXISTENT")).toEqual([]);
  });
});

describe("translateError", () => {
  it("returns the translated string for a known key", () => {
    const messages = { ERROR_INTERNAL: "Internal error" };
    const result = translateError(messages, "ERROR_INTERNAL");
    expect(result).toBe("Internal error");
  });

  it("returns the raw string for an unknown key", () => {
    const result = translateError({}, "UNKNOWN_ERROR");
    expect(result).toBe("UNKNOWN_ERROR");
  });

  it("supports {param} interpolation", () => {
    const messages = { ERROR_USER: "User {name} not found" };
    const result = translateError(messages, "ERROR_USER", {}, { name: "Alice" });
    expect(result).toBe("User Alice not found");
  });
});
