/**
 * Tests for the ChatFab component — open/close render behavior.
 */

import { render, screen, fireEvent } from "@testing-library/react";

// jest.mock calls are hoisted so we use relative paths from this test file
// to ensure the resolver can find them before the module graph is built.
jest.mock("../../../components/chat/chat-panel", () => ({
  ChatPanel: ({ "data-testid": testId }: { "data-testid"?: string }) => (
    <div data-testid={testId ?? "chat-panel"}>Chat Panel</div>
  ),
}));

// Mock the hook used by ChatPanel to avoid issues with fetch in jsdom.
jest.mock("../../../hooks/use-a2a-stream", () => ({
  useA2AStream: () => ({
    messages: [],
    phase: "idle",
    streamingText: "",
    isThinking: false,
    isWaitingForResponse: false,
    isSlowResponse: false,
    isVerySlowResponse: false,
    error: null,
    threadId: null,
    sendMessage: jest.fn(),
    abort: jest.fn(),
    clearThread: jest.fn(),
  }),
}));

import { ChatFab } from "@/components/chat/chat-fab";

describe("ChatFab", () => {
  it("renders the FAB button", () => {
    render(<ChatFab />);
    expect(screen.getByTestId("chat-fab-button")).toBeInTheDocument();
  });

  it("drawer is not visible on initial render", () => {
    render(<ChatFab />);
    const drawer = screen.getByTestId("chat-fab-drawer");
    // The drawer is present in DOM but not accessible (pointer-events-none, opacity-0).
    expect(drawer).toHaveAttribute("aria-hidden", "true");
  });

  it("opens the drawer on FAB click", () => {
    render(<ChatFab />);
    const button = screen.getByTestId("chat-fab-button");

    fireEvent.click(button);

    const drawer = screen.getByTestId("chat-fab-drawer");
    expect(drawer).toHaveAttribute("aria-hidden", "false");
  });

  it("closes the drawer on second FAB click", () => {
    render(<ChatFab />);
    const button = screen.getByTestId("chat-fab-button");

    fireEvent.click(button);
    fireEvent.click(button);

    const drawer = screen.getByTestId("chat-fab-drawer");
    expect(drawer).toHaveAttribute("aria-hidden", "true");
  });

  it("shows close icon when open", () => {
    render(<ChatFab />);
    const button = screen.getByTestId("chat-fab-button");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-label", "Close chat");
  });

  it("shows open icon when closed", () => {
    render(<ChatFab />);
    const button = screen.getByTestId("chat-fab-button");
    expect(button).toHaveAttribute("aria-label", "Open chat");
  });

  it("renders the chat panel inside the drawer", () => {
    render(<ChatFab />);
    // Panel is always rendered (just hidden via CSS) for smooth transitions.
    expect(screen.getByTestId("chat-fab-panel")).toBeInTheDocument();
  });
});
