/**
 * Tests for the /embed page (app/embed/page.tsx).
 *
 * The embed page is an async Server Component. We test its rendering
 * behavior by calling it as a plain async function (no HTTP stack needed)
 * and asserting on the returned JSX via @testing-library/react.
 *
 * vi.mock paths must be relative (not @/ aliases) because vi.mock is
 * hoisted before the module resolver runs -- see chat-fab.test.tsx pattern.
 *
 * The ChatPanel client component is mocked so the embed page can render in
 * jsdom without opening live SSE/WebSocket connections.
 *
 * Three behaviors under test:
 *   1. Unconfigured state: no agent-url param -> shows CHAT_CONNECT_REQUIRED prompt.
 *   2. Configured state: agent-url matching the configured origin -> chat panel.
 *   3. Origin allowlist: agent-url with a foreign origin / bad scheme, or a
 *      deployment with no configured agent origin -> honest rejection state.
 */

import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

// ChatPanel is a "use client" component with useA2AStream. Mock it with a
// relative path (vi.mock is hoisted before alias resolution).
vi.mock("../../components/chat/chat-panel", () => ({
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

describe("EmbedPage -- configured state (agent-url matches configured origin)", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CR_AGENT_URL = "https://api.example.com";
  });
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CR_AGENT_URL;
  });

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

describe("EmbedPage -- agent-url origin allowlist", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CR_AGENT_URL;
  });

  it("rejects a foreign-origin agent-url with the honest rejection state", async () => {
    process.env.NEXT_PUBLIC_CR_AGENT_URL = "https://api.example.com";
    const ui = await EmbedPage({
      searchParams: makeSearchParams({
        "agent-url": "https://evil.attacker.net",
      }),
    });
    render(ui);

    expect(screen.getByTestId("embed-page-rejected")).toBeInTheDocument();
    expect(screen.queryByTestId("embed-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("embed-chat-panel")).not.toBeInTheDocument();
  });

  it("rejects a non-http(s) agent-url", async () => {
    process.env.NEXT_PUBLIC_CR_AGENT_URL = "https://api.example.com";
    const ui = await EmbedPage({
      searchParams: makeSearchParams({
        "agent-url": "javascript:alert(1)",
      }),
    });
    render(ui);

    expect(screen.getByTestId("embed-page-rejected")).toBeInTheDocument();
    expect(screen.queryByTestId("embed-chat-panel")).not.toBeInTheDocument();
  });

  it("rejects any agent-url when no agent origin is configured", async () => {
    // NEXT_PUBLIC_CR_AGENT_URL is unset: there is no allowlisted origin,
    // so attacker-supplied agent-url values must never connect.
    const ui = await EmbedPage({
      searchParams: makeSearchParams({
        "agent-url": "https://api.example.com",
      }),
    });
    render(ui);

    expect(screen.getByTestId("embed-page-rejected")).toBeInTheDocument();
    expect(screen.queryByTestId("embed-chat-panel")).not.toBeInTheDocument();
  });

  it("still shows the unconfigured state when no agent-url param at all", async () => {
    const ui = await EmbedPage({ searchParams: makeSearchParams({}) });
    render(ui);

    expect(screen.getByTestId("embed-page-unconfigured")).toBeInTheDocument();
    expect(screen.queryByTestId("embed-page-rejected")).not.toBeInTheDocument();
  });
});
