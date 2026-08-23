/**
 * Smoke tests for site.config.ts.
 *
 * Verifies the exported object has the required shape and that no
 * key consumer-visible field is an empty string. This catches the
 * common mistake of blanking a field rather than filling it with a
 * meaningful placeholder.
 */

import { siteConfig } from "@/config/site.config";
import { getChatFabLogoAssets } from "@/lib/brand-assets";

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

  it("uses the ContextRocket showcase identity by default", () => {
    expect(siteConfig.chat.handle).toBe("contextrocket");
    expect(siteConfig.chat.agentUrl).toBe("https://app-api.contextrocket.com");
    expect(siteConfig.chat.mode).toBe("demo");
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

  it("resolves a dedicated ChatFab icon without requiring one", () => {
    const configuredChatFabIcon = (
      siteConfig.assets as typeof siteConfig.assets & {
        chatFabIcon?: string;
      }
    ).chatFabIcon;

    expect(getChatFabLogoAssets(siteConfig.assets)).toEqual({
      src: configuredChatFabIcon ?? siteConfig.assets.logo,
      srcDark: configuredChatFabIcon ?? siteConfig.assets.logoDark,
    });

    expect(
      getChatFabLogoAssets({
        logo: "/brand/wordmark.svg",
        logoDark: "/brand/wordmark-dark.svg",
        chatFabIcon: "/brand/icon.png",
      }),
    ).toEqual({
      src: "/brand/icon.png",
      srcDark: "/brand/icon.png",
    });
  });

  it("has the gallery content seam available", () => {
    expect(siteConfig.gallery.manifestPath).toBe("content/gallery.json");
    expect(siteConfig.gallery.assetBaseUrl).toBe("");
    expect(typeof siteConfig.features.gallery).toBe("boolean");
  });

  it("has a configurable Markdown post directory", () => {
    expect(siteConfig.blog.contentDir).toBeTruthy();
  });

  it("declares a legal entity type and a non-empty identity", () => {
    // Existing-site forks may intentionally disable the generic Impressum
    // route while retaining their own legal/privacy pages. They should not
    // have to invent placeholder register or VAT data just to satisfy the
    // starter smoke test.
    if (!siteConfig.features.impressum) return;

    // entityType is on the spectrum company | individual | unincorporated.
    expect(["company", "individual", "unincorporated"]).toContain(
      siteConfig.legal.entityType,
    );
    // Every entity type has a name (legal name / person / trading name) and a
    // privacy contact.
    expect(siteConfig.legal.entity.length).toBeGreaterThan(0);
    expect(siteConfig.legal.privacyContact).toContain("@");

    // register + VAT are company-only. They are OPTIONAL overall and only
    // asserted for the company type -- an individual/unincorporated brand is
    // complete without them.
    if (siteConfig.legal.entityType === "company") {
      expect(siteConfig.legal.address?.length ?? 0).toBeGreaterThan(0);
      expect(siteConfig.legal.register?.length ?? 0).toBeGreaterThan(0);
      expect(siteConfig.legal.vat?.length ?? 0).toBeGreaterThan(0);
      expect(siteConfig.legal.representedBy?.length ?? 0).toBeGreaterThan(0);
    }
  });
});
