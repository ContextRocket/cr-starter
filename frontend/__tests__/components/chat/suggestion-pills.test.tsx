/**
 * Tests for SuggestionPills -- follow-up chips rendered from platform metadata.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { SuggestionPills } from "@/components/shared/chat/suggestion-pills";

describe("SuggestionPills", () => {
  it("renders nothing when suggestions array is empty", () => {
    const { container } = render(
      <SuggestionPills suggestions={[]} onSelect={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders one chip per suggestion", () => {
    const suggestions = ["Tell me more", "Show examples", "What else?"];
    render(<SuggestionPills suggestions={suggestions} onSelect={vi.fn()} />);

    expect(screen.getByTestId("suggestion-pills")).toBeInTheDocument();
    expect(screen.getByTestId("suggestion-pill-1")).toBeInTheDocument();
    expect(screen.getByTestId("suggestion-pill-2")).toBeInTheDocument();
    expect(screen.getByTestId("suggestion-pill-3")).toBeInTheDocument();
  });

  it("renders chip text correctly", () => {
    render(
      <SuggestionPills
        suggestions={["How does it work?"]}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("How does it work?")).toBeInTheDocument();
  });

  it("calls onSelect with the suggestion text when a chip is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <SuggestionPills
        suggestions={["Tell me more", "Show examples"]}
        onSelect={handleSelect}
      />,
    );

    fireEvent.click(screen.getByTestId("suggestion-pill-1"));
    expect(handleSelect).toHaveBeenCalledWith("Tell me more");
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect with the correct suggestion for the second chip", () => {
    const handleSelect = vi.fn();
    render(
      <SuggestionPills
        suggestions={["First", "Second"]}
        onSelect={handleSelect}
      />,
    );

    fireEvent.click(screen.getByTestId("suggestion-pill-2"));
    expect(handleSelect).toHaveBeenCalledWith("Second");
  });

  it("has an accessible label on the container", () => {
    render(
      <SuggestionPills suggestions={["A suggestion"]} onSelect={vi.fn()} />,
    );
    // The container has aria-label; verify it is present.
    const container = screen.getByTestId("suggestion-pills");
    expect(container).toHaveAttribute("aria-label");
  });
});
