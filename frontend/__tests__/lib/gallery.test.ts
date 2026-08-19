import { describe, expect, it } from "vitest";
import {
  filterGalleryAssets,
  galleryAssetUrl,
  getGalleryAssetById,
  getLatestGalleryAsset,
  parseGalleryManifest,
  toGalleryImage,
} from "@/lib/gallery";

const FILE = "content/gallery.json";

const VALID = JSON.stringify({
  version: 1,
  collections: [
    {
      id: "conference-2026",
      label: "Conference 2026",
      kind: "event",
      date: "2026-05-20",
      location: "Madrid",
    },
    { id: "profile", label: "Profile", kind: "collection" },
  ],
  assets: [
    {
      id: "profile-current",
      path: "gallery/profile/current.jpg",
      alt: "Current profile photo",
      collectionIds: ["profile"],
      roles: ["profile", "avatar"],
      tags: ["current"],
      date: "2026-08-19",
      featured: true,
      variants: {
        card: {
          path: "gallery/profile/current-card.jpg",
          width: 400,
          height: 600,
        },
        lightbox: {
          path: "gallery/profile/current-lightbox.jpg",
          width: 1600,
          height: 2400,
        },
      },
    },
    {
      id: "conference-keynote",
      path: "gallery/events/conference-2026/keynote.jpg",
      alt: "Keynote at Conference 2026",
      collectionIds: ["conference-2026"],
      roles: ["event"],
      tags: ["keynote"],
      date: "2026-05-20",
    },
    {
      id: "profile-older",
      path: "gallery/profile/older.jpg",
      alt: "Older profile photo",
      collectionIds: ["profile"],
      roles: ["profile"],
      date: "2025-01-01",
    },
  ],
});

describe("gallery manifest", () => {
  it("parses collections, stable assets, and semantic metadata", () => {
    const manifest = parseGalleryManifest(VALID, FILE);

    expect(manifest.version).toBe(1);
    expect(manifest.collections[0]).toMatchObject({
      id: "conference-2026",
      kind: "event",
    });
    expect(manifest.assets[0]).toMatchObject({
      id: "profile-current",
      path: "gallery/profile/current.jpg",
      roles: ["profile", "avatar"],
    });
    expect(manifest.assets[0].variants?.card).toEqual({
      path: "gallery/profile/current-card.jpg",
      width: 400,
      height: 600,
    });
  });

  it("supports stable ID lookup and filters by collection, role, and tag", () => {
    const { assets } = parseGalleryManifest(VALID, FILE);

    expect(getGalleryAssetById(assets, "conference-keynote")?.alt).toContain(
      "Keynote",
    );
    expect(
      filterGalleryAssets(assets, { collectionId: "profile" }),
    ).toHaveLength(2);
    expect(
      filterGalleryAssets(assets, { role: "event", tag: "keynote" }),
    ).toHaveLength(1);
    expect(filterGalleryAssets(assets, { featured: true })[0].id).toBe(
      "profile-current",
    );
  });

  it("finds the latest matching image without making it the canonical ID", () => {
    const { assets } = parseGalleryManifest(VALID, FILE);

    expect(getLatestGalleryAsset(assets, { role: "profile" })?.id).toBe(
      "profile-current",
    );
    expect(
      getLatestGalleryAsset(assets, { role: "missing" as never }),
    ).toBeUndefined();
  });

  it("maps the same manifest path to local and CDN URLs", () => {
    const { assets } = parseGalleryManifest(VALID, FILE);
    const asset = assets[0];

    expect(galleryAssetUrl(asset)).toBe("/gallery/profile/current.jpg");
    expect(galleryAssetUrl(asset, "", "card")).toBe(
      "/gallery/profile/current-card.jpg",
    );
    expect(galleryAssetUrl(asset, "https://cdn.example.com/site")).toBe(
      "https://cdn.example.com/site/gallery/profile/current.jpg",
    );
    expect(toGalleryImage(asset).src).toBe("/gallery/profile/current.jpg");
    expect(toGalleryImage(asset, "", "card")).toMatchObject({
      src: "/gallery/profile/current-card.jpg",
      lightboxSrc: "/gallery/profile/current-lightbox.jpg",
      width: 400,
      height: 600,
    });
  });
});

describe("gallery manifest validation", () => {
  it("rejects duplicate IDs and unknown collections", () => {
    const duplicate = JSON.parse(VALID);
    duplicate.assets.push({
      ...duplicate.assets[0],
      path: "gallery/other.jpg",
    });
    expect(() => parseGalleryManifest(JSON.stringify(duplicate), FILE)).toThrow(
      /Asset IDs .* unique/,
    );

    const unknown = JSON.parse(VALID);
    unknown.assets[0].collectionIds = ["does-not-exist"];
    expect(() => parseGalleryManifest(JSON.stringify(unknown), FILE)).toThrow(
      /unknown collection/,
    );
  });

  it("rejects unsafe paths, missing alt text, and invalid flags", () => {
    const unsafe = JSON.parse(VALID);
    unsafe.assets[0].path = "gallery/../secret.jpg";
    expect(() => parseGalleryManifest(JSON.stringify(unsafe), FILE)).toThrow(
      /normalized relative path/,
    );

    const missingAlt = JSON.parse(VALID);
    delete missingAlt.assets[0].alt;
    expect(() =>
      parseGalleryManifest(JSON.stringify(missingAlt), FILE),
    ).toThrow(/alt/);

    const invalidFlag = JSON.parse(VALID);
    invalidFlag.assets[0].featured = "yes";
    expect(() =>
      parseGalleryManifest(JSON.stringify(invalidFlag), FILE),
    ).toThrow(/featured.*boolean/);

    const invalidVariant = JSON.parse(VALID);
    invalidVariant.assets[0].variants = {
      card: { path: "gallery/profile/card.jpg", width: 400 },
    };
    expect(() =>
      parseGalleryManifest(JSON.stringify(invalidVariant), FILE),
    ).toThrow(/height.*required/);
  });
});
