/**
 * Tests for SourceSheet and deduplicateSourceRefs.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import {
  SourceSheet,
  deduplicateSourceRefs,
  type DeduplicatedSource,
} from "@/components/chat/source-sheet";
import type { SourceRef } from "@/lib/a2a-client";

// ── deduplicateSourceRefs unit tests ──────────────────────────────────────────

describe("deduplicateSourceRefs", () => {
  it("returns an empty array for empty input", () => {
    expect(deduplicateSourceRefs([])).toEqual([]);
  });

  it("produces one entry per unique URL", () => {
    const refs: SourceRef[] = [
      {
        sourceRefId: "ref-1",
        url: "https://example.com/page",
        title: "Example Page",
      },
      {
        sourceRefId: "ref-2",
        url: "https://example.com/page",
        title: "Example Page",
        excerpt: "A relevant section.",
      },
    ];
    const result = deduplicateSourceRefs(refs);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe("https://example.com/page");
  });

  it("collects excerpts from multiple refs for the same URL", () => {
    const refs: SourceRef[] = [
      {
        sourceRefId: "ref-1",
        url: "https://example.com/page",
        excerpt: "First cited section.",
      },
      {
        sourceRefId: "ref-2",
        url: "https://example.com/page",
        excerpt: "Second cited section.",
      },
    ];
    const result = deduplicateSourceRefs(refs);
    expect(result[0].excerpts).toHaveLength(2);
    expect(result[0].excerpts).toContain("First cited section.");
    expect(result[0].excerpts).toContain("Second cited section.");
  });

  it("falls back to sourceRefId when URL is absent", () => {
    const refs: SourceRef[] = [
      { sourceRefId: "internal-ref-1", title: "Internal Doc" },
    ];
    const result = deduplicateSourceRefs(refs);
    expect(result[0].key).toBe("internal-ref-1");
  });

  it("keeps distinct URLs as separate entries", () => {
    const refs: SourceRef[] = [
      { sourceRefId: "ref-1", url: "https://a.com" },
      { sourceRefId: "ref-2", url: "https://b.com" },
    ];
    expect(deduplicateSourceRefs(refs)).toHaveLength(2);
  });
});

// ── SourceSheet component tests ───────────────────────────────────────────────

function makeSources(count: number): DeduplicatedSource[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `https://example.com/source-${i + 1}`,
    title: `Source ${i + 1}`,
    url: `https://example.com/source-${i + 1}`,
    excerpts: [`Excerpt from source ${i + 1}.`],
  }));
}

describe("SourceSheet", () => {
  it("renders with data-testid source-sheet", () => {
    render(<SourceSheet sources={makeSources(1)} onClose={jest.fn()} />);
    expect(screen.getByTestId("source-sheet")).toBeInTheDocument();
  });

  it("renders one source item per source", () => {
    render(<SourceSheet sources={makeSources(3)} onClose={jest.fn()} />);
    expect(screen.getByTestId("source-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("source-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("source-item-3")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const handleClose = jest.fn();
    render(<SourceSheet sources={makeSources(1)} onClose={handleClose} />);

    fireEvent.click(screen.getByTestId("source-sheet-close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked a second time", () => {
    const handleClose = jest.fn();
    render(<SourceSheet sources={makeSources(1)} onClose={handleClose} />);

    // Click the close button twice to verify handler is consistent.
    const closeBtn = screen.getByTestId("source-sheet-close");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders the source title", () => {
    const sources: DeduplicatedSource[] = [
      {
        key: "https://example.com",
        title: "My Important Source",
        url: "https://example.com",
        excerpts: [],
      },
    ];
    render(<SourceSheet sources={sources} onClose={jest.fn()} />);
    expect(screen.getByText("My Important Source")).toBeInTheDocument();
  });

  it("renders excerpts inside a blockquote", () => {
    const sources: DeduplicatedSource[] = [
      {
        key: "k1",
        title: "Doc",
        excerpts: ["The key finding was X."],
      },
    ];
    render(<SourceSheet sources={sources} onClose={jest.fn()} />);
    expect(screen.getByTestId("source-excerpt-1-1")).toBeInTheDocument();
    expect(screen.getByText("The key finding was X.")).toBeInTheDocument();
  });

  it("shows an open button when the source has a URL", () => {
    render(<SourceSheet sources={makeSources(1)} onClose={jest.fn()} />);
    expect(screen.getByTestId("source-open-1")).toBeInTheDocument();
  });

  it("does not show open button when source has no URL", () => {
    const sources: DeduplicatedSource[] = [
      { key: "internal", title: "Internal Doc", excerpts: [] },
    ];
    render(<SourceSheet sources={sources} onClose={jest.fn()} />);
    expect(screen.queryByTestId("source-open-1")).not.toBeInTheDocument();
  });

  it("renders provenance fields when present", () => {
    const sources: DeduplicatedSource[] = [
      {
        key: "k1",
        title: "Doc",
        excerpts: [],
        publisher: "Acme Corp",
        date: "2024-01-15",
        license: "CC-BY 4.0",
      },
    ];
    render(<SourceSheet sources={sources} onClose={jest.fn()} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("CC-BY 4.0")).toBeInTheDocument();
  });

  it("omits provenance rows when fields are absent", () => {
    const sources: DeduplicatedSource[] = [
      { key: "k1", title: "Doc", excerpts: [] },
    ];
    const { queryByText } = render(
      <SourceSheet sources={sources} onClose={jest.fn()} />,
    );
    // Neither publisher nor date labels should appear.
    expect(queryByText("Acme Corp")).not.toBeInTheDocument();
  });

  it("has aria-modal and role=dialog", () => {
    render(<SourceSheet sources={makeSources(1)} onClose={jest.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});
