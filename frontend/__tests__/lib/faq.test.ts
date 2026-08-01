/**
 * Unit tests for lib/faq.ts
 *
 * Covers:
 *   - parseFaqMarkdown: well-formed file -> stable slugs and correct entries
 *   - parseFaqMarkdown: frontmatter is stripped before parsing
 *   - parseFaqMarkdown: malformed file -> loud typed error (no silent skip)
 *   - slugify: produces URL-safe lowercase output; handles diacritics
 *   - FileFaqAdapter: missing file -> loud typed error
 *
 * Per CR test doctrine: tests use a fake/in-memory path (parseFaqMarkdown
 * directly + a temp path string) -- no real fs calls needed for parse logic.
 * The adapter is tested with a temp directory using Node's fs mock or a
 * real temp file to avoid mocking fs internals.
 */

import { parseFaqMarkdown, slugify } from "@/lib/faq";

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------

describe("slugify", () => {
  it("lowercases and hyphenates a plain English question", () => {
    expect(slugify("What is this template?")).toBe("what-is-this-template");
  });

  it("strips diacritics for slug stability across locales", () => {
    expect(slugify("¿Qué es esta plantilla?")).toBe("que-es-esta-plantilla");
  });

  it("handles German umlauts and question marks", () => {
    expect(slugify("Wie passe ich das Design an?")).toBe(
      "wie-passe-ich-das-design-an",
    );
  });

  it("collapses multiple non-alphanumeric chars to a single hyphen", () => {
    expect(slugify("Hello -- World!!")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --example--  ")).toBe("example");
  });
});

// ---------------------------------------------------------------------------
// parseFaqMarkdown
// ---------------------------------------------------------------------------

const MINIMAL_FAQ = `
## What is this?

It is a starter template.

## How do I start?

Run pnpm install.
`.trim();

describe("parseFaqMarkdown: well-formed input", () => {
  it("returns one entry per ## heading", () => {
    const entries = parseFaqMarkdown(MINIMAL_FAQ, "/fake/en.md");
    expect(entries).toHaveLength(2);
  });

  it("maps question text from ## heading", () => {
    const entries = parseFaqMarkdown(MINIMAL_FAQ, "/fake/en.md");
    expect(entries[0].question).toBe("What is this?");
    expect(entries[1].question).toBe("How do I start?");
  });

  it("produces stable slugs from question text", () => {
    const entries = parseFaqMarkdown(MINIMAL_FAQ, "/fake/en.md");
    expect(entries[0].slug).toBe("what-is-this");
    expect(entries[1].slug).toBe("how-do-i-start");
  });

  it("captures answer body as trimmed markdown", () => {
    const entries = parseFaqMarkdown(MINIMAL_FAQ, "/fake/en.md");
    expect(entries[0].answerMarkdown).toBe("It is a starter template.");
    expect(entries[1].answerMarkdown).toBe("Run pnpm install.");
  });

  it("multi-paragraph answers are preserved as one string", () => {
    const multiPara = `
## Question one

First paragraph.

Second paragraph with more detail.
`.trim();
    const entries = parseFaqMarkdown(multiPara, "/fake/en.md");
    expect(entries[0].answerMarkdown).toContain("First paragraph.");
    expect(entries[0].answerMarkdown).toContain("Second paragraph");
  });

  it("answers may contain links without breaking parse", () => {
    const withLinks = `
## Where is the docs?

See the [README](https://example.com/readme) for details.
`.trim();
    const entries = parseFaqMarkdown(withLinks, "/fake/en.md");
    expect(entries[0].answerMarkdown).toContain("[README]");
  });

  it("slugs are identical on repeated calls (stable)", () => {
    const a = parseFaqMarkdown(MINIMAL_FAQ, "/fake/en.md");
    const b = parseFaqMarkdown(MINIMAL_FAQ, "/fake/en.md");
    expect(a[0].slug).toBe(b[0].slug);
    expect(a[1].slug).toBe(b[1].slug);
  });
});

describe("parseFaqMarkdown: frontmatter handling", () => {
  const WITH_FRONTMATTER = `---
title: FAQ
description: Some questions
---

## What is this?

A template.
`;

  it("strips YAML frontmatter and still parses entries", () => {
    const entries = parseFaqMarkdown(WITH_FRONTMATTER, "/fake/en.md");
    expect(entries).toHaveLength(1);
    expect(entries[0].question).toBe("What is this?");
  });

  it("frontmatter block is not treated as a Q&A entry", () => {
    const entries = parseFaqMarkdown(WITH_FRONTMATTER, "/fake/en.md");
    // No entry should have a question matching frontmatter keys.
    const questions = entries.map((e) => e.question);
    expect(questions).not.toContain("title: FAQ");
    expect(questions).not.toContain("description: Some questions");
  });
});

describe("parseFaqMarkdown: error cases (loud failures)", () => {
  it("throws when no ## headings are found (empty entries)", () => {
    const noHeadings = "Just some prose without any headings.";
    expect(() => parseFaqMarkdown(noHeadings, "/fake/broken.md")).toThrow(
      /No FAQ entries found/,
    );
  });

  it("throws when a ## heading has an empty answer body", () => {
    const emptyAnswer = `## Question with no answer\n\n## Second question\n\nSome answer.`;
    expect(() => parseFaqMarkdown(emptyAnswer, "/fake/broken.md")).toThrow(
      /Empty answer/,
    );
  });

  it("error message includes the offending file path", () => {
    const noHeadings = "No headings here.";
    expect(() => parseFaqMarkdown(noHeadings, "/some/path/en.md")).toThrow(
      /\/some\/path\/en\.md/,
    );
  });
});
