/**
 * Tests for CitationPills -- deduped citation pills with source sheet.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { CitationPills } from "@/components/chat/citation-pills";
import type { SourceRef } from "@/lib/a2a-client";

function makeRefs(overrides: Partial<SourceRef>[] = []): SourceRef[] {
  return overrides.map((o, i) => ({
    sourceRefId: `ref-${i + 1}`,
    title: `Source ${i + 1}`,
    url: `https://example.com/source-${i + 1}`,
    score: 0.9,
    ...o,
  }));
}

describe("CitationPills", () => {
  it("renders nothing when sourceRefs is empty", () => {
    const { container } = render(<CitationPills sourceRefs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders one pill per unique document (deduped by URL)", () => {
    const refs = makeRefs([
      { url: "https://example.com/a", title: "Doc A" },
      { url: "https://example.com/a", title: "Doc A" }, // duplicate URL
      { url: "https://example.com/b", title: "Doc B" },
    ]);
    render(<CitationPills sourceRefs={refs} />);

    expect(screen.getByTestId("citation-pills")).toBeInTheDocument();
    // Two unique URLs -> two pills.
    expect(screen.getByTestId("citation-pill-1")).toBeInTheDocument();
    expect(screen.getByTestId("citation-pill-2")).toBeInTheDocument();
    expect(screen.queryByTestId("citation-pill-3")).not.toBeInTheDocument();
  });

  it("renders one pill per unique sourceRefId when URL is absent", () => {
    const refs: SourceRef[] = [
      { sourceRefId: "internal-1", title: "Internal A", score: 0.8 },
      { sourceRefId: "internal-1", title: "Internal A", score: 0.8 }, // same id
    ];
    render(<CitationPills sourceRefs={refs} />);
    // One unique id -> one pill.
    expect(screen.getByTestId("citation-pill-1")).toBeInTheDocument();
    expect(screen.queryByTestId("citation-pill-2")).not.toBeInTheDocument();
  });

  it("opens the source sheet on pill click", () => {
    const refs = makeRefs([{ url: "https://example.com/a", title: "Doc A" }]);
    render(<CitationPills sourceRefs={refs} />);

    fireEvent.click(screen.getByTestId("citation-pill-1"));
    expect(screen.getByTestId("source-sheet")).toBeInTheDocument();
  });

  it("closes the source sheet when the sheet close button is clicked", () => {
    const refs = makeRefs([{ url: "https://example.com/a", title: "Doc A" }]);
    render(<CitationPills sourceRefs={refs} />);

    fireEvent.click(screen.getByTestId("citation-pill-1"));
    expect(screen.getByTestId("source-sheet")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("source-sheet-close"));
    expect(screen.queryByTestId("source-sheet")).not.toBeInTheDocument();
  });

  it("shows the source title in the pill", () => {
    const refs = makeRefs([{ url: "https://example.com/a", title: "My Doc" }]);
    render(<CitationPills sourceRefs={refs} />);
    expect(screen.getByText("My Doc")).toBeInTheDocument();
  });
});
