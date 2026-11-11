import { describe, expect, it } from "vitest";
import { contextRocketIdentityUrl } from "../../src/lib/contextrocket-urls";

describe("ContextRocket typed identity URLs", () => {
  it.each(["company", "person"] as const)(
    "builds the %s MCP, A2A, and card endpoints beneath the identity",
    (subjectKind) => {
      expect(
        contextRocketIdentityUrl(
          "https://api.contextrocket.com/",
          subjectKind,
          "a handle",
          "mcp",
        ),
      ).toBe(`https://api.contextrocket.com/${subjectKind}/a%20handle/mcp`);
      expect(
        contextRocketIdentityUrl(
          "https://api.contextrocket.com",
          subjectKind,
          "a handle",
          "a2a",
        ),
      ).toBe(`https://api.contextrocket.com/${subjectKind}/a%20handle/a2a`);
      expect(
        contextRocketIdentityUrl(
          "https://api.contextrocket.com",
          subjectKind,
          "a handle",
          "agent-card.json",
        ),
      ).toBe(
        `https://api.contextrocket.com/${subjectKind}/a%20handle/agent-card.json`,
      );
    },
  );
});
