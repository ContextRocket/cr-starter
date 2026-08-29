import { describe, expect, it } from "vitest";
import {
  assetPublicPath,
  resolveManifestSections,
  visibleSections,
} from "@/lib/landing-page/resolve";
import {
  loadFixtureManifest,
  listFixtureIds,
  fixtureIdFromRoute,
} from "@/lib/landing-page/fixtures";
import { LANDING_PAGE_MANIFEST_SCHEMA_VERSION } from "@/lib/generated/landing-page-manifest";

describe("landing-page fixtures", () => {
  it("lists kleos and weak-brand", () => {
    expect(listFixtureIds()).toEqual(["kleos", "weak-brand"]);
  });

  it("maps route segments to fixture ids", () => {
    expect(fixtureIdFromRoute(["kleos"])).toBe("kleos");
    expect(fixtureIdFromRoute(["weak-brand"])).toBe("weak-brand");
    expect(fixtureIdFromRoute(["nope"])).toBeNull();
  });
});

describe("kleos fixture adapter", () => {
  const manifest = loadFixtureManifest("kleos");

  it("has schema version and generated route", () => {
    expect(manifest.schema_version).toBe(LANDING_PAGE_MANIFEST_SCHEMA_VERSION);
    expect(manifest.route).toBe("/generated/kleos");
  });

  it("resolves hero, proof, media, content, testimonials, faq, cta", () => {
    const kinds = resolveManifestSections(manifest).map((s) => s.kind);
    expect(kinds).toEqual([
      "hero",
      "proof_stat",
      "media",
      "content_feed",
      "testimonial",
      "faq",
      "cta",
    ]);
  });

  it("maps assets to local public paths (no remotes)", () => {
    for (const asset of manifest.assets) {
      expect(asset.local_path).not.toMatch(/^https?:/i);
      const pub = assetPublicPath(asset);
      expect(pub.startsWith("/landing-page/")).toBe(true);
    }
  });

  it("uses explicit mailto CTA (no lead form)", () => {
    const cta = resolveManifestSections(manifest).find((s) => s.kind === "cta");
    expect(cta?.kind).toBe("cta");
    if (cta?.kind === "cta") {
      expect(cta.action.href.startsWith("mailto:")).toBe(true);
    }
    expect(manifest.sections.some((s) => s.type === "lead_form")).toBe(false);
  });
});

describe("weak-brand fixture adapter", () => {
  const manifest = loadFixtureManifest("weak-brand");

  it("uses starter theme and records missing appearance", () => {
    expect(manifest.appearance.fallback).toBe("starter_theme");
    expect(manifest.appearance.missing_inputs).toEqual(
      expect.arrayContaining(["logo", "hero_image"]),
    );
    expect(manifest.assets).toEqual([]);
  });

  it("does not invent logo or hero imagery", () => {
    const sections = resolveManifestSections(manifest);
    expect(sections.some((s) => s.kind === "media")).toBe(false);
    expect(sections.some((s) => s.kind === "logo_strip")).toBe(false);
    const hero = sections.find((s) => s.kind === "hero");
    expect(hero?.kind).toBe("hero");
    if (hero?.kind === "hero") {
      expect(hero.title).toContain("Acme Example");
    }
  });

  it("omits invisible sections", () => {
    const withHidden = {
      ...manifest,
      sections: [
        ...manifest.sections,
        {
          type: "faq" as const,
          id: "hidden-faq",
          order: 99,
          visible: false,
          title: "Hidden",
          items: [{ question: "Q", answer: "A" }],
        },
      ],
    };
    expect(visibleSections(withHidden).some((s) => s.id === "hidden-faq")).toBe(
      false,
    );
    expect(
      resolveManifestSections(withHidden).some((s) => s.id === "hidden-faq"),
    ).toBe(false);
  });
});
