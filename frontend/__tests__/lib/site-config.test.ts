/**
 * Smoke tests for site.config.ts.
 *
 * Verifies the exported object has the required shape and that no
 * key consumer-visible field is an empty string. This catches the
 * common mistake of blanking a field rather than filling it with a
 * meaningful placeholder.
 */

import { siteConfig } from "@/config/site.config";

describe("siteConfig shape", () => {
  it("has a non-empty companyName", () => {
    expect(siteConfig.companyName.length).toBeGreaterThan(0);
  });

  it("has a non-empty tagline", () => {
    expect(siteConfig.tagline.length).toBeGreaterThan(0);
  });

  it("has a non-empty description", () => {
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  it("has a siteUrl that starts with http", () => {
    expect(siteConfig.siteUrl).toMatch(/^https?:\/\//);
  });

  it("has a contactEmail with an @", () => {
    expect(siteConfig.contactEmail).toContain("@");
  });

  it("has a non-empty defaultLocale", () => {
    expect(siteConfig.defaultLocale.length).toBeGreaterThan(0);
  });

  it("has a locales array containing en", () => {
    expect(siteConfig.locales).toContain("en");
    expect(siteConfig.locales.length).toBeGreaterThanOrEqual(1);
  });

  it("has all required asset paths defined", () => {
    expect(siteConfig.assets.faviconIco).toBeTruthy();
    expect(siteConfig.assets.icon192).toBeTruthy();
    expect(siteConfig.assets.icon512).toBeTruthy();
    expect(siteConfig.assets.icon192Maskable).toBeTruthy();
    expect(siteConfig.assets.icon512Maskable).toBeTruthy();
    expect(siteConfig.assets.appleTouchIcon).toBeTruthy();
  });

  it("has the gallery content seam available", () => {
    expect(siteConfig.gallery.manifestPath).toBe("content/gallery.json");
    expect(siteConfig.gallery.assetBaseUrl).toBe("");
    expect(siteConfig.features.gallery).toBe(false);
  });

  it("has all required legal fields defined", () => {
    expect(siteConfig.legal.entity.length).toBeGreaterThan(0);
    expect(siteConfig.legal.address.length).toBeGreaterThan(0);
    expect(siteConfig.legal.register.length).toBeGreaterThan(0);
    expect(siteConfig.legal.vat.length).toBeGreaterThan(0);
    expect(siteConfig.legal.representedBy.length).toBeGreaterThan(0);
    expect(siteConfig.legal.privacyContact).toContain("@");
  });
});
