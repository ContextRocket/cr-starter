/**
 * Tests for the A2A agent card (/.well-known/agent.json).
 *
 * Tests buildAgentCard() from lib/agent-card.ts directly -- no HTTP stack.
 * The route module imports from lib/agent-card, so testing the builder
 * covers the card shape without requiring Next.js server globals.
 *
 * Verifies:
 *   - Required A2A AgentCard fields are present.
 *   - url is null when NEXT_PUBLIC_CR_AGENT_URL is unset.
 *   - url is the /api/agent/a2a endpoint when configured.
 *   - provider, capabilities, authentication, skills are correct.
 */

import { buildAgentCard } from "@/lib/agent-card";

// The card builder returns Record<string, unknown>; we cast to typed accessors.
type AgentCard = {
  name: string;
  description: string;
  version: string;
  url: string | null;
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: Array<{ id: string; name: string }>;
  provider: { name: string; url: string };
  authentication: { schemes: string[] };
  capabilities: { streaming: boolean };
};

function getCard(): AgentCard {
  return buildAgentCard() as unknown as AgentCard;
}

describe("buildAgentCard()", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns an object with required AgentCard fields", () => {
    const card = getCard();
    expect(typeof card.name).toBe("string");
    expect(card.name.length).toBeGreaterThan(0);
    expect(typeof card.description).toBe("string");
    expect(typeof card.version).toBe("string");
    expect(card.defaultInputModes).toEqual(["text"]);
    expect(card.defaultOutputModes).toEqual(["text"]);
    expect(Array.isArray(card.skills)).toBe(true);
  });

  it("sets url to null when NEXT_PUBLIC_CR_AGENT_URL is unset", () => {
    delete process.env.NEXT_PUBLIC_CR_AGENT_URL;
    const card = getCard();
    expect(card.url).toBeNull();
  });

  it("sets url to the A2A endpoint when NEXT_PUBLIC_CR_AGENT_URL is configured", () => {
    process.env.NEXT_PUBLIC_CR_AGENT_URL = "https://api.example.com";
    const card = getCard();
    expect(card.url).toBe("https://api.example.com/api/agent/a2a");
  });

  it("strips trailing slash from NEXT_PUBLIC_CR_AGENT_URL", () => {
    process.env.NEXT_PUBLIC_CR_AGENT_URL = "https://api.example.com/";
    const card = getCard();
    expect(card.url).toBe("https://api.example.com/api/agent/a2a");
  });

  it("includes provider with ContextRocket name and url", () => {
    const card = getCard();
    expect(card.provider.name).toBe("ContextRocket");
    expect(typeof card.provider.url).toBe("string");
  });

  it("includes authentication with Bearer and OrgCredential schemes", () => {
    const card = getCard();
    expect(card.authentication.schemes).toContain("Bearer");
    expect(card.authentication.schemes).toContain("OrgCredential");
  });

  it("sets capabilities.streaming=false when url is null", () => {
    delete process.env.NEXT_PUBLIC_CR_AGENT_URL;
    const card = getCard();
    expect(card.capabilities.streaming).toBe(false);
  });

  it("sets capabilities.streaming=true when url is configured", () => {
    process.env.NEXT_PUBLIC_CR_AGENT_URL = "https://api.example.com";
    const card = getCard();
    expect(card.capabilities.streaming).toBe(true);
  });

  it("includes at least one skill with id and name", () => {
    const card = getCard();
    expect(card.skills.length).toBeGreaterThan(0);
    expect(typeof card.skills[0].id).toBe("string");
    expect(typeof card.skills[0].name).toBe("string");
  });
});
