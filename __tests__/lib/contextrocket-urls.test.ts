import { describe, expect, it } from "vitest";
import { crIdentityUrl } from "../../src/lib/contextrocket-urls";

describe("ContextRocket typed identity URLs", () => {
  it.each(["company", "person"] as const)(
    "builds the %s MCP, A2A, and card endpoints beneath the identity",
    (subjectKind) => {
      expect(
        crIdentityUrl(
          "https://api.contextrocket.com///",
          subjectKind,
          "a handle",
          "mcp",
        ),
      ).toBe(`https://api.contextrocket.com/${subjectKind}/a%20handle/mcp`);
      expect(
        crIdentityUrl(
          "https://api.contextrocket.com",
          subjectKind,
          "a handle",
          "a2a",
        ),
      ).toBe(`https://api.contextrocket.com/${subjectKind}/a%20handle/a2a`);
      expect(
        crIdentityUrl(
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

  it("encodes reserved URL characters inside one identity segment", () => {
    expect(
      crIdentityUrl(
        "https://api.contextrocket.com",
        "person",
        "mark/name?team=one#anchor",
        "agent-card.json",
      ),
    ).toBe(
      "https://api.contextrocket.com/person/mark%2Fname%3Fteam%3Done%23anchor/agent-card.json",
    );
  });

  it("rejects an empty identity handle", () => {
    expect(() =>
      crIdentityUrl("https://api.contextrocket.com", "company", "  ", "mcp"),
    ).toThrow("A ContextRocket handle is required.");
  });
});
