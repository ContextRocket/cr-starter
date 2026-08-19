/**
 * Tests for SourceSheet and deduplicateSourceRefs.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import {
  SourceSheet,
  deduplicateSourceRefs,
  type DeduplicatedSource,
} from "@/components/shared/chat/source-sheet";
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
  it("renders with data-testid source-sheet when open", () => {
    render(
      <SourceSheet sources={makeSources(1)} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByTestId("source-sheet")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    render(
      <SourceSheet sources={makeSources(1)} open={false} onClose={vi.fn()} />,
    );
    expect(screen.queryByTestId("source-sheet")).not.toBeInTheDocument();
  });

  it("renders one source item per source", () => {
    render(
      <SourceSheet sources={makeSources(3)} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByTestId("source-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("source-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("source-item-3")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <SourceSheet
        sources={makeSources(1)}
        open={true}
        onClose={handleClose}
      />,
    );

    fireEvent.click(screen.getByTestId("source-sheet-close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed (real dialog semantics)", () => {
    const handleClose = vi.fn();
    render(
      <SourceSheet
        sources={makeSources(1)}
        open={true}
        onClose={handleClose}
      />,
    );

    fireEvent.keyDown(screen.getByTestId("source-sheet"), { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("portals out of a transformed ancestor container", () => {
    const handleClose = vi.fn();
    const { container } = render(
      <div style={{ transform: "translateY(4px)" }} data-testid="drawer-host">
        <SourceSheet
          sources={makeSources(1)}
          open={true}
          onClose={handleClose}
        />
      </div>,
    );

    // The dialog content must NOT be a descendant of the transformed host:
    // position: fixed would otherwise resolve against the transform box.
    expect(container.querySelector('[data-testid="source-sheet"]')).toBeNull();
    expect(screen.getByTestId("source-sheet")).toBeInTheDocument();
  });

  it("moves focus inside the dialog on open (focus trap entry)", () => {
    render(
      <SourceSheet sources={makeSources(1)} open={true} onClose={vi.fn()} />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
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
    render(<SourceSheet sources={sources} open={true} onClose={vi.fn()} />);
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
    render(<SourceSheet sources={sources} open={true} onClose={vi.fn()} />);
    expect(screen.getByTestId("source-excerpt-1-1")).toBeInTheDocument();
    expect(screen.getByText("The key finding was X.")).toBeInTheDocument();
  });

  it("shows an open button when the source has a safe URL", () => {
    render(
      <SourceSheet sources={makeSources(1)} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByTestId("source-open-1")).toBeInTheDocument();
  });

  it("does not show open button when source has no URL", () => {
    const sources: DeduplicatedSource[] = [
      { key: "internal", title: "Internal Doc", excerpts: [] },
    ];
    render(<SourceSheet sources={sources} open={true} onClose={vi.fn()} />);
    expect(screen.queryByTestId("source-open-1")).not.toBeInTheDocument();
  });

  it("does not show open button for javascript: URLs (safeHref guard)", () => {
    const sources: DeduplicatedSource[] = [
      {
        key: "bad",
        title: "Malicious Doc",
        url: "javascript:alert(1)",
        excerpts: [],
      },
    ];
    render(<SourceSheet sources={sources} open={true} onClose={vi.fn()} />);
    expect(screen.queryByTestId("source-open-1")).not.toBeInTheDocument();
  });

  it("does not show open button for data: URLs (safeHref guard)", () => {
    const sources: DeduplicatedSource[] = [
      {
        key: "bad",
        title: "Malicious Doc",
        url: "data:text/html,<script>alert(1)</script>",
        excerpts: [],
      },
    ];
    render(<SourceSheet sources={sources} open={true} onClose={vi.fn()} />);
    expect(screen.queryByTestId("source-open-1")).not.toBeInTheDocument();
  });

  it("never passes an unsafe URL to window.open", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const sources: DeduplicatedSource[] = [
      {
        key: "good",
        title: "Safe Doc",
        url: "https://example.com/doc",
        excerpts: [],
      },
    ];
    render(<SourceSheet sources={sources} open={true} onClose={vi.fn()} />);

    fireEvent.click(screen.getByTestId("source-open-1"));
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/doc",
      "_blank",
      "noopener,noreferrer",
    );
    openSpy.mockRestore();
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
    render(<SourceSheet sources={sources} open={true} onClose={vi.fn()} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("CC-BY 4.0")).toBeInTheDocument();
  });

  it("omits provenance rows when fields are absent", () => {
    const sources: DeduplicatedSource[] = [
      { key: "k1", title: "Doc", excerpts: [] },
    ];
    render(<SourceSheet sources={sources} open={true} onClose={vi.fn()} />);
    // Neither publisher nor date labels should appear.
    expect(screen.queryByText("Acme Corp")).not.toBeInTheDocument();
  });

  it("exposes dialog semantics via role=dialog", () => {
    render(
      <SourceSheet sources={makeSources(1)} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
