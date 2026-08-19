/**
 * Unit: structured-data JSON-LD builders.
 *
 * Pure-builder assertions on the schema.org nodes the site emits: breadcrumb
 * positions, BlogPosting shape (type, publisher anchor, ISO dates), the home
 * Organization + WebSite pair, and the `<`-escaping serializer.
 */

import { describe, it, expect } from "vitest";
import {
  buildBreadcrumbListJsonLd,
  buildBlogPostingJsonLd,
  buildHomeJsonLd,
  serializeJsonLd,
} from "@/lib/structured-data";
import { siteConfig } from "@/config/site.config";

const ORIGIN = siteConfig.siteUrl.replace(/\/$/, "");

describe("buildBreadcrumbListJsonLd", () => {
  it("numbers ListItems 1..n in order", () => {
    const node = buildBreadcrumbListJsonLd([
      { name: "Home", url: `${ORIGIN}/en` },
      { name: "Blog", url: `${ORIGIN}/en/blog` },
      { name: "Post", url: `${ORIGIN}/en/blog/post` },
    ]);

    expect(node["@type"]).toBe("BreadcrumbList");
    const items = node.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(3);
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(items[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${ORIGIN}/en`,
    });
    expect(items[2].name).toBe("Post");
  });

  it("emits an empty list for no crumbs", () => {
    const node = buildBreadcrumbListJsonLd([]);
    expect(node.itemListElement).toEqual([]);
  });
});

describe("buildBlogPostingJsonLd", () => {
  const input = {
    title: "A post",
    description: "A description",
    url: `${ORIGIN}/en/blog/a-post`,
    datePublished: "2026-01-15",
    author: "Author Name",
  };

  it("has @type BlogPosting and publisher anchored to #organization", () => {
    const node = buildBlogPostingJsonLd(input);
    expect(node["@type"]).toBe("BlogPosting");
    expect(node.publisher).toEqual({ "@id": `${ORIGIN}/#organization` });
    expect(node["@id"]).toBe(`${input.url}#article`);
    expect(node.headline).toBe("A post");
    expect(node.author).toMatchObject({ "@type": "Person", name: "Author Name" });
    expect(node.mainEntityOfPage).toMatchObject({ "@id": input.url });
  });

  it("uses valid ISO dates; dateModified defaults to datePublished", () => {
    const node = buildBlogPostingJsonLd(input);
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    expect(node.datePublished).toMatch(iso);
    expect(node.dateModified).toMatch(iso);
    // parseable as a real date
    expect(Number.isNaN(new Date(node.datePublished as string).getTime())).toBe(
      false,
    );
    // defaults to datePublished when not supplied
    expect(node.dateModified).toBe(input.datePublished);
  });

  it("honors an explicit dateModified", () => {
    const node = buildBlogPostingJsonLd({
      ...input,
      dateModified: "2026-02-20",
    });
    expect(node.dateModified).toBe("2026-02-20");
  });

  it("falls back to the site logo image when none supplied", () => {
    const node = buildBlogPostingJsonLd(input);
    expect(node.image).toBe(`${ORIGIN}${siteConfig.assets.logo}`);
  });
});

describe("buildHomeJsonLd", () => {
  it("emits an Organization + WebSite pair anchored by @id", () => {
    const nodes = buildHomeJsonLd();
    const types = nodes.map((n) => n["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");

    const org = nodes.find((n) => n["@type"] === "Organization")!;
    const site = nodes.find((n) => n["@type"] === "WebSite")!;
    expect(org["@id"]).toBe(`${ORIGIN}/#organization`);
    expect(site["@id"]).toBe(`${ORIGIN}/#website`);
    // WebSite publisher anchors back to the Organization node.
    expect(site.publisher).toEqual({ "@id": `${ORIGIN}/#organization` });
    // Organization carries the schema.org context and site name.
    expect(org["@context"]).toBe("https://schema.org");
    expect(org.name).toBe(siteConfig.companyName);
  });
});

describe("serializeJsonLd", () => {
  it("escapes `<` so a JSON-LD block cannot inject HTML tags", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)" });
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<script>");
    expect(out).toContain("\\u003c");
    // still valid JSON round-trips back to the original value
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)");
  });
});
