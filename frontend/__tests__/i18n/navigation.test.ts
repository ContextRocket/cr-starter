import { prefixLocale } from "@/i18n/navigation";

describe("prefixLocale", () => {
  it("prefixes a bare path with the locale", () => {
    expect(prefixLocale("/privacy", "es")).toBe("/es/privacy");
  });

  it("prefixes the root path", () => {
    expect(prefixLocale("/", "es")).toBe("/es");
  });

  it("does not double-prefix an already-prefixed path", () => {
    expect(prefixLocale("/es/privacy", "es")).toBe("/es/privacy");
  });

  it("passes through external URLs unchanged", () => {
    expect(prefixLocale("https://example.com", "es")).toBe("https://example.com");
    expect(prefixLocale("http://example.com", "es")).toBe("http://example.com");
  });

  it("passes through anchor links unchanged", () => {
    expect(prefixLocale("#section", "es")).toBe("#section");
  });

  it("passes through mailto links unchanged", () => {
    expect(prefixLocale("mailto:hi@example.com", "es")).toBe("mailto:hi@example.com");
  });

  it("normalizes relative paths", () => {
    expect(prefixLocale("blog", "de")).toBe("/de/blog");
  });
});
