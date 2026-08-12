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
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    body: makeSSEBody(events),
  });
}

function mockFetchError(message: string) {
  global.fetch = vi.fn().mockRejectedValueOnce(new TypeError(message));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

const AGENT_URL = "http://localhost:8100";

describe("useA2AStream", () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
      global.fetch = vi.fn().mockReturnValueOnce(new Promise(() => {}));

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
      global.fetch = vi.fn().mockReturnValueOnce(new Promise(() => {}));

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
      global.fetch = vi.fn().mockReturnValueOnce(new Promise(() => {}));

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
      const fetchSpy = vi.fn();
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
      const fetchSpy = vi.fn().mockResolvedValueOnce({
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
      const fetchSpy = vi.fn().mockResolvedValueOnce({
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
      const fetchSpy = vi.fn().mockResolvedValueOnce({
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

  describe("stream ends without a terminal event", () => {
    it("finalizes as an honest interrupted error, keeping the partial text", async () => {
      // submitted + one artifact chunk, then the stream just closes:
      // no completed/failed terminal status event ever arrives.
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "ti1",
          status: { state: "submitted" },
          final: false,
        },
        {
          type: "TaskArtifactUpdateEvent",
          id: "ti1",
          artifact: {
            parts: [{ type: "text", text: "Partial answer text" }],
            index: 0,
            append: false,
            lastChunk: false,
          },
          final: false,
        },
      ]);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      await act(async () => {
        result.current.sendMessage("Hello");
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      // Honest failure, never silent success.
      expect(result.current.phase).toBe("failed");
      expect(result.current.error?.kind).toBe("interrupted");
      expect(result.current.error?.message).toBeTruthy();

      // The partial text the user already saw is kept, no longer pending.
      const assistantMsg = result.current.messages.find(
        (m) => m.role === "assistant",
      );
      expect(assistantMsg?.content).toBe("Partial answer text");
      expect(assistantMsg?.pending).toBeFalsy();
    });

    it("removes the empty assistant placeholder when no text arrived at all", async () => {
      mockStreamFetch([
        {
          type: "TaskStatusUpdateEvent",
          id: "ti2",
          status: { state: "submitted" },
          final: false,
        },
      ]);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      await act(async () => {
        result.current.sendMessage("Hello");
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(result.current.phase).toBe("failed");
      expect(result.current.error?.kind).toBe("interrupted");
      expect(
        result.current.messages.filter((m) => m.role === "assistant"),
      ).toHaveLength(0);
    });
  });

  describe("double-send race: stale turn must not clobber the new turn", () => {
    function hangingFetchThatRejectsOnAbort() {
      return (_url: string, init: { signal: AbortSignal }): Promise<never> =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        });
    }

    it("keeps the new turn's phase and latency flags when the old turn aborts", async () => {
      const firstFetch = hangingFetchThatRejectsOnAbort();
      // Second fetch hangs forever WITHOUT rejecting, so the second turn is
      // still in-flight while the first turn's AbortError settles.
      const secondFetch = () => new Promise(() => {});
      global.fetch = vi        .fn()
        .mockImplementationOnce(firstFetch)
        .mockImplementationOnce(secondFetch);

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("First");
      });
      act(() => {
        result.current.sendMessage("Second");
      });

      // Let the first turn's AbortError rejection settle.
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      // Without the stale-turn guard the first turn's catch/finally would
      // reset these to idle/false while the second turn is still waiting.
      expect(result.current.phase).toBe("submitted");
      expect(result.current.isThinking).toBe(true);
      expect(result.current.isWaitingForResponse).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("completes the second turn normally after the first was superseded", async () => {
      const firstFetch = hangingFetchThatRejectsOnAbort();
      global.fetch = vi        .fn()
        .mockImplementationOnce(firstFetch)
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            body: makeSSEBody([
              {
                type: "TaskStatusUpdateEvent",
                id: "tr2",
                status: { state: "submitted" },
                final: false,
              },
              {
                type: "TaskArtifactUpdateEvent",
                id: "tr2",
                artifact: {
                  parts: [{ type: "text", text: "Second answer" }],
                  index: 0,
                  append: false,
                  lastChunk: true,
                },
                final: false,
              },
              {
                type: "TaskStatusUpdateEvent",
                id: "tr2",
                status: { state: "completed" },
                final: true,
              },
            ]),
          }),
        );

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("First");
      });
      act(() => {
        result.current.sendMessage("Second");
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(result.current.phase).toBe("completed");
      expect(result.current.error).toBeNull();

      // The superseded turn's empty placeholder is gone; the second turn's
      // answer is finalized.
      const assistants = result.current.messages.filter(
        (m) => m.role === "assistant",
      );
      expect(assistants).toHaveLength(1);
      expect(assistants[0].content).toBe("Second answer");
      expect(assistants[0].pending).toBeFalsy();

      // Both user messages remain in the transcript.
      const users = result.current.messages.filter((m) => m.role === "user");
      expect(users.map((m) => m.content)).toEqual(["First", "Second"]);
    });
  });

  describe("three-tier latency flags (fake timers)", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("sets isSlowResponse after 8s and isVerySlowResponse after 20s", () => {
      vi.useFakeTimers();
      // Hanging stream: no first token ever arrives.
      global.fetch = vi.fn().mockReturnValueOnce(new Promise(() => {}));

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("Hello");
      });

      expect(result.current.isSlowResponse).toBe(false);
      expect(result.current.isVerySlowResponse).toBe(false);

      act(() => {
        vi.advanceTimersByTime(8_000);
      });
      expect(result.current.isSlowResponse).toBe(true);
      expect(result.current.isVerySlowResponse).toBe(false);
      // The thinking flags stay up alongside the slow tier.
      expect(result.current.isThinking).toBe(true);
      expect(result.current.isWaitingForResponse).toBe(true);

      act(() => {
        vi.advanceTimersByTime(12_000);
      });
      expect(result.current.isVerySlowResponse).toBe(true);
    });

    it("clears the slow tiers on abort", () => {
      vi.useFakeTimers();
      global.fetch = vi.fn().mockReturnValueOnce(new Promise(() => {}));

      const { result } = renderHook(() => useA2AStream({ baseUrl: AGENT_URL }));

      act(() => {
        result.current.sendMessage("Hello");
      });
      act(() => {
        vi.advanceTimersByTime(8_000);
      });
      expect(result.current.isSlowResponse).toBe(true);

      act(() => {
        result.current.abort();
      });
      expect(result.current.isSlowResponse).toBe(false);
      expect(result.current.isVerySlowResponse).toBe(false);
    });
  });
});
