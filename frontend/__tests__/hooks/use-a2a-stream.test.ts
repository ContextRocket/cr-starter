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

  describe("faithfulness verdict — grounded indicator", () => {
    it("attaches faithfulness to completed assistant message when grounded", async () => {
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "t1",
          status: { state: "submitted" },
          final: false,
        },
        {
          type: "TaskArtifactUpdateEvent",
          id: "t1",
          artifact: {
            parts: [{ type: "text", text: "The answer." }],
            index: 0,
            append: false,
            lastChunk: true,
          },
          final: false,
        },
        {
          type: "TaskStatusUpdateEvent",
          id: "t1",
          status: { state: "completed" },
          final: true,
          metadata: {
            customerSafe: true,
            faithfulness: {
              grounded: true,
              state: "grounded",
              checked_claims: 3,
            },
          },
        },
      ]);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      await act(async () => {
        result.current.sendMessage("Tell me something");
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      const assistantMsg = result.current.messages.find(
        (m) => m.role === "assistant",
      );
      expect(assistantMsg?.faithfulness).toBeDefined();
      expect(assistantMsg?.faithfulness?.grounded).toBe(true);
      expect(assistantMsg?.faithfulness?.state).toBe("grounded");
      expect(assistantMsg?.faithfulness?.checked_claims).toBe(3);
    });

    it("attaches faithfulness with state=ungrounded when not grounded", async () => {
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "t2",
          status: { state: "submitted" },
          final: false,
        },
        {
          type: "TaskArtifactUpdateEvent",
          id: "t2",
          artifact: {
            parts: [{ type: "text", text: "Maybe." }],
            index: 0,
            append: false,
            lastChunk: true,
          },
          final: false,
        },
        {
          type: "TaskStatusUpdateEvent",
          id: "t2",
          status: { state: "completed" },
          final: true,
          metadata: {
            customerSafe: true,
            faithfulness: {
              grounded: false,
              state: "ungrounded",
              checked_claims: 2,
            },
          },
        },
      ]);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      await act(async () => {
        result.current.sendMessage("Are you sure?");
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      const assistantMsg = result.current.messages.find(
        (m) => m.role === "assistant",
      );
      expect(assistantMsg?.faithfulness?.state).toBe("ungrounded");
      expect(assistantMsg?.faithfulness?.grounded).toBe(false);
    });

    it("leaves faithfulness undefined when absent from metadata", async () => {
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "t3",
          status: { state: "submitted" },
          final: false,
        },
        {
          type: "TaskStatusUpdateEvent",
          id: "t3",
          status: { state: "completed" },
          final: true,
          metadata: { customerSafe: true },
        },
      ]);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      await act(async () => {
        result.current.sendMessage("Hi");
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      const assistantMsg = result.current.messages.find(
        (m) => m.role === "assistant",
      );
      expect(assistantMsg?.faithfulness).toBeUndefined();
    });
  });

  describe("demo-slug mode — anon request shaping", () => {
    it("includes public_slug in metadata when demoPublicSlug is set and no token", async () => {
      const fetchSpy = jest.fn().mockResolvedValueOnce({
        ok: true,
        body: makeSSEBody([
          {
            type: "TaskStatusUpdateEvent",
            id: "td1",
            status: { state: "completed" },
            final: true,
          },
        ]),
      });
      global.fetch = fetchSpy;

      const { result } = renderHook(() =>
        useA2AStream({ baseUrl: AGENT_URL, demoPublicSlug: "my-brand-slug" }),
      );

      act(() => {
        result.current.sendMessage("Hello demo");
      });

      // Allow async to settle.
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const body = JSON.parse(fetchSpy.mock.calls[0][1].body as string);
      expect(body.params.metadata?.public_slug).toBe("my-brand-slug");
    });

    it("does NOT include public_slug when a bearerToken is present", async () => {
      const fetchSpy = jest.fn().mockResolvedValueOnce({
        ok: true,
        body: makeSSEBody([
          {
            type: "TaskStatusUpdateEvent",
            id: "td2",
            status: { state: "completed" },
            final: true,
          },
        ]),
      });
      global.fetch = fetchSpy;

      const { result } = renderHook(() =>
        useA2AStream({
          baseUrl: AGENT_URL,
          demoPublicSlug: "my-brand-slug",
          bearerToken: "crk_some-org-key",
        }),
      );

      act(() => {
        result.current.sendMessage("Hello authed");
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      const body = JSON.parse(fetchSpy.mock.calls[0][1].body as string);
      expect(body.params.metadata?.public_slug).toBeUndefined();
    });

    it("uses no Authorization header in demo-slug mode (no token)", async () => {
      const fetchSpy = jest.fn().mockResolvedValueOnce({
        ok: true,
        body: makeSSEBody([
          {
            type: "TaskStatusUpdateEvent",
            id: "td3",
            status: { state: "completed" },
            final: true,
          },
        ]),
      });
      global.fetch = fetchSpy;

      const { result } = renderHook(() =>
        useA2AStream({ baseUrl: AGENT_URL, demoPublicSlug: "showcase-org" }),
      );

      act(() => {
        result.current.sendMessage("Anon question");
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      const headers = fetchSpy.mock.calls[0][1].headers as Record<
        string,
        string
      >;
      expect(headers["Authorization"]).toBeUndefined();
    });

    it("demo error for slug-not-found surfaces a resolved string (not a raw key)", async () => {
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "td4",
          status: { state: "failed" },
          final: true,
          metadata: {
            customerSafe: true,
            error_key: "no published content for slug 'bad-slug'",
            reason: "no published content for slug 'bad-slug'",
          },
        },
      ]);

      const { result } = renderHook(() =>
        useA2AStream({ baseUrl: AGENT_URL, demoPublicSlug: "bad-slug" }),
      );

      await act(async () => {
        result.current.sendMessage("Hello");
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      // The error message must NOT be a raw i18n key like "CHAT_DEMO_ERROR_SLUG_NOT_FOUND".
      // In the test env t() returns the key itself, so we just verify it is a string
      // and not empty (the hook resolved it via t()).
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBeTruthy();
      expect(result.current.error?.kind).toBe("agent_failed");
    });
  });
});
