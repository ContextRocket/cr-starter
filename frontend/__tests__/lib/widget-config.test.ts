/**
 * Tests for lib/widget-config.ts -- parseWidgetConfig().
 *
 * These tests cover the shared contract between widget.js (which inlines
 * an equivalent 5-line parse) and the embed page (which imports this module).
 *
 * All tests use a plain object adaptor that implements the .get() interface
 * -- no URLSearchParams dependency so tests run in both jsdom and node envs.
 */

import {
  parseWidgetConfig,
  isAllowedAgentUrl,
  type WidgetConfig,
} from "@/lib/widget-config";

/** Build a minimal adaptor from a plain record of string values. */
function makeParams(record: Record<string, string | undefined>): {
  get(key: string): string | null;
} {
  return {
    get(key: string): string | null {
      return record[key] ?? null;
    },
  };
}

describe("parseWidgetConfig()", () => {
  it("returns null for all fields when params is empty", () => {
    const config = parseWidgetConfig(makeParams({}));
    expect(config.agentUrl).toBeNull();
    expect(config.siteKey).toBeNull();
    expect(config.title).toBeNull();
  });

  it("parses agent-url into agentUrl", () => {
    const config = parseWidgetConfig(
      makeParams({ "agent-url": "https://cr.example.com" }),
    );
    expect(config.agentUrl).toBe("https://cr.example.com");
  });

  it("parses site-key into siteKey", () => {
    const config = parseWidgetConfig(makeParams({ "site-key": "pk_live_abc" }));
    expect(config.siteKey).toBe("pk_live_abc");
  });

  it("parses title into title", () => {
    const config = parseWidgetConfig(makeParams({ title: "Ask us anything" }));
    expect(config.title).toBe("Ask us anything");
  });

  it("parses all three fields together", () => {
    const config = parseWidgetConfig(
      makeParams({
        "agent-url": "https://api.example.com",
        "site-key": "pk_test_xyz",
        title: "Support chat",
      }),
    );
    expect(config).toEqual<WidgetConfig>({
      agentUrl: "https://api.example.com",
      siteKey: "pk_test_xyz",
      title: "Support chat",
    });
  });

  it("treats empty string as null for agentUrl", () => {
    const config = parseWidgetConfig(makeParams({ "agent-url": "" }));
    expect(config.agentUrl).toBeNull();
  });

  it("treats empty string as null for siteKey", () => {
    const config = parseWidgetConfig(makeParams({ "site-key": "" }));
    expect(config.siteKey).toBeNull();
  });

  it("treats empty string as null for title", () => {
    const config = parseWidgetConfig(makeParams({ title: "" }));
    expect(config.title).toBeNull();
  });

  it("ignores unknown params", () => {
    const config = parseWidgetConfig(
      makeParams({ "agent-url": "https://example.com", unknown: "ignored" }),
    );
    expect(config.agentUrl).toBe("https://example.com");
    // WidgetConfig has no 'unknown' field -- TypeScript enforces the shape.
    expect(Object.keys(config)).toEqual(["agentUrl", "siteKey", "title"]);
  });
});

describe("isAllowedAgentUrl()", () => {
  const CONFIGURED = "https://agent.example.com";

  it("accepts an agent-url with the exact configured origin", () => {
    expect(isAllowedAgentUrl("https://agent.example.com", CONFIGURED)).toBe(
      true,
    );
  });

  it("accepts a same-origin agent-url with a path", () => {
    expect(isAllowedAgentUrl("https://agent.example.com/api", CONFIGURED)).toBe(
      true,
    );
  });

  it("rejects a foreign origin", () => {
    expect(isAllowedAgentUrl("https://evil.example.net", CONFIGURED)).toBe(
      false,
    );
  });

  it("rejects a different subdomain of the same site", () => {
    expect(isAllowedAgentUrl("https://other.example.com", CONFIGURED)).toBe(
      false,
    );
  });

  it("rejects a scheme downgrade (http vs configured https)", () => {
    expect(isAllowedAgentUrl("http://agent.example.com", CONFIGURED)).toBe(
      false,
    );
  });

  it("rejects a different port", () => {
    expect(
      isAllowedAgentUrl("https://agent.example.com:8443", CONFIGURED),
    ).toBe(false);
  });

  it("rejects non-http(s) schemes", () => {
    expect(isAllowedAgentUrl("javascript:alert(1)", CONFIGURED)).toBe(false);
    expect(isAllowedAgentUrl("data:text/html,x", CONFIGURED)).toBe(false);
  });

  it("rejects malformed candidate URLs", () => {
    expect(isAllowedAgentUrl("not a url", CONFIGURED)).toBe(false);
  });

  it("rejects everything when no agent origin is configured", () => {
    expect(isAllowedAgentUrl("https://agent.example.com", undefined)).toBe(
      false,
    );
    expect(isAllowedAgentUrl("https://agent.example.com", null)).toBe(false);
    expect(isAllowedAgentUrl("https://agent.example.com", "")).toBe(false);
  });
});
