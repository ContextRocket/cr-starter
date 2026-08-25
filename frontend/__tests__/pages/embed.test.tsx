import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom/vitest";

vi.mock("../../components/shared/chat/chat-panel", () => ({
  ChatPanel: ({ "data-testid": testId }: { "data-testid"?: string }) => (
    <div data-testid={testId ?? "chat-panel"}>Chat panel</div>
  ),
}));

import EmbedPage from "../../app/embed/page";

function makeSearchParams(record: Record<string, string>) {
  return Promise.resolve(record);
}

describe("EmbedPage -- canned demo", () => {
  it("renders the self-contained demo without configuration", async () => {
    const ui = await EmbedPage({ searchParams: makeSearchParams({}) });
    render(ui);
    expect(screen.getByTestId("embed-page")).toBeInTheDocument();
    expect(screen.getByTestId("embed-chat-panel")).toBeInTheDocument();
  });
});

describe("EmbedPage -- live mode", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CR_AGENT_URL = "https://api.example.com";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CR_AGENT_URL;
  });

  it("renders a live chat panel for the configured origin", async () => {
    const ui = await EmbedPage({
      searchParams: makeSearchParams({
        mode: "live",
        "agent-url": "https://api.example.com",
        "contextrocket-handle": "acme",
      }),
    });
    render(ui);
    expect(screen.getByTestId("embed-chat-panel")).toBeInTheDocument();
  });

  it("rejects a foreign or unsafe live agent URL", async () => {
    const foreign = await EmbedPage({
      searchParams: makeSearchParams({
        mode: "live",
        "agent-url": "https://evil.example",
      }),
    });
    render(foreign);
    expect(screen.getByTestId("embed-page-rejected")).toBeInTheDocument();
  });
});
