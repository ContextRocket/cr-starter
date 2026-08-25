import {
  parseWidgetConfig,
  isAllowedAgentUrl,
  type WidgetConfig,
} from "@/lib/widget-config";

function makeParams(record: Record<string, string | undefined>) {
  return {
    get(key: string): string | null {
      return record[key] ?? null;
    },
  };
}

describe("parseWidgetConfig", () => {
  it("defaults to a self-contained demo", () => {
    expect(parseWidgetConfig(makeParams({}))).toEqual<WidgetConfig>({
      mode: "demo",
      agentUrl: null,
      handle: null,
      apiKey: null,
      title: null,
    });
  });

  it("parses canonical live configuration", () => {
    expect(
      parseWidgetConfig(
        makeParams({
          mode: "live",
          "agent-url": "https://api.example.com/",
          "contextrocket-handle": "acme",
          "api-key": "pk_live_abc",
          title: "Ask us anything",
        }),
      ),
    ).toEqual<WidgetConfig>({
      mode: "live",
      agentUrl: "https://api.example.com",
      handle: "acme",
      apiKey: "pk_live_abc",
      title: "Ask us anything",
    });
  });

  it("does not accept non-canonical credential names", () => {
    const config = parseWidgetConfig(
      makeParams({
        mode: "live",
        "agent-url": "https://api.example.com",
        "site-key": "pk_test",
      }),
    );
    expect(config.apiKey).toBeNull();
  });
});

describe("isAllowedAgentUrl", () => {
  it("accepts the configured origin and rejects foreign origins", () => {
    expect(
      isAllowedAgentUrl(
        "https://agent.example.com/api",
        "https://agent.example.com",
      ),
    ).toBe(true);
    expect(
      isAllowedAgentUrl(
        "https://evil.example.net",
        "https://agent.example.com",
      ),
    ).toBe(false);
    expect(
      isAllowedAgentUrl("javascript:alert(1)", "https://agent.example.com"),
    ).toBe(false);
  });
});
