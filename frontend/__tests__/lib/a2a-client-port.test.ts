/**
 * Tests for the A2A client port — covers createA2AClientPort and createInMemoryA2AClientPort.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { A2ATaskParams, A2AEvent } from "@/lib/a2a-client-port";
import {
  createA2AClientPort,
  createInMemoryA2AClientPort,
} from "@/lib/a2a-client-port";

// ── Mock the underlying a2a-client module ─────────────────────────────────────

vi.mock("@/lib/a2a-client", () => ({
  fetchAgentCard: vi.fn(),
  sendTask: vi.fn(),
  streamTask: vi.fn(),
}));

import {
  fetchAgentCard,
  sendTask,
  streamTask,
} from "@/lib/a2a-client";

const mockFetchAgentCard = vi.mocked(fetchAgentCard);
const mockSendTask = vi.mocked(sendTask);
const mockStreamTask = vi.mocked(streamTask);

// ── Fixtures ──────────────────────────────────────────────────────────────────

const BASE_URL = "https://agent.example.com";
const BEARER = "test-jwt-token";

const SAMPLE_PARAMS: A2ATaskParams = {
  message: { role: "user", parts: [{ type: "text", text: "Hello" }] },
};

const SAMPLE_AGENT_CARD = {
  name: "Test Agent",
  description: "A test agent",
  url: BASE_URL,
  version: "1.0.0",
};

const SAMPLE_TASK_RESULT: Record<string, unknown> = {
  id: "task-1",
  status: { state: "completed" },
};

function makeStatusEvent(
  state: string,
  final: boolean,
): A2AEvent {
  return {
    type: "TaskStatusUpdateEvent",
    id: "task-1",
    status: { state: state as "completed" | "failed" | "working" },
    final,
  };
}

// ── createA2AClientPort tests ─────────────────────────────────────────────────

describe("createA2AClientPort", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAgentCard", () => {
    it("delegates to the underlying fetchAgentCard", async () => {
      mockFetchAgentCard.mockResolvedValue(SAMPLE_AGENT_CARD);
      const port = createA2AClientPort(fetch, BASE_URL);

      const result = await port.fetchAgentCard();

      expect(result).toEqual(SAMPLE_AGENT_CARD);
      expect(mockFetchAgentCard).toHaveBeenCalledWith(BASE_URL);
    });

    it("propagates HTTP errors", async () => {
      mockFetchAgentCard.mockRejectedValue(
        new Error("Agent card fetch failed: 500"),
      );
      const port = createA2AClientPort(fetch, BASE_URL);

      await expect(port.fetchAgentCard()).rejects.toThrow(
        "Agent card fetch failed: 500",
      );
    });

    it("propagates network errors", async () => {
      mockFetchAgentCard.mockRejectedValue(new TypeError("fetch failed"));
      const port = createA2AClientPort(fetch, BASE_URL);

      await expect(port.fetchAgentCard()).rejects.toThrow("fetch failed");
    });

    it("propagates AbortError on timeout", async () => {
      mockFetchAgentCard.mockRejectedValue(
        new DOMException("The operation was aborted.", "AbortError"),
      );
      const port = createA2AClientPort(fetch, BASE_URL);

      await expect(port.fetchAgentCard()).rejects.toThrow("aborted");
    });
  });

  describe("sendTask", () => {
    it("delegates to the underlying sendTask with opts", async () => {
      mockSendTask.mockResolvedValue(SAMPLE_TASK_RESULT);
      const port = createA2AClientPort(fetch, BASE_URL, BEARER);

      const result = await port.sendTask(SAMPLE_PARAMS);

      expect(result).toEqual(SAMPLE_TASK_RESULT);
      expect(mockSendTask).toHaveBeenCalledWith(
        { baseUrl: BASE_URL, bearerToken: BEARER },
        SAMPLE_PARAMS,
      );
    });

    it("propagates HTTP errors", async () => {
      mockSendTask.mockRejectedValue(
        new Error("A2A tasks/send failed: 403 Forbidden"),
      );
      const port = createA2AClientPort(fetch, BASE_URL, BEARER);

      await expect(port.sendTask(SAMPLE_PARAMS)).rejects.toThrow(
        "A2A tasks/send failed: 403",
      );
    });

    it("propagates JSON-RPC error envelopes", async () => {
      mockSendTask.mockRejectedValue(
        new Error("authentication required"),
      );
      const port = createA2AClientPort(fetch, BASE_URL, BEARER);

      await expect(port.sendTask(SAMPLE_PARAMS)).rejects.toThrow(
        "authentication required",
      );
    });

    it("propagates network errors", async () => {
      mockSendTask.mockRejectedValue(new TypeError("fetch failed"));
      const port = createA2AClientPort(fetch, BASE_URL);

      await expect(port.sendTask(SAMPLE_PARAMS)).rejects.toThrow(
        "fetch failed",
      );
    });

    it("propagates AbortError on timeout", async () => {
      mockSendTask.mockRejectedValue(
        new DOMException("The operation was aborted.", "AbortError"),
      );
      const port = createA2AClientPort(fetch, BASE_URL);

      await expect(port.sendTask(SAMPLE_PARAMS)).rejects.toThrow("aborted");
    });
  });

  describe("streamTask", () => {
    it("yields events from the underlying streamTask", async () => {
      async function* fakeStream() {
        yield makeStatusEvent("working", false);
        yield makeStatusEvent("completed", true);
      }
      mockStreamTask.mockImplementation(fakeStream);
      const port = createA2AClientPort(fetch, BASE_URL, BEARER);

      const events: A2AEvent[] = [];
      for await (const event of port.streamTask(SAMPLE_PARAMS)) {
        events.push(event);
      }

      expect(events).toHaveLength(2);
      expect(events[0].status.state).toBe("working");
      expect(events[1].status.state).toBe("completed");
      expect(mockStreamTask).toHaveBeenCalledWith(
        { baseUrl: BASE_URL, bearerToken: BEARER },
        SAMPLE_PARAMS,
        undefined,
      );
    });

    it("passes the abort signal through", async () => {
      async function* fakeStream() {
        yield makeStatusEvent("working", false);
      }
      mockStreamTask.mockImplementation(fakeStream);
      const port = createA2AClientPort(fetch, BASE_URL);
      const controller = new AbortController();

      const events: A2AEvent[] = [];
      for await (const event of port.streamTask(SAMPLE_PARAMS, controller.signal)) {
        events.push(event);
      }

      expect(mockStreamTask).toHaveBeenCalledWith(
        { baseUrl: BASE_URL, bearerToken: undefined },
        SAMPLE_PARAMS,
        controller.signal,
      );
    });

    it("propagates HTTP errors from the initial fetch", async () => {
      // eslint-disable-next-line require-yield -- throws immediately, no iteration
      async function* failingStream() {
        throw new Error("A2A tasks/sendSubscribe failed: 502 Bad Gateway");
      }
      mockStreamTask.mockImplementation(failingStream);
      const port = createA2AClientPort(fetch, BASE_URL);

      const iter = port.streamTask(SAMPLE_PARAMS);
      await expect(iter.next()).rejects.toThrow("502 Bad Gateway");
    });

    it("propagates AbortError when signal is aborted mid-stream", async () => {
      async function* abortingStream() {
        yield makeStatusEvent("working", false);
        throw new DOMException("The operation was aborted.", "AbortError");
      }
      mockStreamTask.mockImplementation(abortingStream);
      const port = createA2AClientPort(fetch, BASE_URL);

      const iter = port.streamTask(SAMPLE_PARAMS);
      const first = await iter.next();
      expect(first.done).toBe(false);
      await expect(iter.next()).rejects.toThrow("aborted");
    });

    it("propagates network errors mid-stream", async () => {
      async function* networkErrorStream() {
        yield makeStatusEvent("working", false);
        throw new TypeError("fetch failed");
      }
      mockStreamTask.mockImplementation(networkErrorStream);
      const port = createA2AClientPort(fetch, BASE_URL);

      const iter = port.streamTask(SAMPLE_PARAMS);
      await iter.next(); // working
      await expect(iter.next()).rejects.toThrow("fetch failed");
    });

    it("handles an empty stream (no events)", async () => {
      async function* emptyStream() {
        // yields nothing
      }
      mockStreamTask.mockImplementation(emptyStream);
      const port = createA2AClientPort(fetch, BASE_URL);

      const events: A2AEvent[] = [];
      for await (const event of port.streamTask(SAMPLE_PARAMS)) {
        events.push(event);
      }

      expect(events).toHaveLength(0);
    });

    it("propagates 'no body' errors from the underlying client", async () => {
      // eslint-disable-next-line require-yield -- throws immediately, no iteration
      async function* noBodyStream(): AsyncGenerator<A2AEvent> {
        throw new Error("A2A stream response has no body");
      }
      mockStreamTask.mockImplementation(noBodyStream);
      const port = createA2AClientPort(fetch, BASE_URL);

      const iter = port.streamTask(SAMPLE_PARAMS);
      await expect(iter.next()).rejects.toThrow("no body");
    });
  });
});

// ── createInMemoryA2AClientPort tests ─────────────────────────────────────────

describe("createInMemoryA2AClientPort", () => {
  describe("fetchAgentCard", () => {
    it("returns the handler result", async () => {
      const port = createInMemoryA2AClientPort({
        fetchAgentCard: async () => SAMPLE_AGENT_CARD,
      });

      const result = await port.fetchAgentCard();
      expect(result).toEqual(SAMPLE_AGENT_CARD);
    });

    it("throws when handler is not provided", () => {
      const port = createInMemoryA2AClientPort({});

      expect(() => port.fetchAgentCard()).toThrow(
        "InMemoryA2AClientPort: fetchAgentCard not implemented",
      );
    });

    it("propagates handler errors", async () => {
      const port = createInMemoryA2AClientPort({
        fetchAgentCard: async () => {
          throw new Error("network down");
        },
      });

      await expect(port.fetchAgentCard()).rejects.toThrow("network down");
    });
  });

  describe("sendTask", () => {
    it("returns the handler result", async () => {
      const port = createInMemoryA2AClientPort({
        sendTask: async () => SAMPLE_TASK_RESULT,
      });

      const result = await port.sendTask(SAMPLE_PARAMS);
      expect(result).toEqual(SAMPLE_TASK_RESULT);
    });

    it("throws when handler is not provided", () => {
      const port = createInMemoryA2AClientPort({});

      expect(() => port.sendTask(SAMPLE_PARAMS)).toThrow(
        "InMemoryA2AClientPort: sendTask not implemented",
      );
    });

    it("propagates handler errors", async () => {
      const port = createInMemoryA2AClientPort({
        sendTask: async () => {
          throw new Error("RPC error");
        },
      });

      await expect(port.sendTask(SAMPLE_PARAMS)).rejects.toThrow("RPC error");
    });

    it("passes params to the handler", async () => {
      const handler = vi.fn().mockResolvedValue(SAMPLE_TASK_RESULT);
      const port = createInMemoryA2AClientPort({ sendTask: handler });

      await port.sendTask(SAMPLE_PARAMS);
      expect(handler).toHaveBeenCalledWith(SAMPLE_PARAMS);
    });
  });

  describe("streamTask", () => {
    it("yields events from the handler", async () => {
      const port = createInMemoryA2AClientPort({
        async *streamTask() {
          yield makeStatusEvent("working", false);
          yield makeStatusEvent("completed", true);
        },
      });

      const events: A2AEvent[] = [];
      for await (const event of port.streamTask(SAMPLE_PARAMS)) {
        events.push(event);
      }

      expect(events).toHaveLength(2);
      expect(events[0].status.state).toBe("working");
      expect(events[1].status.state).toBe("completed");
    });

    it("throws when handler is not provided", async () => {
      const port = createInMemoryA2AClientPort({});

      await expect(
        port.streamTask(SAMPLE_PARAMS).next(),
      ).rejects.toThrow(
        "InMemoryA2AClientPort: streamTask not implemented",
      );
    });

    it("propagates handler errors mid-stream", async () => {
      const port = createInMemoryA2AClientPort({
        async *streamTask() {
          yield makeStatusEvent("working", false);
          throw new Error("stream broken");
        },
      });

      const iter = port.streamTask(SAMPLE_PARAMS);
      await iter.next(); // working
      await expect(iter.next()).rejects.toThrow("stream broken");
    });

    it("handles an empty stream", async () => {
      const port = createInMemoryA2AClientPort({
        async *streamTask() {
          // yields nothing
        },
      });

      const events: A2AEvent[] = [];
      for await (const event of port.streamTask(SAMPLE_PARAMS)) {
        events.push(event);
      }

      expect(events).toHaveLength(0);
    });

    it("passes signal to the handler", async () => {
      const handler = vi.fn(async function* () {
        yield makeStatusEvent("completed", true);
      });
      const port = createInMemoryA2AClientPort({ streamTask: handler });
      const controller = new AbortController();

      const events: A2AEvent[] = [];
      for await (const event of port.streamTask(SAMPLE_PARAMS, controller.signal)) {
        events.push(event);
      }

      expect(handler).toHaveBeenCalledWith(SAMPLE_PARAMS, controller.signal);
    });

    it("propagates AbortError from the handler", async () => {
      const port = createInMemoryA2AClientPort({
        // eslint-disable-next-line require-yield -- throws immediately, no iteration
        async *streamTask() {
          throw new DOMException("The operation was aborted.", "AbortError");
        },
      });

      const iter = port.streamTask(SAMPLE_PARAMS);
      await expect(iter.next()).rejects.toThrow("aborted");
    });
  });
});
