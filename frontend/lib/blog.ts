/**
 * lib/blog.ts -- Blog seam: interface + file adapter.
 *
 * One Markdown file per post and language in the configured content directory
 * (content/posts/ by default) powers three consumers:
 *   1. The /blog page (listing all posts, sorted by date desc).
 *   2. The /blog/[slug] page (individual post with full metadata).
 *   3. BlogPosting JSON-LD (schema.org structured data for AI/search crawlers).
 *
 * FILE FORMAT ({contentDir}/{slug}[.{locale}].md):
 *   YAML frontmatter (REQUIRED):
 *     ---
 *     title: "Post title"
 *     author: "Author name"
 *     date: "2026-07-15"
 *     image: "/images/blog/post-hero.jpg"  (optional)
 *     excerpt: "Short description for listing cards." (optional)
 *     series: 5                              (optional; enables ordering + prefix)
 *     featured: true                         (optional; promotes to Featured section)
 *     songTitle: "..."                       (optional; media/playlist footer)
 *     songArtist: "..."                      (optional; media/playlist footer)
 *     songYear: "2026"                       (optional; media/playlist footer)
 *     songUrl: "https://..."                 (optional; media/playlist link)
 *   A language-specific post uses a locale suffix, for example
 *   content/posts/getting-started.en.md and content/posts/getting-started.es.md.
 *   The locale is part of the filename, not an i18n message bundle. A post
 *   without a locale suffix is shared by every language as a fallback.
 *     ---
 *   Body in Markdown (the post content).
 *
 * PARSE CONTRACT:
 *   - Frontmatter MUST contain title + date. Missing fields cause a build error.
 *   - The slug is the filename without the .md extension and optional locale suffix.
 *   - Posts are sorted by date descending in listing views.
 *   - Body content is raw Markdown, rendered by consuming components.
 *
 * PORT / ADAPTER PATTERN:
 *   - BlogSource is the interface (port). Components depend only on this.
 *   - FileBlogAdapter is the production file-system implementation.
 *   - Tests supply a fake implementation without touching the FS.
 *
 * SERVER-SIDE ONLY: fs/path imports are Node-only. This module is used only
 * in Server Components and at build time; never import from a client component.
 */

import * as fs from "fs";
import * as path from "path";
import { blogContentDir } from "@/blog.config.mjs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Parsed frontmatter from a blog post. */
export interface BlogFrontmatter {
  title: string;
  author: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Optional hero image path (relative to frontend/public/). */
  image?: string;
  /** Optional excerpt for listing cards. Falls back to first 200 chars. */
  excerpt?: string;
  /**
   * Optional series position. When present, listings can order posts by this
   * number (ascending) and show a zero-padded prefix (e.g. "05").
   */
  series?: number;
  /**
   * Optional "featured" flag. When `featured: true` in frontmatter, the post
   * appears in the Featured section of the blog index (larger card) instead of
   * the all-posts grid. Absent/false posts render in the all-posts grid.
   */
  featured?: boolean;
  /** Locale selected by a filename suffix such as `.es.md`. */
  locale?: string;
  /** Optional media metadata for a post-specific playlist or footer. */
  songTitle?: string;
  songArtist?: string;
  songYear?: string;
  songUrl?: string;
}

/** A single parsed blog post (standalone page). */
export interface BlogPost extends BlogFrontmatter {
  /** URL-safe slug derived from the filename. */
  slug: string;
  /** The body in raw Markdown. */
  bodyMarkdown: string;
}

/** Port: the minimal interface components depend on. */
export interface BlogSource {
  /**
   * Return all blog posts, sorted by date descending (newest first).
   * Throws a descriptive error if the content directory is missing or
   * any file is malformed.
   */
  list(locale?: string): BlogPost[];
  /**
   * Return a single blog post by slug.
   * Returns null if no post exists for that slug.
   */
  get(slug: string, locale?: string): BlogPost | null;
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

interface RawFrontmatter {
  [key: string]: string | undefined;
}

/**
 * Parse YAML-style frontmatter (the --- delimited block at the top of
 * a Markdown file). Returns a flat key-value map. Simple parser only --
 * does NOT handle YAML nesting, lists, or complex types (not needed for
 * the blog contract).
 */
function parseFrontmatterBlock(fmBlock: string): RawFrontmatter {
  const result: RawFrontmatter = {};
  const lines = fmBlock.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();
    // Strip surrounding quotes; unescape \" and \\ inside double-quoted values.
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

/**
 * Extract and validate frontmatter from raw file content.
 * Returns [frontmatter, body] on success, throws with file context on failure.
 */
function extractFrontmatter(
  source: string,
  filePath: string,
): [BlogFrontmatter, string] {
  const trimmed = source.trimStart();
  if (!trimmed.startsWith("---")) {
    throw new Error(
      `[blog] Missing frontmatter in ${filePath}. ` +
        `Blog posts must start with a --- YAML block containing title and date.`,
    );
  }

  const afterOpening = trimmed.slice(3);
  const closeIdx = afterOpening.indexOf("\n---");
  if (closeIdx === -1) {
    throw new Error(
      `[blog] Unclosed frontmatter in ${filePath}. ` +
        `The opening --- must have a matching closing ---.`,
    );
  }

  const fmBlock = afterOpening.slice(0, closeIdx);
  const body = afterOpening.slice(closeIdx + 4).trim();
  const raw = parseFrontmatterBlock(fmBlock);

  if (!raw.title || !raw.title.trim()) {
    throw new Error(
      `[blog] Missing required "title" in frontmatter of ${filePath}.`,
    );
  }
  if (!raw.date || !raw.date.trim()) {
    throw new Error(
      `[blog] Missing required "date" in frontmatter of ${filePath}.`,
    );
  }

  // Validate date format (YYYY-MM-DD).
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) {
    throw new Error(
      `[blog] Invalid date format "${raw.date}" in ${filePath}. ` +
        `Expected YYYY-MM-DD.`,
    );
  }

  const seriesRaw = raw.series?.trim();
  const series =
    seriesRaw && /^\d+$/.test(seriesRaw) ? Number(seriesRaw) : undefined;

  const featured = raw.featured?.trim().toLowerCase() === "true";

  return [
    {
      title: raw.title.trim(),
      author: (raw.author || "Unknown").trim(),
      date: raw.date.trim(),
      image: raw.image?.trim() || undefined,
      excerpt: raw.excerpt?.trim() || undefined,
      series,
      featured,
      locale: raw.locale?.trim() || undefined,
      songTitle: raw.songTitle?.trim() || undefined,
      songArtist: raw.songArtist?.trim() || undefined,
      songYear: raw.songYear?.trim() || undefined,
      songUrl: raw.songUrl?.trim() || undefined,
    },
    body,
  ];
}

/**
 * Parse a single blog post file into a BlogPost.
 *
 * @param source   Raw file contents.
 * @param slug    The URL slug (filename without .md or its locale suffix).
 * @param filePath  Absolute path for error messages.
 * @param locale   Optional locale from the filename, e.g. `es`.
 */
export function parseBlogPost(
  source: string,
  slug: string,
  filePath: string,
  locale?: string,
): BlogPost {
  const [fm, body] = extractFrontmatter(source, filePath);
  return {
    ...fm,
    slug,
    bodyMarkdown: body,
    locale: locale ?? fm.locale,
  };
}

// ---------------------------------------------------------------------------
// File adapter (production)
// ---------------------------------------------------------------------------

/**
 * Resolve the configured Markdown directory, probing both repository-root and
 * frontend working directories. The configured value is frontend-relative,
 * so a fork can choose content/posts, content/blog, or another collection.
 */
function resolveContentDir(): string {
  const configured = blogContentDir();
  const candidates = [
    path.resolve(process.cwd(), configured),
    path.resolve(process.cwd(), "frontend", configured),
    path.resolve(process.cwd(), "..", configured),
  ];
  return (
    candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0]
  );
}

const CONTENT_DIR = resolveContentDir();

/**
 * Production BlogSource: reads from the configured
 * `{contentDir}/{slug}[.{locale}].md` directory at build time.
 *
 * Uses Node.js `fs` -- server-side only.
 */
export class FileBlogAdapter implements BlogSource {
  private readonly contentDir: string;

  constructor(contentDir: string = CONTENT_DIR) {
    this.contentDir = contentDir;
  }

  list(locale?: string): BlogPost[] {
    if (!fs.existsSync(this.contentDir)) {
      throw new Error(
        `[blog] Configured post content directory not found at ${this.contentDir}. ` +
          `Create the configured Markdown directory (${blogContentDir()}/) and add .md files for each post.`,
      );
    }

    const files = fs
      .readdirSync(this.contentDir)
      .filter((f) => f.endsWith(".md"));
    const posts = files.map((f) => {
      const stem = f.replace(/\.md$/, "");
      const localeSuffix = /^(.*)\.([a-z]{2}(?:-[A-Z]{2})?)$/i.exec(stem);
      const slug = localeSuffix?.[1] || stem;
      const fileLocale = localeSuffix?.[2];
      const filePath = path.join(this.contentDir, f);
      let raw: string;
      try {
        raw = fs.readFileSync(filePath, "utf-8");
      } catch (err) {
        throw new Error(`[blog] Could not read blog post at ${filePath}.`, {
          cause: err,
        });
      }
      return parseBlogPost(raw, slug, filePath, fileLocale);
    });

    // A locale-specific file wins over a shared fallback with the same slug.
    // This lets a fork start with one shared Markdown post and translate only
    // the languages it needs without creating duplicate cards or routes.
    const filtered = locale
      ? posts.filter((post) => {
          if (post.locale === locale) return true;
          if (post.locale) return false;
          return !posts.some(
            (candidate) =>
              candidate.slug === post.slug && candidate.locale === locale,
          );
        })
      : posts;

    // Sort by date descending (newest first).
    filtered.sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });

    return filtered;
  }

  get(slug: string, locale?: string): BlogPost | null {
    const posts = this.list(locale).filter((post) => post.slug === slug);
    if (posts.length === 0) return null;
    return posts.find((post) => post.locale === locale) ?? posts[0];
  }
}

/** Singleton adapter for production use. */
export const fileBlogAdapter: BlogSource = new FileBlogAdapter();
