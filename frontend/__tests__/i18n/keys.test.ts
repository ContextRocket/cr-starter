import {
  setLocale,
  getCurrentLocale,
  t,
  tArray,
  translateError,
  registerLocaleMessages,
} from "@/i18n/keys";

// Reset locale to en before each test.
beforeEach(() => {
  setLocale("en");
});

describe("setLocale / getCurrentLocale", () => {
  it("defaults to en", () => {
    expect(getCurrentLocale()).toBe("en");
  });

  it("round-trips through setLocale", () => {
    setLocale("es");
    expect(getCurrentLocale()).toBe("es");
    setLocale("de");
    expect(getCurrentLocale()).toBe("de");
    setLocale("en");
    expect(getCurrentLocale()).toBe("en");
  });
});

describe("t()", () => {
  it("resolves a key in the active locale", () => {
    setLocale("en");
    const result = t("chat.empty.title");
    expect(result).toBeTypeOf("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("throws for a missing key", () => {
    expect(() => t("NONEXISTENT_KEY_XYZ")).toThrow(/Missing key/);
  });

  it("supports {param} interpolation", () => {
    const result = t("home.testimonials.ratingLabel", { rating: "5.0" });
    expect(result).toContain("5.0");
  });
});

describe("tArray()", () => {
  it("returns empty array for string keys", () => {
    expect(tArray("chat.empty.title")).toEqual([]);
  });

  it("returns empty array for missing keys", () => {
    expect(tArray("NONEXISTENT")).toEqual([]);
  });
});

describe("translateError()", () => {
  it("returns raw string for unknown keys", () => {
    expect(translateError("UNKNOWN_ERROR")).toBe("UNKNOWN_ERROR");
  });

  it("supports {param} interpolation", () => {
    registerLocaleMessages("en", {
      ERROR_USER: "User {name} not found",
    } as unknown as Record<string, unknown>);
    expect(translateError("ERROR_USER", { name: "Bob" })).toBe(
      "User Bob not found",
    );
  });
});

describe("registerLocaleMessages", () => {
  it("makes a locale available for t()", () => {
    registerLocaleMessages("es", {
      "test.key": "valor de prueba",
    } as unknown as Record<string, unknown>);
    setLocale("es");
    expect(t("test.key" as string & {})).toBe("valor de prueba");
  });
});
