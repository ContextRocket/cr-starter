/**
 * lib/site-content-source.ts -- Site content seam: interface + file adapter.
 *
 * The public "site" surfaces (home, blog, faq, footer, impressum, privacy,
 * preview) draw content from two distinct sources, both owned by
 * @content-owners (see .github/CODEOWNERS + i18n/messages/site/):
 *   1. SHORT STRINGS -- labels, headings, and boilerplate that live in the
 *      i18n `site` message slice (i18n/messages/site/<locale>.ts). These are
 *      keyed by page namespace (e.g. "impressum", "privacy").
 *   2. LONG-FORM DOCS -- authored Markdown pages under content/site/ that are
 *      too large / editorial to sit in the message tree (e.g. an About page).
 *
 * This port lets page components depend on ONE seam for both, instead of
 * reaching into the message tree and the filesystem separately.
 *
 * PORT / ADAPTER PATTERN (mirrors lib/blog.ts + lib/faq.ts):
 *   - SiteContentSource is the interface (port). Components depend only on this.
 *   - FileSiteContentSource is the production file-system implementation.
 *   - FakeSiteContentSource supplies an in-memory double for tests (no FS).
 *
 * MISSING = HONEST NULL: longForm() returns null when the file is absent. The
 * site domain MAY ship a locale subset ahead of full translation, so a missing
 * non-en long-form doc is an expected, non-fatal absence -- never fabricated.
 *
 * SERVER-SIDE ONLY: fs/path imports are Node-only. This module is used only
 * in Server Components and at build time; never import from a client component.
 */

import * as fs from "fs";
import * as path from "path";

import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { siteEn } from "@/i18n/messages/site/en";
import { siteEs } from "@/i18n/messages/site/es";
import { siteDe } from "@/i18n/messages/site/de";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A rendered long-form site document. */
export interface SiteDoc {
  /** The document body rendered to a trusted HTML string. */
  html: string;
}

/** Port: the minimal interface site page components depend on. */
export interface SiteContentSource {
  /**
   * Return the short-string subtree for a given site `page` namespace and
   * `locale` (e.g. strings("impressum", "de")). Returns an empty object when
   * the page namespace does not exist in the slice -- callers decide whether
   * that is acceptable.
   */
  strings(page: string, locale: string): Record<string, unknown>;
  /**
   * Return the rendered long-form document for a given `page` and `locale`,
   * or null when no authored Markdown file exists (honest missing).
   */
  longForm(page: string, locale: string): Promise<SiteDoc | null>;
}

// ---------------------------------------------------------------------------
// Site string slices (message tree, @content-owners)
// ---------------------------------------------------------------------------

/**
 * The site i18n slice per locale. `strings()` reads the page subtree from
 * here. `en` is the fallback for locales not present in the map.
 */
const SITE_SLICES: Record<string, Record<string, unknown>> = {
  en: siteEn as unknown as Record<string, unknown>,
  es: siteEs as unknown as Record<string, unknown>,
  de: siteDe as unknown as Record<string, unknown>,
};

// ---------------------------------------------------------------------------
// Markdown -> HTML (minimal, trusted-content only)
// ---------------------------------------------------------------------------

/**
 * Strip an optional leading YAML frontmatter block (the --- delimited section
 * at the top of the file). Long-form site docs MAY carry frontmatter (title,
 * description) that is metadata, not body. Returns the body only.
 */
function stripFrontmatter(source: string): string {
  // Drop a leading UTF-8 BOM (U+FEFF) if present, then leading whitespace.
  const trimmed = source.replace(/^\uFEFF/, "").trimStart();
  if (!trimmed.startsWith("---")) return source.trim();
  const afterOpening = trimmed.slice(3);
  const closeIdx = afterOpening.indexOf("\n---");
  if (closeIdx === -1) return source.trim(); // unclosed -> treat all as body
  return afterOpening.slice(closeIdx + 4).trim();
}

/**
 * Minimal block-level Markdown -> HTML for authored (trusted) site content.
 *
 * Mirrors the block handling in the blog post page: split on blank lines,
 * treat leading `#`/`##`/`###` as headings, everything else as a paragraph,
 * and delegate inline runs (links, bold, images, code) to renderInlineMarkdown.
 * Block-level tables / lists / fenced code are intentionally out of scope --
 * add them here (not per-page) if a site doc needs them.
 *
 * TRUST: input is author-controlled content, injected downstream via
 * dangerouslySetInnerHTML; never run this over user input.
 */
function renderSiteMarkdown(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const heading = /^(#{1,3})\s+(.*)$/.exec(block);
      if (heading) {
        const level = heading[1].length;
        return `<h${level}>${renderInlineMarkdown(heading[2].trim())}</h${level}>`;
      }
      return `<p>${renderInlineMarkdown(block)}</p>`;
    })
    .join("\n");
}

// ---------------------------------------------------------------------------
// File adapter (production)
// ---------------------------------------------------------------------------

/**
 * Resolve the content/site/ directory, probing both the repo-root cwd
 * (Vitest via `make test-frontend`) and the frontend/ cwd (Next.js build).
 * Same probe strategy as lib/blog.ts + lib/faq.ts.
 */
function resolveContentSiteDir(): string {
  const fromRoot = path.resolve(process.cwd(), "content/site");
  if (fs.existsSync(fromRoot)) return fromRoot;

  const fromFrontend = path.resolve(process.cwd(), "../content/site");
  if (fs.existsSync(fromFrontend)) return fromFrontend;

  return fromRoot; // error messages reference this candidate
}

const CONTENT_SITE_DIR = resolveContentSiteDir();

/**
 * Production SiteContentSource.
 *
 * strings(): reads the page subtree from the site message slice for the locale
 *   (falling back to en when the locale slice is absent).
 * longForm(): reads content/site/<page>.<locale>.md, strips optional
 *   frontmatter, and renders the body to a trusted HTML string. Returns null
 *   when the file does not exist.
 *
 * Uses Node.js `fs` -- server-side only.
 */
export class FileSiteContentSource implements SiteContentSource {
  private readonly contentDir: string;

  constructor(contentDir: string = CONTENT_SITE_DIR) {
    this.contentDir = contentDir;
  }

  strings(page: string, locale: string): Record<string, unknown> {
    const slice = SITE_SLICES[locale] ?? SITE_SLICES.en;
    const subtree = slice[page];
    if (subtree !== null && typeof subtree === "object") {
      return subtree as Record<string, unknown>;
    }
    return {};
  }

  async longForm(page: string, locale: string): Promise<SiteDoc | null> {
    const filePath = path.join(this.contentDir, `${page}.${locale}.md`);
    if (!fs.existsSync(filePath)) return null;

    let raw: string;
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      throw new Error(
        `[site-content] Could not read long-form doc at ${filePath}.`,
        { cause: err },
      );
    }
    const body = stripFrontmatter(raw);
    return { html: renderSiteMarkdown(body) };
  }
}

/** Singleton adapter for production use. */
export const fileSiteContentSource: SiteContentSource =
  new FileSiteContentSource();

// ---------------------------------------------------------------------------
// Fake adapter (tests)
// ---------------------------------------------------------------------------

/**
 * In-memory SiteContentSource for tests. No filesystem, no message-tree
 * coupling -- callers seed both maps explicitly.
 *
 * strings map key:   page namespace -> per-locale string subtree.
 * longForm map key:   "<page>.<locale>" -> already-rendered SiteDoc.
 */
export class FakeSiteContentSource implements SiteContentSource {
  private readonly stringsByPage: Record<
    string,
    Record<string, Record<string, unknown>>
  >;
  private readonly docsByKey: Record<string, SiteDoc>;

  constructor(seed?: {
    strings?: Record<string, Record<string, Record<string, unknown>>>;
    longForm?: Record<string, SiteDoc>;
  }) {
    this.stringsByPage = seed?.strings ?? {};
    this.docsByKey = seed?.longForm ?? {};
  }

  strings(page: string, locale: string): Record<string, unknown> {
    const byLocale = this.stringsByPage[page];
    if (!byLocale) return {};
    return byLocale[locale] ?? byLocale.en ?? {};
  }

  async longForm(page: string, locale: string): Promise<SiteDoc | null> {
    return this.docsByKey[`${page}.${locale}`] ?? null;
  }
}
