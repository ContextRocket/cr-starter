/**
 * Unit: lib/blog-path -- the single accessor for the blog's public segment/title.
 *
 * Two describes, each mocking @/site.config to a different blog config so we
 * prove BOTH the shipped default (/blog + "Blog") and a fork's custom segment
 * flow through blogBasePath / blogPostPath / blogTitle. The real
 * normalizeBlogBasePath (from blog.config.mjs) runs -- we mock only the config
 * VALUES, not the normalization logic.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

describe("blog-path -- shipped default (/blog, Blog)", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("@/config/site.config", () => ({
      siteConfig: { blog: { basePath: "/blog", title: "Blog" } },
    }));
  });

  it("blogBasePath is /blog and isDefault is true", async () => {
    const { blogBasePath, isDefaultBlogBasePath } = await import(
      "@/lib/blog-path"
    );
    expect(blogBasePath()).toBe("/blog");
    expect(isDefaultBlogBasePath()).toBe(true);
  });

  it("blogPostPath prefixes the default segment; blogTitle is Blog", async () => {
    const { blogPostPath, blogTitle } = await import("@/lib/blog-path");
    expect(blogPostPath("my-slug")).toBe("/blog/my-slug");
    expect(blogTitle()).toBe("Blog");
  });
});

describe("blog-path -- custom fork segment", () => {
  beforeEach(() => {
    vi.resetModules();
    // A trailing slash + missing leading slash proves normalization runs.
    vi.doMock("@/config/site.config", () => ({
      siteConfig: {
        blog: {
          basePath: "the-creator-economy-for-b2b/",
          title: "The Creator Economy for B2B",
        },
      },
    }));
  });

  it("normalizes the custom segment and reports non-default", async () => {
    const { blogBasePath, isDefaultBlogBasePath } = await import(
      "@/lib/blog-path"
    );
    expect(blogBasePath()).toBe("/the-creator-economy-for-b2b");
    expect(isDefaultBlogBasePath()).toBe(false);
  });

  it("blogPostPath + blogTitle honor the custom config", async () => {
    const { blogPostPath, blogTitle } = await import("@/lib/blog-path");
    expect(blogPostPath("launch")).toBe(
      "/the-creator-economy-for-b2b/launch",
    );
    expect(blogTitle()).toBe("The Creator Economy for B2B");
  });
});
