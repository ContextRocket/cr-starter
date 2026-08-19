/**
 * Tests for app/[locale]/faq/page.tsx
 *
 * Covers:
 *   - Page renders FAQ entries with question text
 *   - Each entry has an anchor id matching its slug
 *   - FAQPage JSON-LD is emitted with the correct count of mainEntity items
 *   - i18n keys resolve (page title appears as a non-empty heading)
 *   - Back-to-home link is present
 *
 * Per CR test doctrine:
 *   - Assert testids/behavior + that i18n resolves, never literal copy values.
 *   - The FAQ page is a Server Component that calls fileFaqAdapter.list() per
 *     request (URL locale). We mock the adapter to keep tests hermetic.
 */

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

// Mock the FAQ adapter before importing the page, so the page uses our fake
// entries rather than reading content/faq/en.md from the filesystem.
//
// NOTE: vi.mock calls are hoisted, so we use the relative path from this
// test file rather than the @/ alias. The page imports via @/lib/faq which
// Vitest resolves to the same module -- both paths hit the same mock.
vi.mock("../../lib/faq", () => ({
  fileFaqAdapter: {
    list: () => [
      {
        slug: "what-is-this-template",
        question: "What is this template?",
        answerMarkdown: "This is a starter template for building AI products.",
      },
      {
        slug: "how-does-the-chat-work",
        question: "How does the chat agent work?",
        answerMarkdown:
          "It streams responses via the A2A protocol from ContextRocket.",
      },
      {
        slug: "where-do-answers-come-from",
        question: "Where do answers come from?",
        answerMarkdown:
          "From your organization's Context Graph in ContextRocket.",
      },
    ],
  },
  slugify: (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
  parseFaqMarkdown: vi.fn(),
  FileFaqAdapter: vi.fn(),
}));

// Import after mocking to ensure the page picks up the fake adapter.
import FaqPage from "@/app/[locale]/faq/page";

/** Render the FAQ page for a given URL locale (defaults to en). */
async function renderFaq(locale = "en") {
  return FaqPage({ params: Promise.resolve({ locale }) });
}

describe("FAQ Page", () => {
  it("renders a single h1 with the FAQ page title", async () => {
    render(await renderFaq());
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    // Assert the heading resolves to a non-empty string (i18n key resolved).
    expect(headings[0].textContent).toBeTruthy();
  });

  it("renders all FAQ entries as definition term elements", async () => {
    render(await renderFaq());
    // Each question is a <dt> with the question text as a link.
    const list = screen.getByTestId("faq-list");
    expect(list).toBeInTheDocument();
    expect(screen.getByText("What is this template?")).toBeInTheDocument();
    expect(
      screen.getByText("How does the chat agent work?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Where do answers come from?")).toBeInTheDocument();
  });

  it("each entry has an anchor id matching its slug", async () => {
    const { container } = render(await renderFaq());
    const entries = container.querySelectorAll("[data-testid^='faq-entry-']");
    expect(entries.length).toBe(3);

    const ids = Array.from(entries).map((el) => el.id);
    expect(ids).toContain("what-is-this-template");
    expect(ids).toContain("how-does-the-chat-work");
    expect(ids).toContain("where-do-answers-come-from");
  });

  it("renders answer content for each entry", async () => {
    render(await renderFaq());
    // Verify answer text appears in the document.
    expect(screen.getByText(/This is a starter template/i)).toBeInTheDocument();
  });

  it("emits FAQPage JSON-LD with the correct number of mainEntity items", async () => {
    const { container } = render(await renderFaq());
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    // Find the FAQPage node.
    let faqNode: { "@type"?: string; mainEntity?: unknown[] } | null = null;
    for (const script of Array.from(scripts)) {
      const parsed = JSON.parse(
        script.innerHTML.replaceAll("\\u003c", "<"),
      ) as { "@type"?: string; mainEntity?: unknown[] };
      if (parsed["@type"] === "FAQPage") {
        faqNode = parsed;
        break;
      }
    }

    expect(faqNode).not.toBeNull();
    expect(Array.isArray(faqNode!.mainEntity)).toBe(true);
    // Three fake entries -> three mainEntity items.
    expect(faqNode!.mainEntity!).toHaveLength(3);
  });

  it("JSON-LD mainEntity items are of type Question", async () => {
    const { container } = render(await renderFaq());
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    let faqNode: {
      "@type"?: string;
      mainEntity?: Array<{ "@type"?: string }>;
    } | null = null;
    for (const script of Array.from(scripts)) {
      const parsed = JSON.parse(
        script.innerHTML.replaceAll("\\u003c", "<"),
      ) as { "@type"?: string; mainEntity?: Array<{ "@type"?: string }> };
      if (parsed["@type"] === "FAQPage") {
        faqNode = parsed;
        break;
      }
    }
    expect(faqNode).not.toBeNull();
    for (const item of faqNode!.mainEntity!) {
      expect(item["@type"]).toBe("Question");
    }
  });

  it("renders a link back to the home page", async () => {
    render(await renderFaq());
    const backLink = screen.getByRole("link", { name: /back to home/i });
    expect(backLink).toBeInTheDocument();
    // The navigation stub renders Link hrefs as given (locale-stripped).
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("i18n keys resolve: page title and description are non-empty strings", async () => {
    render(await renderFaq());
    const main = screen.getByTestId("faq-page");
    // The title and description come from i18n keys; assert they render as non-empty.
    expect(main.textContent).toBeTruthy();
    // h1 text comes from FAQ_PAGE_TITLE key.
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent!.length).toBeGreaterThan(0);
  });
});
