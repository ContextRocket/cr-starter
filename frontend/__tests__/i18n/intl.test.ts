import { formatMessage } from "@/i18n/translator";
import { getIntlTranslator } from "@/i18n/intl";
import { createFormatter } from "@/i18n/format";

// A small message tree exercising the next-intl-compatible surface.
const tree = {
  home: {
    hero: { title: "Hello, {name}" },
    stats: { pages: "{pages, plural, one {# page} other {# pages}} read" },
  },
  raw: { list: ["a", "b"] },
} as Record<string, unknown>;

describe("formatMessage (ICU plural, dependency-free)", () => {
  it("is byte-identical to interpolation for non-plural strings", () => {
    expect(formatMessage("en", "Hello, {name}", { name: "Ada" })).toBe("Hello, Ada");
    // no params -> untouched
    expect(formatMessage("en", "Hello, {name}")).toBe("Hello, {name}");
  });

  it("selects the English plural category and substitutes #", () => {
    const msg = "{pages, plural, one {# page} other {# pages}} read";
    expect(formatMessage("en", msg, { pages: 1 })).toBe("1 page read");
    expect(formatMessage("en", msg, { pages: 5 })).toBe("5 pages read");
  });

  it("uses locale plural rules (de: 1 -> one, else other)", () => {
    const de = "{questions, plural, one {# Frage} other {# Fragen}} gestellt";
    expect(formatMessage("de", de, { questions: 1 })).toBe("1 Frage gestellt");
    expect(formatMessage("de", de, { questions: 3 })).toBe("3 Fragen gestellt");
  });

  it("honours exact =N matches over categories", () => {
    const msg = "{n, plural, =0 {none} one {# item} other {# items}}";
    expect(formatMessage("en", msg, { n: 0 })).toBe("none");
    expect(formatMessage("en", msg, { n: 1 })).toBe("1 item");
  });
});

describe("getIntlTranslator (next-intl-shaped)", () => {
  it("resolves full keys with no namespace", () => {
    const t = getIntlTranslator("en", tree);
    expect(t("home.hero.title", { name: "Ada" })).toBe("Hello, Ada");
  });

  it("resolves relative keys when given a namespace", () => {
    const t = getIntlTranslator("en", tree, "home.hero");
    expect(t("title", { name: "Grace" })).toBe("Hello, Grace");
  });

  it("supports t.has and t.raw", () => {
    const t = getIntlTranslator("en", tree);
    expect(t.has("home.hero.title")).toBe(true);
    expect(t.has("home.hero.missing")).toBe(false);
    expect(t.raw("raw.list")).toEqual(["a", "b"]);
  });

  it("throws on a missing key like the base translator", () => {
    const t = getIntlTranslator("en", tree);
    expect(() => t("home.hero.missing")).toThrow(/Missing key/);
  });
});

describe("createFormatter", () => {
  it("formats numbers and dates for the locale", () => {
    const f = createFormatter("en");
    expect(f.number(1234.5)).toBe("1,234.5");
    expect(typeof f.dateTime(new Date(0))).toBe("string");
    expect(f.list(["a", "b", "c"])).toContain("a");
  });
});
