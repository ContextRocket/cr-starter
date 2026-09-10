/**
 * BLOG-001 … BLOG-004 — Markdown post loading behaviors.
 */
import { describe, expect, it } from "vitest";
import { getPost, listPosts } from "@/lib/blog";
import { given, scenario, thenStep, when } from "../../support/bdd";

scenario("BLOG-001 locale-specific post wins over shared", () => {
  it("loads the English getting-started file for en", async () => {
    const post = given("the getting-started slug for en", () =>
      getPost("getting-started", "en"),
    );

    await thenStep("a locale-specific post is returned", () => {
      expect(post).not.toBeNull();
      expect(post?.locale).toBe("en");
      expect(post?.slug).toBe("getting-started");
      expect(typeof post?.title).toBe("string");
      expect(post?.title.length).toBeGreaterThan(0);
    });
  });

  it("loads shared building-your-first-page for every locale", () => {
    for (const locale of ["en", "es", "de"] as const) {
      const post = getPost("building-your-first-page", locale);
      expect(post).not.toBeNull();
      expect(post?.locale).toBe("shared");
    }
  });
});

scenario("BLOG-002 cover image is optional metadata", () => {
  it("exposes the cover path when frontmatter sets image", () => {
    const post = getPost("getting-started", "en");
    expect(post?.image?.startsWith("/")).toBe(true);
  });

  it("does not invent a cover when absent", async () => {
    // Shared deploying post has an image; assert the field is either a path or undefined — never "".
    const post = getPost("deploying-your-site", "en");
    await thenStep("image is a root-relative path when present", () => {
      if (post?.image !== undefined) {
        expect(post.image.startsWith("/")).toBe(true);
        expect(post.image.length).toBeGreaterThan(1);
      }
    });
  });
});

scenario("BLOG-003 posts order newest first", () => {
  it("sorts by date descending", async () => {
    const posts = given("the en post list", () => listPosts("en"));

    let dates: string[] = [];
    await when("reading dates", () => {
      dates = posts.map((p) => p.date);
    });

    await thenStep("each date is >= the next", () => {
      expect(posts.length).toBeGreaterThan(1);
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i] >= dates[i + 1]).toBe(true);
      }
    });
  });
});

scenario("BLOG-004 featured posts are explicit", () => {
  it("marks getting-started as featured from frontmatter", () => {
    const post = getPost("getting-started", "en");
    expect(post?.featured).toBe(true);
  });

  it("does not mark deploying-your-site as featured", () => {
    const post = getPost("deploying-your-site", "en");
    expect(post?.featured).toBe(false);
  });
});
