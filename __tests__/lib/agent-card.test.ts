import { describe, expect, it } from "vitest";
import { buildAgentCard } from "../../src/lib/agent-card";

describe("static A2A discovery card", () => {
  it.each(["company", "person"] as const)(
    "uses the typed %s card and A2A endpoints",
    (subjectKind) => {
      const card = buildAgentCard({
        agentUrl: "https://api.contextrocket.com/",
        handle: "ada",
        subjectKind,
      });
      expect(card.url).toBe(
        `https://api.contextrocket.com/${subjectKind}/ada/agent-card.json`,
      );
      expect(card.supportedInterfaces).toEqual([
        expect.objectContaining({
          url: `https://api.contextrocket.com/${subjectKind}/ada/a2a`,
          tenant: "ada",
        }),
      ]);
    },
  );
});
