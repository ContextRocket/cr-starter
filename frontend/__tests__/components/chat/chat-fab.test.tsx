/**
 * Tests for the ChatFab component: open/close, hoisted conversation state,
 * expand/collapse continuity, Escape handling, and closed-drawer a11y.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import type { UseA2AStreamResult } from "@/hooks/use-a2a-stream";

// Hoisted-state fixture: the mock hook returns ONE stable chat object so the
// tests can assert that both layouts (drawer + fullscreen) receive the same
// conversation and that layout toggles never abort the stream.
// vi.mock factories are hoisted above the module body, so the fixture lives
// in vi.hoisted() to be reachable from both the factory and the tests.
const { mockAbort, mockChat } = vi.hoisted(() => {
  const mockAbort = vi.fn();
  const mockChat: UseA2AStreamResult = {
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Hi",
        createdAt: "2026-01-01T00:00:00Z",
      },
      {
        id: "m2",
        role: "assistant",
        content: "Hello there",
        createdAt: "2026-01-01T00:00:01Z",
      },
    ],
    phase: "completed",
    streamingText: "",
    isThinking: false,
    isWaitingForResponse: false,
    isSlowResponse: false,
    isVerySlowResponse: false,
    error: null,
    threadId: "thread-42",
    sendMessage: vi.fn(),
    abort: mockAbort,
    clearThread: vi.fn(),
  };
  return { mockAbort, mockChat };
});

// vi.mock calls are hoisted so we use relative paths from this test file
// to ensure the resolver can find them before the module graph is built.
// The panel mock surfaces the chat prop contents so continuity is observable.
vi.mock("../../../components/shared/chat/chat-panel", () => ({
  ChatPanel: ({
    "data-testid": testId,
    chat,
  }: {
    "data-testid"?: string;
    chat?: { messages: unknown[]; threadId: string | null };
  }) => (
    <div data-testid={testId ?? "chat-panel"}>
      <span data-testid={`${testId ?? "chat-panel"}-msg-count`}>
        {chat ? String(chat.messages.length) : "no-chat"}
      </span>
      <span data-testid={`${testId ?? "chat-panel"}-thread-id`}>
        {chat?.threadId ?? "no-thread"}
      </span>
    </div>
  ),
}));

vi.mock("../../../hooks/use-a2a-stream", () => ({
  useA2AStream: vi.fn(() => mockChat),
}));

import { ChatFab } from "@/components/shared/chat/chat-fab";

function openDrawer() {
  fireEvent.click(screen.getByTestId("chat-fab-button"));
}

describe("ChatFab", () => {
  beforeEach(() => {
    mockAbort.mockClear();
  });

  it("renders the FAB button", () => {
    render(<ChatFab fullscreenOnLoad={false} />);
    expect(screen.getByTestId("chat-fab-button")).toBeInTheDocument();
  });

  it("drawer is hidden and inert on initial render", () => {
    render(<ChatFab fullscreenOnLoad={false} />);
    const drawer = screen.getByTestId("chat-fab-drawer");
    expect(drawer).toHaveAttribute("aria-hidden", "true");
    expect(drawer).toHaveAttribute("inert");
  });

  it("closed drawer contains no focusable panel content", () => {
    render(<ChatFab fullscreenOnLoad={false} />);
    // No panel is mounted while closed: nothing inside the aria-hidden
    // container can receive focus, and the composer cannot autofocus on
    // page load.
    expect(screen.queryByTestId("chat-fab-panel")).not.toBeInTheDocument();
    expect(
      screen
        .getByTestId("chat-fab-drawer")
        .querySelectorAll("button, [href], input, textarea, select"),
    ).toHaveLength(0);
  });

  it("opens the drawer on FAB click", () => {
    render(<ChatFab fullscreenOnLoad={false} />);
    openDrawer();

    const drawer = screen.getByTestId("chat-fab-drawer");
    expect(drawer).toHaveAttribute("aria-hidden", "false");
    expect(drawer).not.toHaveAttribute("inert");
    expect(screen.getByTestId("chat-fab-panel")).toBeInTheDocument();
  });

  it("can start fullscreen", () => {
    render(<ChatFab fullscreenOnLoad />);

    expect(screen.getByTestId("chat-fab-fullscreen")).toBeInTheDocument();
    expect(screen.getByTestId("chat-fab-fullscreen-panel")).toBeInTheDocument();
  });

  it("closes the drawer on second FAB click", () => {
    render(<ChatFab fullscreenOnLoad={false} />);
    openDrawer();
    openDrawer();

    const drawer = screen.getByTestId("chat-fab-drawer");
    expect(drawer).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByTestId("chat-fab-panel")).not.toBeInTheDocument();
  });

  it("reflects open state on the FAB button via aria-expanded", () => {
    render(<ChatFab fullscreenOnLoad={false} />);
    const button = screen.getByTestId("chat-fab-button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    openDrawer();
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  describe("hoisted conversation state (expand/collapse continuity)", () => {
    it("passes the hoisted chat to the drawer panel", () => {
      render(<ChatFab fullscreenOnLoad={false} />);
      openDrawer();

      expect(screen.getByTestId("chat-fab-panel-msg-count")).toHaveTextContent(
        "2",
      );
      expect(screen.getByTestId("chat-fab-panel-thread-id")).toHaveTextContent(
        "thread-42",
      );
    });

    it("expanding to fullscreen preserves messages and threadId", () => {
      render(<ChatFab fullscreenOnLoad={false} />);
      openDrawer();
      fireEvent.click(screen.getByTestId("chat-fab-expand"));

      expect(screen.getByTestId("chat-fab-fullscreen")).toBeInTheDocument();
      expect(
        screen.getByTestId("chat-fab-fullscreen-panel-msg-count"),
      ).toHaveTextContent("2");
      expect(
        screen.getByTestId("chat-fab-fullscreen-panel-thread-id"),
      ).toHaveTextContent("thread-42");
      expect(
        screen.getByTestId("chat-fab-fullscreen-brand"),
      ).toBeInTheDocument();
    });

    it("collapsing back to the drawer preserves messages and threadId", () => {
      render(<ChatFab fullscreenOnLoad={false} />);
      openDrawer();
      fireEvent.click(screen.getByTestId("chat-fab-expand"));
      fireEvent.click(screen.getByTestId("chat-fab-collapse"));

      expect(
        screen.queryByTestId("chat-fab-fullscreen"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("chat-fab-panel-msg-count")).toHaveTextContent(
        "2",
      );
      expect(screen.getByTestId("chat-fab-panel-thread-id")).toHaveTextContent(
        "thread-42",
      );
    });

    it("closing fullscreen returns to the website with the FAB closed", () => {
      render(<ChatFab fullscreenOnLoad />);
      fireEvent.click(screen.getByTestId("chat-fab-fullscreen-close"));

      expect(
        screen.queryByTestId("chat-fab-fullscreen"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("chat-fab-drawer")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(screen.getByTestId("chat-fab-button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("never aborts the in-flight stream on expand/collapse", () => {
      render(<ChatFab fullscreenOnLoad={false} />);
      openDrawer();
      fireEvent.click(screen.getByTestId("chat-fab-expand"));
      fireEvent.click(screen.getByTestId("chat-fab-collapse"));
      fireEvent.click(screen.getByTestId("chat-fab-expand"));

      expect(mockAbort).not.toHaveBeenCalled();
    });
  });

  describe("Escape handling", () => {
    it("Escape closes the open drawer", () => {
      render(<ChatFab fullscreenOnLoad={false} />);
      openDrawer();
      expect(screen.getByTestId("chat-fab-panel")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.getByTestId("chat-fab-drawer")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(screen.queryByTestId("chat-fab-panel")).not.toBeInTheDocument();
      expect(mockAbort).not.toHaveBeenCalled();
    });

    it("Escape in fullscreen collapses to the drawer, second Escape closes", () => {
      render(<ChatFab fullscreenOnLoad={false} />);
      openDrawer();
      fireEvent.click(screen.getByTestId("chat-fab-expand"));
      expect(screen.getByTestId("chat-fab-fullscreen")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });
      expect(
        screen.queryByTestId("chat-fab-fullscreen"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("chat-fab-drawer")).toHaveAttribute(
        "aria-hidden",
        "false",
      );

      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.getByTestId("chat-fab-drawer")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });

    it("ignores Escape events already handled by an inner dialog", () => {
      render(<ChatFab fullscreenOnLoad={false} />);
      openDrawer();

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        cancelable: true,
        bubbles: true,
      });
      event.preventDefault();
      document.dispatchEvent(event);

      // Drawer stays open: the defaultPrevented Escape belonged to the
      // inner dialog (source sheet), not to the drawer.
      expect(screen.getByTestId("chat-fab-drawer")).toHaveAttribute(
        "aria-hidden",
        "false",
      );
    });
  });

  describe("demo mode badge", () => {
    it("shows the canned-demo badge by default", () => {
      render(<ChatFab fullscreenOnLoad={false} />);
      openDrawer();
      expect(screen.getByTestId("chat-fab-demo-badge")).toBeInTheDocument();
    });
  });
});
