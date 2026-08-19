/**
 * lib/faq.ts -- FAQ seam: interface + file adapter.
 *
 * One curated Markdown file per locale powers three consumers:
 *   1. The /faq page (static render per locale).
 *   2. FAQPage JSON-LD (schema.org structured data for AI/search crawlers).
 *   3. Agent corpus seed (future platform-side ingestion of content/faq/).
 *
 * FILE FORMAT (content/faq/{locale}.md):
 *   Optional YAML frontmatter (title, description), then repeated blocks of:
 *     ## Question text
 *     Answer body (markdown, may include links)
 *
 * PARSE CONTRACT:
 *   - Each ## heading is a question. The body between it and the next ##
 *     (or end of file) is the answer in raw Markdown.
 *   - Frontmatter is stripped before parsing; it is not an FAQ entry.
 *   - Slugs are derived by slugifying the question text and are stable across
 *     re-renders as long as question text does not change.
 *   - A malformed file (e.g., no ## headings found, file unreadable) is a
 *     hard build error -- the adapter throws with the offending file + context.
 *
 * PORT / ADAPTER PATTERN:
 *   - FaqSource is the interface (port). Components depend only on this.
 *   - FileFaqAdapter is the production file-system implementation.
 *   - Tests supply a fake implementation without touching the FS.
 *
 * SERVER-SIDE ONLY: fs/path imports are Node-only. This module is used only
 * in Server Components and at build time; never import from a client component.
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single parsed FAQ entry. */
export interface FaqEntry {
  /** URL-safe slug derived from the question text. Stable while text is unchanged. */
  slug: string;
  /** The question text (the ## heading without the # prefix). */
  question: string;
  /** The answer body in raw Markdown (may contain links and inline formatting). */
  answerMarkdown: string;
}

/** Port: the minimal interface components depend on. */
export interface FaqSource {
  /**
   * Return all FAQ entries for the given locale.
   * Throws a descriptive error if the locale file is missing or malformed.
   */
  list(locale: string): FaqEntry[];
}

// ---------------------------------------------------------------------------
// Slug helper
// ---------------------------------------------------------------------------

/**
 * Convert a question string to a URL-safe, lowercase slug.
 * Strips leading/trailing whitespace, lowercases, replaces runs of
 * non-alphanumeric characters (including diacritics) with hyphens.
 *
 * Examples:
 *   "What is this template?"  -> "what-is-this-template"
 *   "¿Qué es esta plantilla?" -> "que-es-esta-plantilla"
 *   "Wie passe ich das an?"   -> "wie-passe-ich-das-an"
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .replace(/[^a-z0-9]+/g, "-") // non-alphanum -> hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

/**
 * Parse the Markdown content of a FAQ file into an ordered list of entries.
 * Frontmatter (--- ... ---) is stripped before parsing.
 *
 * @param source  Raw file contents.
 * @param filePath  Absolute path shown in error messages.
 * @returns Ordered list of FaqEntry objects.
 * @throws Error with file path and context if parsing fails.
 */
export function parseFaqMarkdown(source: string, filePath: string): FaqEntry[] {
  let content = source;

  // Strip YAML frontmatter if present.
  if (content.trimStart().startsWith("---")) {
    const rest = content.trimStart().slice(3);
    const closeIdx = rest.indexOf("\n---");
    if (closeIdx !== -1) {
      content = rest.slice(closeIdx + 4);
    } else {
      // Unclosed frontmatter -- treat entire file as body.
      // This is permissive; a missing close is unusual but not fatal.
      content = rest;
    }
  }

  const entries: FaqEntry[] = [];
  const lines = content.split("\n");
  let currentQuestion: string | null = null;
  let currentAnswerLines: string[] = [];
  let questionLineNumber = 0;

  const flushEntry = (nextLineNumber: number) => {
    if (currentQuestion === null) return;
    const answerMarkdown = currentAnswerLines.join("\n").trim();
    if (!answerMarkdown) {
      throw new Error(
        `[faq] Empty answer for question "${currentQuestion}" ` +
          `at line ${questionLineNumber} in ${filePath}. ` +
          `Each ## heading must be followed by a non-empty answer body.`,
      );
    }
    entries.push({
      slug: slugify(currentQuestion),
      question: currentQuestion,
      answerMarkdown,
    });
    currentQuestion = null;
    currentAnswerLines = [];
    void nextLineNumber; // parameter retained for potential future use
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      flushEntry(i + 1);
      currentQuestion = h2Match[1].trim();
      questionLineNumber = i + 1;
    } else if (currentQuestion !== null) {
      currentAnswerLines.push(line);
    }
    // Lines before the first ## heading are ignored (part of frontmatter area
    // or introductory prose not meant to be an entry).
  }

  // Flush the last entry.
  flushEntry(lines.length);

  if (entries.length === 0) {
    throw new Error(
      `[faq] No FAQ entries found in ${filePath}. ` +
        `The file must contain at least one ## heading followed by an answer.`,
    );
  }

  return entries;
}

// ---------------------------------------------------------------------------
// File adapter (production)
// ---------------------------------------------------------------------------

/**
 * Absolute path to the content/faq/ directory (one level above frontend/).
 *
 * The Next.js build runs with cwd = frontend/. Jest (make test-frontend)
 * runs with cwd = cr-starter/ (repo root). We probe both candidate paths
 * at module load time and use whichever exists, failing loudly if neither
 * does. This avoids import.meta.url (not available in Jest's CommonJS mode)
 * and avoids hardcoded __dirname magic that may differ across bundler phases.
 */
function resolveContentFaqDir(): string {
  // Candidate 1: cwd is the repo root (Jest via `make test-frontend`).
  const fromRoot = path.resolve(process.cwd(), "content/faq");
  if (fs.existsSync(fromRoot)) return fromRoot;

  // Candidate 2: cwd is frontend/ (Next.js build, `pnpm run build`).
  const fromFrontend = path.resolve(process.cwd(), "../content/faq");
  if (fs.existsSync(fromFrontend)) return fromFrontend;

  // Return the root-relative candidate so error messages are meaningful
  // when the directory is genuinely missing.
  return fromRoot;
}

const CONTENT_FAQ_DIR = resolveContentFaqDir();

/**
 * Production FaqSource: reads from content/faq/{locale}.md at build time.
 *
 * Uses Node.js `fs` -- server-side only.
 */
export class FileFaqAdapter implements FaqSource {
  private readonly contentDir: string;

  constructor(contentDir: string = CONTENT_FAQ_DIR) {
    this.contentDir = contentDir;
  }

  list(locale: string): FaqEntry[] {
    const filePath = path.join(this.contentDir, `${locale}.md`);
    let raw: string;
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      throw new Error(
        `[faq] Could not read FAQ file for locale "${locale}" at ${filePath}. ` +
          `Ensure content/faq/${locale}.md exists.`,
        { cause: err },
      );
    }
    return parseFaqMarkdown(raw, filePath);
  }
}

/** Singleton adapter for production use. */
export const fileFaqAdapter: FaqSource = new FileFaqAdapter();
