/**
 * Tests for the /embed page (app/embed/page.tsx).
 *
 * The embed page is an async Server Component. We test its rendering
 * behavior by calling it as a plain async function (no HTTP stack needed)
 * and asserting on the returned JSX via @testing-library/react.
 *
 * jest.mock paths must be relative (not @/ aliases) because jest.mock is
 * hoisted before the module resolver runs -- see chat-fab.test.tsx pattern.
 *
 * The ChatPanel client component is mocked so the embed page can render in
 * jsdom without opening live SSE/WebSocket connections.
 *
 * Two behaviors under test:
 *   1. Unconfigured state: no agent-url param -> shows CHAT_CONNECT_REQUIRED prompt.
 *   2. Configured state: agent-url present -> renders the chat panel container.
 */

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

// ChatPanel is a "use client" component with useA2AStream. Mock it with a
// relative path (jest.mock is hoisted before alias resolution).
jest.mock("../../components/chat/chat-panel", () => ({
  ChatPanel: ({ "data-testid": testId }: { "data-testid"?: string }) => (
    <div data-testid={testId ?? "chat-panel"}>Chat panel</div>
  ),
}));

import EmbedPage from "../../app/embed/page";

/** Build a searchParams Promise from a plain record. */
function makeSearchParams(
  record: Record<string, string>,
): Promise<Record<string, string | string[] | undefined>> {
  return Promise.resolve(record);
}

describe("EmbedPage -- unconfigured state (no agent-url)", () => {
  it("renders the connect-required container when agent-url is absent", async () => {
    const ui = await EmbedPage({ searchParams: makeSearchParams({}) });
    render(ui);

    expect(screen.getByTestId("embed-page-unconfigured")).toBeInTheDocument();
  });

  it("renders a heading with the connect-required title text", async () => {
    const ui = await EmbedPage({ searchParams: makeSearchParams({}) });
    render(ui);

    // en key CHAT_CONNECT_REQUIRED_TITLE = "Connect ContextRocket"
    expect(
      screen.getByRole("heading", { name: /connect contextrocket/i }),
    ).toBeInTheDocument();
  });

  it("renders the connect-required body text", async () => {
    const ui = await EmbedPage({ searchParams: makeSearchParams({}) });
    render(ui);

    // en key CHAT_CONNECT_REQUIRED_BODY contains "NEXT_PUBLIC_CR_AGENT_URL"
    expect(screen.getByText(/NEXT_PUBLIC_CR_AGENT_URL/)).toBeInTheDocument();
  });

  it("does not render the embed-page (configured) testid", async () => {
    const ui = await EmbedPage({ searchParams: makeSearchParams({}) });
    render(ui);

    expect(screen.queryByTestId("embed-page")).not.toBeInTheDocument();
  });
});

describe("EmbedPage -- configured state (agent-url present)", () => {
  it("renders the main embed container when agent-url is provided", async () => {
    const ui = await EmbedPage({
      searchParams: makeSearchParams({
        "agent-url": "https://api.example.com",
      }),
    });
    render(ui);

    expect(screen.getByTestId("embed-page")).toBeInTheDocument();
  });

  it("does not show the unconfigured prompt when agent-url is set", async () => {
    const ui = await EmbedPage({
      searchParams: makeSearchParams({
        "agent-url": "https://api.example.com",
      }),
    });
    render(ui);

    expect(
      screen.queryByTestId("embed-page-unconfigured"),
    ).not.toBeInTheDocument();
  });

  it("renders the chat panel component", async () => {
    const ui = await EmbedPage({
      searchParams: makeSearchParams({
        "agent-url": "https://api.example.com",
      }),
    });
    render(ui);

    expect(screen.getByTestId("embed-chat-panel")).toBeInTheDocument();
  });
});
