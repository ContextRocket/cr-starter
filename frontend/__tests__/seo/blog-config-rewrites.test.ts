/**
 * Unit: blog.config.mjs -- basePath normalization + next.config rewrites.
 *
 * Pure builder assertions (no Next runtime, no siteConfig mock): these test the
 * shared JS that both next.config.mjs and lib/blog-path.ts consume. The rewrite
 * generator must be a no-op at the default "/blog" (so cr-starter emits zero
 * rewrites) and map the custom public segment onto the physical /blog route for
 * a fork.
 */

import { describe, it, expect } from "vitest";
import {
  normalizeBlogBasePath,
  normalizeBlogContentDir,
  blogRewrites,
} from "@/blog.config.mjs";

describe("normalizeBlogContentDir", () => {
  it("keeps the default posts collection and normalizes fork folders", () => {
    expect(normalizeBlogContentDir("content/posts")).toBe("content/posts");
    expect(normalizeBlogContentDir("/content/blog/")).toBe("content/blog");
    expect(normalizeBlogContentDir("   ")).toBe("content/posts");
  });
});

describe("normalizeBlogBasePath", () => {
  it("returns a normalized default for the conventional blog", () => {
    expect(normalizeBlogBasePath("/blog")).toBe("/blog");
  });

  it("adds a leading slash and strips a trailing slash", () => {
    expect(normalizeBlogBasePath("the-creator-economy-for-b2b")).toBe(
      "/the-creator-economy-for-b2b",
    );
    expect(normalizeBlogBasePath("/the-creator-economy-for-b2b/")).toBe(
      "/the-creator-economy-for-b2b",
    );
  });

  it("collapses empty / bare-slash input back to the default", () => {
    expect(normalizeBlogBasePath("")).toBe("/blog");
    expect(normalizeBlogBasePath("/")).toBe("/blog");
    expect(normalizeBlogBasePath("   ")).toBe("/blog");
  });
});

describe("blogRewrites", () => {
  // blogRewrites reads the committed blog.config.mjs, which ships the default
  // "/blog". cr-starter must therefore emit NO rewrite (behavior unchanged).
  it("emits zero rewrites at the shipped default (/blog)", () => {
    expect(blogRewrites()).toEqual([]);
  });
});
