import { describe, expect, it } from "vitest";
import { contextRocketIdentityUrl } from "@/lib/contextrocket-urls";

describe("ContextRocket typed identity URLs", () => {
  it("uses the selected identity kind and encodes the handle as one segment", () => {
    expect(
      contextRocketIdentityUrl(
        "https://api.contextrocket.com",
        "person",
        "mark/name?team=one#anchor",
        "mcp",
      ),
    ).toBe(
      "https://api.contextrocket.com/person/mark%2Fname%3Fteam%3Done%23anchor/mcp",
    );
  });

  it("keeps the typed A2A and card routes distinct from platform discovery", () => {
    expect(
      contextRocketIdentityUrl(
        "https://api.contextrocket.com/",
        "company",
        "acme",
        "a2a",
      ),
    ).toBe("https://api.contextrocket.com/company/acme/a2a");
    expect(
      contextRocketIdentityUrl(
        "https://api.contextrocket.com",
        "company",
        "acme",
        "agent-card.json",
      ),
    ).toBe("https://api.contextrocket.com/company/acme/agent-card.json");
  });
});
