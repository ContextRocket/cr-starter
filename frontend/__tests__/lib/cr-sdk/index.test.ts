/**
 * Tests for cr-sdk public API surface -- createCRClient and config resolution.
 */

import { createCRClient, resolveCRConfig } from "@/lib/cr-sdk";
import { setStoredToken, clearStoredToken } from "@/lib/cr-sdk/credentials";
import { buildTextTurnParams } from "@/lib/a2a-client";

const AGENT_URL = "http://agent.example.com";
const BACKEND_URL = "http://localhost:8100";

beforeEach(() => {
  localStorage.clear();
  clearStoredToken();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ── resolveCRConfig ───────────────────────────────────────────────────────────

describe("resolveCRConfig", () => {
  it("returns safe defaults when env vars are absent", () => {
    const config = resolveCRConfig();
    expect(typeof config.agentUrl).toBe("string");
    expect(typeof config.backendEnabled).toBe("boolean");
    expect(typeof config.backendUrl).toBe("string");
  });
});

// ── createCRClient ────────────────────────────────────────────────────────────

describe("createCRClient", () => {
  const config = {
    agentUrl: AGENT_URL,
    orgKey: undefined,
    backendEnabled: false,
    backendUrl: BACKEND_URL,
  };

  it("exposes agentUrl", () => {
    const client = createCRClient(config);
    expect(client.agentUrl).toBe(AGENT_URL);
  });

  it("ensureToken returns null when backendEnabled=false and no token stored", async () => {
    const client = createCRClient(config);
    const token = await client.ensureToken();
    expect(token).toBeNull();
  });

  it("ensureToken provisions a guest JWT when backendEnabled=true", async () => {
    const enabledConfig = { ...config, backendEnabled: true };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "sdk-guest-jwt",
        token_type: "bearer",
      }),
    });

    const client = createCRClient(enabledConfig);
    const token = await client.ensureToken();
    expect(token).toBe("sdk-guest-jwt");
  });

  it("agentCard delegates to fetchAgentCard", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Test Agent", version: "1.0" }),
    });

    const client = createCRClient(config);
    const card = await client.agentCard();
    expect(card).toMatchObject({ name: "Test Agent" });
  });

  it("streamTurn attaches the stored token as Bearer", async () => {
    // Pre-store a regular login token.
    setStoredToken("login-jwt-xyz");

    // Mock the fetch for the A2A stream call.
    const encoder = new TextEncoder();
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              jsonrpc: "2.0",
              id: "r1",
              result: {
                type: "TaskStatusUpdateEvent",
                id: "t1",
                status: { state: "completed" },
                final: true,
              },
            })}\n\n`,
          ),
        );
        controller.close();
      },
    });

    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      body,
    });
    global.fetch = fetchMock;

    const client = createCRClient(config);
    const params = buildTextTurnParams("hello");

    const events = [];
    for await (const event of client.streamTurn(params)) {
      events.push(event);
    }

    // Verify Authorization header was passed.
    const calledHeaders = fetchMock.mock.calls[0][1].headers;
    const headerRecord = calledHeaders as Record<string, string>;
    expect(headerRecord["Authorization"]).toBe("Bearer login-jwt-xyz");

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("TaskStatusUpdateEvent");
  });

  it("streamTurn works without a token (no Authorization header) when no token stored", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              jsonrpc: "2.0",
              id: "r1",
              result: {
                type: "TaskStatusUpdateEvent",
                id: "t1",
                status: { state: "completed" },
                final: true,
              },
            })}\n\n`,
          ),
        );
        controller.close();
      },
    });

    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      body,
    });
    global.fetch = fetchMock;

    const client = createCRClient(config);
    const params = buildTextTurnParams("hello");

    const events = [];
    for await (const event of client.streamTurn(params)) {
      events.push(event);
    }

    const calledHeaders = fetchMock.mock.calls[0][1].headers;
    const headerRecord = calledHeaders as Record<string, string>;
    expect(headerRecord["Authorization"]).toBeUndefined();
    expect(events[0].type).toBe("TaskStatusUpdateEvent");
  });
});
