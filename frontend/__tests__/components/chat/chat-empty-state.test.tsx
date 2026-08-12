/**
 * Tests for ChatEmptyState -- welcome screen with icebreaker chips.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";

describe("ChatEmptyState", () => {
  it("renders the empty state container", () => {
    render(<ChatEmptyState />);
    expect(screen.getByTestId("chat-empty-state")).toBeInTheDocument();
  });

  it("renders the connect prompt when showConnectPrompt is true", () => {
    render(<ChatEmptyState showConnectPrompt />);
    expect(screen.getByTestId("chat-connect-prompt")).toBeInTheDocument();
  });

  it("renders the title from props when provided", () => {
    render(<ChatEmptyState title="Custom Title" />);
    expect(screen.getByTestId("chat-empty-title")).toHaveTextContent(
      "Custom Title",
    );
  });

  it("renders the subtitle from props when provided", () => {
    render(<ChatEmptyState subtitle="Custom subtitle text." />);
    expect(screen.getByTestId("chat-empty-subtitle")).toHaveTextContent(
      "Custom subtitle text.",
    );
  });

  it("renders icebreaker chips when onIcebreakerSelect is provided", () => {
    render(<ChatEmptyState onIcebreakerSelect={vi.fn()} />);
    // The site config ships with 4 en icebreakers by default.
    expect(screen.getByTestId("icebreaker-chips")).toBeInTheDocument();
    expect(screen.getByTestId("icebreaker-chip-1")).toBeInTheDocument();
    expect(screen.getByTestId("icebreaker-chip-2")).toBeInTheDocument();
    expect(screen.getByTestId("icebreaker-chip-3")).toBeInTheDocument();
    expect(screen.getByTestId("icebreaker-chip-4")).toBeInTheDocument();
  });

  it("does not render icebreaker chips when onIcebreakerSelect is not provided", () => {
    render(<ChatEmptyState />);
    expect(screen.queryByTestId("icebreaker-chips")).not.toBeInTheDocument();
  });

  it("calls onIcebreakerSelect with the message when a chip is clicked", () => {
    const handleSelect = vi.fn();
    render(<ChatEmptyState onIcebreakerSelect={handleSelect} />);

    fireEvent.click(screen.getByTestId("icebreaker-chip-1"));
    // The first en icebreaker's message should be passed.
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(expect.any(String));
    // Verify it is not an empty string.
    expect(handleSelect.mock.calls[0][0].length).toBeGreaterThan(0);
  });
});
