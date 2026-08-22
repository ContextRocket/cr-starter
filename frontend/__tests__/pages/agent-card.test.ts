/**
 * Tests for the current A2A agent card (/.well-known/agent-card.json).
 *
 * The builder is tested directly so this contract remains independent of the
 * Next.js route runtime.
 */

import { buildAgentCard } from "@/lib/agent-card";

type AgentCard = {
  name: string;
  description: string;
  version: string;
  supportedInterfaces: Array<{
    url: string;
    protocolBinding: string;
    protocolVersion: string;
    tenant?: string;
  }>;
  defaultInputModes: string[];
  defaultOutputModes: string[];
  skills: unknown[];
  provider: { organization: string; url: string };
  securitySchemes: Record<string, unknown>;
  securityRequirements: unknown[];
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

  it("returns the current A2A card shape", () => {
    const card = getCard();
    expect(typeof card.name).toBe("string");
    expect(card.name.length).toBeGreaterThan(0);
    expect(typeof card.description).toBe("string");
    expect(card.version).toBe("1.0");
    expect(card.defaultInputModes).toEqual(["text/plain"]);
    expect(card.defaultOutputModes).toEqual(["text/plain"]);
    expect(card.provider.organization).toBe("ContextRocket");
    expect(card.securitySchemes).toHaveProperty("bearer");
    expect(card.securitySchemes).toHaveProperty("apiKey");
    expect(card.securityRequirements).toHaveLength(2);
  });

  it("advertises the configured ContextRocket interface and handle", () => {
    process.env.NEXT_PUBLIC_CR_AGENT_URL = "https://api.example.com/";
    process.env.NEXT_PUBLIC_CONTEXTROCKET_HANDLE = "example-org";
    const card = getCard();
    expect(card.supportedInterfaces).toEqual([
      {
        url: "https://api.example.com/api/agent/a2a",
        protocolBinding: "JSONRPC",
        protocolVersion: "1.0",
        tenant: "example-org",
      },
    ]);
  });

  it("uses the starter showcase defaults", () => {
    delete process.env.NEXT_PUBLIC_CR_AGENT_URL;
    delete process.env.NEXT_PUBLIC_CONTEXTROCKET_HANDLE;
    const card = getCard();
    expect(card.supportedInterfaces[0].url).toBe(
      "https://app-api.contextrocket.com/api/agent/a2a",
    );
    expect(card.supportedInterfaces[0].tenant).toBe("contextrocket");
  });

  it("does not claim policy-projected skills statically", () => {
    expect(getCard().skills).toEqual([]);
  });
});
