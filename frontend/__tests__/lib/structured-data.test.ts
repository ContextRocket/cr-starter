/**
 * Unit tests for lib/structured-data.ts.
 *
 * Verifies that JSON-LD payloads read from site.config and produce
 * schema.org Organization + WebSite nodes with required fields.
 * No browser / React / DOM required.
 */

import {
  buildHomeJsonLd,
  buildPodcastSeriesJsonLd,
  buildServiceJsonLd,
  buildHowToJsonLd,
  getPrimaryServiceId,
  serializeJsonLd,
  type JsonLdNode,
} from "@/lib/structured-data";
import { siteConfig } from "@/config/site.config";

const ORIGIN = siteConfig.siteUrl.replace(/\/$/, "");

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

  it("Organization sameAs is omitted when no social URL is configured", () => {
    const nodes = buildHomeJsonLd();
    const org = nodes.find((n) => n["@type"] === "Organization") as
      | JsonLdNode
      | undefined;

    // The base config ships blank social URLs, so sameAs is omitted entirely
    // (never a fabricated placeholder). When populated it is a string[].
    if (org && "sameAs" in org) {
      expect(Array.isArray(org.sameAs)).toBe(true);
      expect((org.sameAs as string[]).length).toBeGreaterThan(0);
    }
  });

  it("Organization logo is an ImageObject with an absolute URL", () => {
    const nodes = buildHomeJsonLd();
    const org = nodes.find((n) => n["@type"] === "Organization") as
      | JsonLdNode
      | undefined;
    const logo = org?.logo as JsonLdNode | undefined;

    expect(logo?.["@type"]).toBe("ImageObject");
    expect(logo?.url as string).toContain(
      siteConfig.siteUrl.replace(/\/$/, ""),
    );
    expect(logo?.url as string).toContain(siteConfig.assets.logo);
  });
});

describe("buildPodcastSeriesJsonLd", () => {
  const series = {
    name: "The Show",
    description: "A podcast about things.",
    url: `${ORIGIN}/podcast`,
    webFeedUrl: `${ORIGIN}/podcast/rss.xml`,
    imageUrl: "/podcast-cover.png",
    sameAs: ["https://open.spotify.com/show/abc", ""],
  };
  const episodes = [
    {
      name: "Episode 1",
      url: `${ORIGIN}/podcast/ep-1`,
      datePublished: "2026-01-15",
      description: "The first one.",
      duration: "PT42M13S",
      audioUrl: "https://cdn.example.com/ep-1.mp3",
    },
    {
      name: "Episode 2",
      url: `${ORIGIN}/podcast/ep-2`,
    },
  ];

  it("returns null when no series is supplied", () => {
    expect(buildPodcastSeriesJsonLd(null)).toBeNull();
    expect(buildPodcastSeriesJsonLd(undefined)).toBeNull();
  });

  it("emits a PodcastSeries anchored to the Organization publisher", () => {
    const node = buildPodcastSeriesJsonLd(series, episodes)!;
    expect(node["@type"]).toBe("PodcastSeries");
    expect(node["@id"]).toBe(`${series.url}#podcast-series`);
    expect(node.name).toBe("The Show");
    expect(node.webFeed).toBe(series.webFeedUrl);
    expect(node.publisher).toEqual({ "@id": `${ORIGIN}/#organization` });
  });

  it("absolute-izes a root-relative cover image", () => {
    const node = buildPodcastSeriesJsonLd(series, episodes)!;
    expect(node.image).toBe(`${ORIGIN}/podcast-cover.png`);
  });

  it("filters blank sameAs entries and emits the rest", () => {
    const node = buildPodcastSeriesJsonLd(series, episodes)!;
    expect(node.sameAs).toEqual(["https://open.spotify.com/show/abc"]);
  });

  it("omits sameAs entirely when none configured", () => {
    const node = buildPodcastSeriesJsonLd(
      { name: "S", url: `${ORIGIN}/p` },
      [],
    )!;
    expect("sameAs" in node).toBe(false);
  });

  it("builds one PodcastEpisode per episode with a partOfSeries back-ref", () => {
    const node = buildPodcastSeriesJsonLd(series, episodes)!;
    const eps = node.episode as JsonLdNode[];
    expect(eps).toHaveLength(2);
    expect(eps[0]["@type"]).toBe("PodcastEpisode");
    expect((eps[0].partOfSeries as JsonLdNode)["@id"]).toBe(
      `${series.url}#podcast-series`,
    );
  });

  it("carries an ISO 8601 duration and AudioObject when audio is present", () => {
    const node = buildPodcastSeriesJsonLd(series, episodes)!;
    const eps = node.episode as JsonLdNode[];
    expect(eps[0].duration).toBe("PT42M13S");
    const audio = eps[0].associatedMedia as JsonLdNode;
    expect(audio["@type"]).toBe("AudioObject");
    expect(audio.contentUrl).toBe("https://cdn.example.com/ep-1.mp3");
    expect(audio.duration).toBe("PT42M13S");
    // `audio` alias points at the same media object.
    expect(eps[0].audio).toEqual(audio);
  });

  it("omits optional episode fields when absent", () => {
    const node = buildPodcastSeriesJsonLd(series, episodes)!;
    const eps = node.episode as JsonLdNode[];
    expect("datePublished" in eps[1]).toBe(false);
    expect("duration" in eps[1]).toBe(false);
    expect("associatedMedia" in eps[1]).toBe(false);
    expect("audio" in eps[1]).toBe(false);
  });

  it("emits the series even with no episodes (omits episode array)", () => {
    const node = buildPodcastSeriesJsonLd(
      { name: "S", url: `${ORIGIN}/p` },
      [],
    )!;
    expect("episode" in node).toBe(false);
  });
});

describe("buildServiceJsonLd", () => {
  it("returns null when no service or no name is supplied", () => {
    expect(buildServiceJsonLd(null)).toBeNull();
    expect(buildServiceJsonLd(undefined)).toBeNull();
    expect(
      buildServiceJsonLd({ name: "" } as unknown as { name: string }),
    ).toBeNull();
  });

  it("emits a Service anchored to the Organization provider", () => {
    const node = buildServiceJsonLd({
      name: "Consulting",
      description: "We consult.",
      url: `${ORIGIN}/pricing`,
      areaServed: "Worldwide",
    })!;
    expect(node["@type"]).toBe("Service");
    expect(node.name).toBe("Consulting");
    expect(node.provider).toEqual({ "@id": `${ORIGIN}/#organization` });
    expect(node.areaServed).toBe("Worldwide");
  });

  it("uses the canonical PRIMARY-service @id (name-independent)", () => {
    // The id is derived from siteUrl, NOT the display name, so a copy edit
    // never forks the entity -- and it matches the testimonials reviewed-item id.
    const node = buildServiceJsonLd({ name: "Consulting" })!;
    expect(node["@id"]).toBe(`${ORIGIN}/#primary-service`);
    expect(node["@id"]).toBe(getPrimaryServiceId("Service"));
    // Same canonical id regardless of the display name.
    const renamed = buildServiceJsonLd({ name: "A Different Name" })!;
    expect(renamed["@id"]).toBe(node["@id"]);
  });

  it("honours the Product type override", () => {
    const node = buildServiceJsonLd({ name: "Widget", type: "Product" })!;
    expect(node["@type"]).toBe("Product");
    expect(node["@id"]).toBe(`${ORIGIN}/#primary-product`);
    expect(node["@id"]).toBe(getPrimaryServiceId("Product"));
  });

  it("maps offers to schema.org Offer with price + currency", () => {
    const node = buildServiceJsonLd({
      name: "Plans",
      offers: [
        {
          name: "Pro",
          price: 49,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${ORIGIN}/pricing#pro`,
        },
      ],
    })!;
    const offers = node.offers as JsonLdNode[];
    expect(offers).toHaveLength(1);
    expect(offers[0]).toMatchObject({
      "@type": "Offer",
      name: "Pro",
      price: 49,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${ORIGIN}/pricing#pro`,
    });
  });

  it("omits offers when none are supplied", () => {
    const node = buildServiceJsonLd({ name: "Bare" })!;
    expect("offers" in node).toBe(false);
  });
});

describe("buildHowToJsonLd", () => {
  it("returns null when no howto, no name, or no steps", () => {
    expect(buildHowToJsonLd(null)).toBeNull();
    expect(buildHowToJsonLd(undefined)).toBeNull();
    expect(buildHowToJsonLd({ name: "X", steps: [] })).toBeNull();
    expect(
      buildHowToJsonLd({ name: "", steps: [{ name: "a", text: "b" }] }),
    ).toBeNull();
  });

  it("emits a HowTo with positioned HowToStep nodes", () => {
    const node = buildHowToJsonLd({
      name: "How it works",
      description: "Three easy steps.",
      steps: [
        { name: "Add sources", text: "Point us at your site." },
        { name: "We build", text: "We reify the graph.", imageUrl: "/s2.png" },
        { name: "Ship", text: "Answer engines read it.", url: `${ORIGIN}/x` },
      ],
    })!;
    expect(node["@type"]).toBe("HowTo");
    expect(node.name).toBe("How it works");
    expect(node.description).toBe("Three easy steps.");
    const steps = node.step as JsonLdNode[];
    expect(steps).toHaveLength(3);
    expect(steps.map((s) => s.position)).toEqual([1, 2, 3]);
    expect(steps[1].image).toBe(`${ORIGIN}/s2.png`);
    expect(steps[2].url).toBe(`${ORIGIN}/x`);
  });

  it("omits per-step image/url and top-level description when absent", () => {
    const node = buildHowToJsonLd({
      name: "Two steps",
      steps: [
        { name: "One", text: "First." },
        { name: "Two", text: "Second." },
      ],
    })!;
    expect("description" in node).toBe(false);
    const steps = node.step as JsonLdNode[];
    expect("image" in steps[0]).toBe(false);
    expect("url" in steps[0]).toBe(false);
  });
});
