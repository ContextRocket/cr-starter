/**
 * Tests for MessageList — renders messages, streaming cursor, and citations.
 */

import { render, screen } from "@testing-library/react";
import { MessageList } from "@/components/chat/message-list";
import type { ChatMessage } from "@/hooks/use-a2a-stream";

function makeUserMessage(content: string): ChatMessage {
  return {
    id: "msg-user-1",
    role: "user",
    content,
    createdAt: new Date().toISOString(),
  };
}

function makeAssistantMessage(content: string, pending = false): ChatMessage {
  return {
    id: "msg-asst-1",
    role: "assistant",
    content,
    pending,
    createdAt: new Date().toISOString(),
  };
}

function makeAssistantWithCitations(content: string): ChatMessage {
  return {
    id: "msg-asst-2",
    role: "assistant",
    content,
    pending: false,
    createdAt: new Date().toISOString(),
    sourceRefs: [
      {
        sourceRefId: "ref-1",
        title: "ContextRocket Docs",
        url: "https://example.com/docs",
        score: 0.95,
      },
      {
        sourceRefId: "ref-2",
        title: "Getting Started",
        score: 0.88,
      },
    ],
  };
}

describe("MessageList", () => {
  it("renders the message list container", () => {
    render(<MessageList messages={[]} />);
    expect(screen.getByTestId("message-list")).toBeInTheDocument();
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("renders a user message", () => {
    const messages = [makeUserMessage("Hello, agent!")];
    render(<MessageList messages={messages} />);
    expect(screen.getByText("Hello, agent!")).toBeInTheDocument();
  });

  it("renders an assistant message", () => {
    const messages = [makeAssistantMessage("I can help with that.")];
    render(<MessageList messages={messages} />);
    expect(screen.getByText("I can help with that.")).toBeInTheDocument();
  });

  it("shows the streaming cursor while pending", () => {
    const messages = [makeAssistantMessage("Partial response...", true)];
    render(
      <MessageList messages={messages} streamingText="Partial response..." />,
    );
    expect(screen.getByTestId("streaming-cursor")).toBeInTheDocument();
  });

  it("does not show streaming cursor on a completed message", () => {
    const messages = [makeAssistantMessage("Full response.")];
    render(<MessageList messages={messages} />);
    expect(screen.queryByTestId("streaming-cursor")).not.toBeInTheDocument();
  });

  it("renders citation pills on a completed assistant message", () => {
    const messages = [makeAssistantWithCitations("Here is the answer.")];
    render(<MessageList messages={messages} />);
    expect(screen.getByTestId("citation-pills")).toBeInTheDocument();
    // Both citations should be present.
    expect(screen.getByTestId("citation-pill-1")).toBeInTheDocument();
    expect(screen.getByTestId("citation-pill-2")).toBeInTheDocument();
  });

  it("does not render citation pills on a pending message", () => {
    const pending: ChatMessage = {
      id: "msg-asst-p",
      role: "assistant",
      content: "Partial...",
      pending: true,
      createdAt: new Date().toISOString(),
      sourceRefs: [{ sourceRefId: "ref-1", title: "Source", score: 0.9 }],
    };
    render(<MessageList messages={[pending]} streamingText="Partial..." />);
    expect(screen.queryByTestId("citation-pills")).not.toBeInTheDocument();
  });

  it("shows the stream status waiting indicator when waiting", () => {
    const pending = makeAssistantMessage("", true);
    render(
      <MessageList
        messages={[pending]}
        isWaitingForResponse
        streamingText=""
      />,
    );
    expect(screen.getByTestId("stream-status-waiting")).toBeInTheDocument();
  });

  it("shows the slow response hint when isSlowResponse is true", () => {
    const pending = makeAssistantMessage("", true);
    render(
      <MessageList
        messages={[pending]}
        isWaitingForResponse
        isSlowResponse
        streamingText=""
      />,
    );
    expect(screen.getByTestId("slow-response-hint")).toBeInTheDocument();
  });

  it("renders both user and assistant messages in a conversation", () => {
    const messages: ChatMessage[] = [
      makeUserMessage("What is ContextRocket?"),
      makeAssistantMessage("ContextRocket is a brand agent platform."),
    ];
    render(<MessageList messages={messages} />);
    expect(screen.getByText("What is ContextRocket?")).toBeInTheDocument();
    expect(
      screen.getByText("ContextRocket is a brand agent platform."),
    ).toBeInTheDocument();
  });
});
