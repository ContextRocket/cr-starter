/**
 * Unit tests for lib/structured-data.ts.
 *
 * Verifies that JSON-LD payloads read from site.config and produce
 * schema.org Organization + WebSite nodes with required fields.
 * No browser / React / DOM required.
 */

import {
  buildHomeJsonLd,
  serializeJsonLd,
  type JsonLdNode,
} from "@/lib/structured-data";
import { siteConfig } from "@/site.config";

describe("serializeJsonLd", () => {
  it("serializes a plain object to JSON", () => {
    const result = serializeJsonLd({ "@type": "Organization", name: "Acme" });
    const parsed = JSON.parse(result) as JsonLdNode;
    expect(parsed["@type"]).toBe("Organization");
    expect(parsed.name).toBe("Acme");
  });

  it("escapes < characters to prevent XSS", () => {
    const result = serializeJsonLd({ payload: "<script>alert(1)</script>" });
    expect(result).not.toContain("<");
    expect(result).toContain("\\u003c");
  });
});

describe("buildHomeJsonLd", () => {
  it("returns an array of at least two nodes", () => {
    const nodes = buildHomeJsonLd();
    expect(nodes.length).toBeGreaterThanOrEqual(2);
  });

  it("includes an Organization node with required fields", () => {
    const nodes = buildHomeJsonLd();
    const org = nodes.find((n) => n["@type"] === "Organization") as
      | JsonLdNode
      | undefined;

    expect(org).toBeDefined();
    expect(org?.["@context"]).toBe("https://schema.org");
    expect(org?.name).toBe(siteConfig.companyName);
    expect(org?.legalName).toBe(siteConfig.legalName);
    expect(org?.url as string).toContain(siteConfig.siteUrl.replace(/\/$/, ""));
  });

  it("includes a WebSite node referencing the Organization", () => {
    const nodes = buildHomeJsonLd();
    const site = nodes.find((n) => n["@type"] === "WebSite") as
      | JsonLdNode
      | undefined;

    expect(site).toBeDefined();
    expect(site?.["@context"]).toBe("https://schema.org");
    expect(site?.url as string).toContain(
      siteConfig.siteUrl.replace(/\/$/, ""),
    );
    expect((site?.publisher as JsonLdNode)?.["@id"]).toContain("#organization");
  });

  it("Organization contactPoint includes the contact email", () => {
    const nodes = buildHomeJsonLd();
    const org = nodes.find((n) => n["@type"] === "Organization") as
      | JsonLdNode
      | undefined;
    const contact = org?.contactPoint as JsonLdNode | undefined;

    expect(contact?.email).toBe(siteConfig.contactEmail);
  });

  it("Organization sameAs is an array (empty or populated)", () => {
    const nodes = buildHomeJsonLd();
    const org = nodes.find((n) => n["@type"] === "Organization") as
      | JsonLdNode
      | undefined;

    expect(Array.isArray(org?.sameAs)).toBe(true);
  });
});
