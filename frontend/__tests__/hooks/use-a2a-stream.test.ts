/**
 * Tests for useA2AStream hook — state transition coverage.
 *
 * Uses mocked fetch / SSE stream (no live network calls).
 */

import { renderHook, act } from "@testing-library/react";
import { useA2AStream } from "@/hooks/use-a2a-stream";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSSEBody(
  events: Record<string, unknown>[],
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const chunks = events.map((e) =>
    encoder.encode(
      `data: ${JSON.stringify({ jsonrpc: "2.0", id: "r1", result: e })}\n\n`,
    ),
  );

  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

function mockStreamFetch(events: Record<string, unknown>[]) {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    body: makeSSEBody(events),
  });
}

function mockFetchError(message: string) {
  global.fetch = jest.fn().mockRejectedValueOnce(new TypeError(message));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

const AGENT_URL = "http://localhost:8100";

describe("useA2AStream", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("initial state", () => {
    it("starts in idle phase with no messages", () => {
      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));
      expect(result.current.phase).toBe("idle");
      expect(result.current.messages).toHaveLength(0);
      expect(result.current.error).toBeNull();
      expect(result.current.threadId).toBeNull();
      expect(result.current.streamingText).toBe("");
      expect(result.current.isThinking).toBe(false);
      expect(result.current.isWaitingForResponse).toBe(false);
    });
  });

  describe("sendMessage — optimistic user message", () => {
    it("adds the user message immediately before fetch completes", async () => {
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "t1",
          status: { state: "submitted" },
          final: false,
        },
        {
          type: "TaskStatusUpdateEvent",
          id: "t1",
          status: { state: "completed" },
          final: true,
        },
      ]);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("Hello");
      });

      // User message is added synchronously before the async stream runs.
      const userMsg = result.current.messages.find((m) => m.role === "user");
      expect(userMsg).toBeDefined();
      expect(userMsg?.content).toBe("Hello");
    });
  });

  describe("sendMessage — phase transitions", () => {
    it("transitions from idle to submitted on send", () => {
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "t1",
          status: { state: "submitted" },
          final: false,
        },
        {
          type: "TaskStatusUpdateEvent",
          id: "t1",
          status: { state: "completed" },
          final: true,
        },
      ]);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("Hello");
      });

      expect(result.current.phase).toBe("submitted");
    });

    it("sets isThinking and isWaitingForResponse on send", () => {
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "t1",
          status: { state: "submitted" },
          final: false,
        },
        {
          type: "TaskStatusUpdateEvent",
          id: "t1",
          status: { state: "completed" },
          final: true,
        },
      ]);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("Hello");
      });

      expect(result.current.isThinking).toBe(true);
      expect(result.current.isWaitingForResponse).toBe(true);
    });
  });

  describe("abort", () => {
    it("returns to idle phase after abort", () => {
      // Never resolves — simulates a hanging stream.
      global.fetch = jest.fn().mockReturnValueOnce(new Promise(() => {}));

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("Hello");
      });

      act(() => {
        result.current.abort();
      });

      expect(result.current.phase).toBe("idle");
      expect(result.current.isThinking).toBe(false);
      expect(result.current.isWaitingForResponse).toBe(false);
    });

    it("removes the pending assistant message after abort", () => {
      global.fetch = jest.fn().mockReturnValueOnce(new Promise(() => {}));

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("Hello");
      });

      // There should be a pending assistant message.
      expect(result.current.messages.some((m) => m.pending)).toBe(true);

      act(() => {
        result.current.abort();
      });

      expect(result.current.messages.some((m) => m.pending)).toBe(false);
    });
  });

  describe("clearThread", () => {
    it("resets all state to initial values", () => {
      global.fetch = jest.fn().mockReturnValueOnce(new Promise(() => {}));

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("Hello");
      });

      act(() => {
        result.current.clearThread();
      });

      expect(result.current.messages).toHaveLength(0);
      expect(result.current.phase).toBe("idle");
      expect(result.current.error).toBeNull();
      expect(result.current.threadId).toBeNull();
    });
  });

  describe("network error handling", () => {
    it("sets error.kind=network on fetch TypeError", async () => {
      mockFetchError("Failed to fetch");

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      await act(async () => {
        result.current.sendMessage("Hello");
        // Allow microtasks to run.
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.phase).toBe("failed");
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.kind).toBe("network");
    });
  });

  describe("empty message guard", () => {
    it("does not call fetch for empty messages", () => {
      const fetchSpy = jest.fn();
      global.fetch = fetchSpy;

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("   ");
      });

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(result.current.messages).toHaveLength(0);
    });
  });
});
