/**
 * Unit tests for lib/site-content-source.ts
 *
 * Covers:
 *   - FakeSiteContentSource: in-memory strings + longForm, honest null miss.
 *   - FileSiteContentSource.strings(): reads the site message slice subtree
 *     per locale, en fallback for absent locale, empty object for unknown page.
 *   - FileSiteContentSource.longForm(): reads content/site/<page>.<locale>.md,
 *     strips frontmatter, renders Markdown to HTML; returns null when absent.
 *
 * Per CR test doctrine, the Fake carries the pure behavior; the File adapter
 * is exercised against the real fixture (content/site/about.en.md) plus a
 * temp directory for the miss/render cases -- no fs mocking.
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import {
  FakeSiteContentSource,
  FileSiteContentSource,
  type SiteDoc,
} from "@/lib/site-content-source";

// ---------------------------------------------------------------------------
// FakeSiteContentSource
// ---------------------------------------------------------------------------

describe("FakeSiteContentSource", () => {
  it("returns seeded strings for the requested locale", () => {
    const fake = new FakeSiteContentSource({
      strings: {
        impressum: {
          en: { title: "Legal Notice" },
          de: { title: "Impressum" },
        },
      },
    });
    expect(fake.strings("impressum", "de")).toEqual({ title: "Impressum" });
    expect(fake.strings("impressum", "en")).toEqual({ title: "Legal Notice" });
  });

  it("falls back to en strings when the locale is unseeded", () => {
    const fake = new FakeSiteContentSource({
      strings: { home: { en: { cta: "Go" } } },
    });
    expect(fake.strings("home", "es")).toEqual({ cta: "Go" });
  });

  it("returns an empty object for an unknown page", () => {
    const fake = new FakeSiteContentSource();
    expect(fake.strings("nope", "en")).toEqual({});
  });

  it("returns the seeded long-form doc", async () => {
    const doc: SiteDoc = { html: "<p>hello</p>" };
    const fake = new FakeSiteContentSource({ longForm: { "about.en": doc } });
    await expect(fake.longForm("about", "en")).resolves.toEqual(doc);
  });

  it("returns null (honest miss) for an absent long-form doc", async () => {
    const fake = new FakeSiteContentSource();
    await expect(fake.longForm("about", "de")).resolves.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// FileSiteContentSource.strings() -- reads the site message slice
// ---------------------------------------------------------------------------

describe("FileSiteContentSource.strings", () => {
  const source = new FileSiteContentSource();

  it("reads a page subtree from the site message slice", () => {
    const impressum = source.strings("impressum", "en");
    expect(impressum.title).toBe("Impressum");
    expect((impressum.legal as Record<string, unknown>).notice).toBe(
      "Legal Notice",
    );
  });

  it("reads locale-specific copy from the matching slice", () => {
    expect(source.strings("footer", "de")).toMatchObject({
      privacy: "Datenschutzerklärung",
    });
  });

  it("falls back to the en slice for an unknown locale", () => {
    expect(source.strings("footer", "xx")).toMatchObject({
      privacy: "Privacy Policy",
    });
  });

  it("returns an empty object for a non-site page namespace", () => {
    // `auth` lives in the app slice, not site -> not exposed here.
    expect(source.strings("auth", "en")).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// FileSiteContentSource.longForm() -- reads content/site/<page>.<locale>.md
// ---------------------------------------------------------------------------

describe("FileSiteContentSource.longForm", () => {
  it("renders the shipped about.en.md fixture to HTML", async () => {
    const source = new FileSiteContentSource();
    const doc = await source.longForm("about", "en");
    expect(doc).not.toBeNull();
    // Frontmatter title must NOT leak into the body.
    expect(doc!.html).not.toContain("About this template</h2>\n<h2");
    expect(doc!.html).toContain("<h2>About this template</h2>");
    // Inline markdown is rendered (bold + link).
    expect(doc!.html).toContain("<strong>site</strong>");
    expect(doc!.html).toContain('<a href="/faq">the content team</a>');
    // A subheading becomes an <h3>.
    expect(doc!.html).toContain("<h3>Editing</h3>");
  });

  it("returns null when no file exists for the page/locale", async () => {
    const source = new FileSiteContentSource();
    await expect(source.longForm("about", "zz")).resolves.toBeNull();
    await expect(source.longForm("does-not-exist", "en")).resolves.toBeNull();
  });

  it("strips frontmatter and renders paragraphs for a temp doc", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "site-content-"));
    fs.writeFileSync(
      path.join(dir, "terms.en.md"),
      "---\ntitle: Terms\n---\n\nFirst para.\n\nSecond **bold** para.\n",
    );
    const source = new FileSiteContentSource(dir);
    const doc = await source.longForm("terms", "en");
    expect(doc).not.toBeNull();
    expect(doc!.html).not.toContain("title: Terms");
    expect(doc!.html).toBe("<p>First para.</p>\n<p>Second <strong>bold</strong> para.</p>");
  });
});
