"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  streamTask,
  buildTextTurnParams,
  type A2AClientOptions,
  type A2AEvent,
  type SourceRef,
  type ToolCallEvent,
  type PendingReview,
} from "@/lib/a2a-client";

// ── Timing thresholds for the three-tier latency UI ──────────────────────────

const SLOW_RESPONSE_MS = 8_000;
const VERY_SLOW_RESPONSE_MS = 20_000;

// ── State types ───────────────────────────────────────────────────────────────

export type StreamErrorKind =
  | "network"
  | "auth"
  | "agent_failed"
  | "empty_message"
  | "timeout"
  | "aborted"
  | "unknown";

export interface StreamError {
  kind: StreamErrorKind;
  message: string;
  /** Raw error_key from A2A metadata, if present. */
  errorKey?: string;
}

export type StreamPhase =
  | "idle"
  | "submitted"
  | "thinking"
  | "working"
  | "streaming"
  | "completed"
  | "failed";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** True while the assistant message is still streaming. */
  pending?: boolean;
  /** Citations attached to this assistant message. */
  sourceRefs?: SourceRef[];
  /** Tool calls the agent invoked. */
  toolCalls?: ToolCallEvent[];
  /** Pending reviews awaiting human approval (HITL). */
  pendingReviews?: PendingReview[];
  /** Server-assigned thread id (available after first turn). */
  threadId?: string;
  createdAt: string;
}

export interface UseA2AStreamState {
  /** All messages in the current conversation. */
  messages: ChatMessage[];
  /** Current streaming phase driving the three-tier latency UI. */
  phase: StreamPhase;
  /** The assistant text being streamed (partial; not yet in messages[]). */
  streamingText: string;
  /** True when the agent is in a reasoning/thinking state (no tokens yet). */
  isThinking: boolean;
  /** True when we are waiting for the first token after submission. */
  isWaitingForResponse: boolean;
  /** True after SLOW_RESPONSE_MS without completion. */
  isSlowResponse: boolean;
  /** True after VERY_SLOW_RESPONSE_MS without completion. */
  isVerySlowResponse: boolean;
  /** Non-null on terminal error. */
  error: StreamError | null;
  /** Server-assigned thread id (carry forward for conversation continuity). */
  threadId: string | null;
}

export interface UseA2AStreamActions {
  /** Send a user message and start streaming the assistant response. */
  sendMessage: (
    text: string,
    opts?: {
      orgId?: string;
      scope?: Record<string, unknown>;
    },
  ) => void;
  /** Abort the current streaming turn. */
  abort: () => void;
  /** Clear messages and reset to idle. */
  clearThread: () => void;
}

export type UseA2AStreamResult = UseA2AStreamState & UseA2AStreamActions;

// ── Hook ──────────────────────────────────────────────────────────────────────

function resolveBaseUrl(): string {
  if (typeof process !== "undefined") {
    const envUrl = process.env.NEXT_PUBLIC_CR_AGENT_URL;
    if (envUrl) return envUrl.replace(/\/$/, "");
  }
  return "";
}

function makeId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function classifyError(err: unknown, errorKey?: string): StreamError {
  if (errorKey === "byok_key_failure") {
    return {
      kind: "auth",
      message: "AI provider key missing or invalid",
      errorKey,
    };
  }
  if (errorKey === "ERROR_EMPTY_MESSAGE") {
    return {
      kind: "empty_message",
      message: "Message cannot be empty",
      errorKey,
    };
  }
  if (err instanceof Error && err.name === "AbortError") {
    return { kind: "aborted", message: "Request was cancelled" };
  }
  if (err instanceof TypeError && err.message.includes("fetch")) {
    return {
      kind: "network",
      message: "Network error: could not reach the agent",
    };
  }
  if (errorKey?.startsWith("ERROR_")) {
    return { kind: "agent_failed", message: errorKey, errorKey };
  }
  return { kind: "unknown", message: String(err) };
}

/**
 * React hook that manages a streaming A2A turn.
 *
 * Wraps streamTask() from a2a-client.ts and drives the three-tier latency
 * UI state (thinking / waiting / slow response).
 *
 * @param clientOpts A2AClientOptions — base URL + optional bearer token.
 *   Base URL defaults to NEXT_PUBLIC_CR_AGENT_URL.
 */
export function useA2AStream(
  clientOpts?: Partial<A2AClientOptions>,
): UseA2AStreamResult {
  const baseUrl = clientOpts?.baseUrl ?? resolveBaseUrl();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<StreamPhase>("idle");
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<StreamError | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  // Latency tier flags — derived from phase + timers; managed as refs to
  // avoid re-render storms during the streaming hot path.
  const [isThinking, setIsThinking] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isSlowResponse, setIsSlowResponse] = useState(false);
  const [isVerySlowResponse, setIsVerySlowResponse] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verySlowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guards state updates from a stream that outlives the component: on
  // unmount the in-flight turn is aborted and late setState calls are dropped.
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
      if (verySlowTimerRef.current) clearTimeout(verySlowTimerRef.current);
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    if (verySlowTimerRef.current) clearTimeout(verySlowTimerRef.current);
    slowTimerRef.current = null;
    verySlowTimerRef.current = null;
  }, []);

  const resetLatencyFlags = useCallback(() => {
    setIsThinking(false);
    setIsWaitingForResponse(false);
    setIsSlowResponse(false);
    setIsVerySlowResponse(false);
    clearTimers();
  }, [clearTimers]);

  const startSlowTimers = useCallback(() => {
    clearTimers();
    slowTimerRef.current = setTimeout(() => {
      setIsSlowResponse(true);
    }, SLOW_RESPONSE_MS);
    verySlowTimerRef.current = setTimeout(() => {
      setIsVerySlowResponse(true);
    }, VERY_SLOW_RESPONSE_MS);
  }, [clearTimers]);

  const sendMessage = useCallback(
    (
      text: string,
      opts?: { orgId?: string; scope?: Record<string, unknown> },
    ) => {
      if (!text.trim()) return;

      // Cancel any running turn.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Optimistic: add the user message immediately.
      const userMsgId = makeId();
      const assistantMsgId = makeId();
      const now = new Date().toISOString();

      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          role: "user",
          content: text,
          createdAt: now,
        },
        {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          pending: true,
          createdAt: now,
        },
      ]);

      setPhase("submitted");
      setStreamingText("");
      setError(null);
      setIsThinking(true);
      setIsWaitingForResponse(true);
      setIsSlowResponse(false);
      setIsVerySlowResponse(false);
      startSlowTimers();

      const opts_client: A2AClientOptions = {
        baseUrl,
        bearerToken: clientOpts?.bearerToken,
        guestSessionId: clientOpts?.guestSessionId,
      };

      const params = buildTextTurnParams(text, {
        threadId: threadId ?? undefined,
        orgId: opts?.orgId,
        scope: opts?.scope,
        guestSessionId: clientOpts?.guestSessionId,
      });

      let accumulated = "";
      let finalThreadId: string | null = null;
      let finalSourceRefs: SourceRef[] | undefined;
      let finalToolCalls: ToolCallEvent[] | undefined;
      let finalPendingReviews: PendingReview[] | undefined;

      async function run() {
        try {
          const stream = streamTask(opts_client, params, controller.signal);

          for await (const event of stream) {
            if (controller.signal.aborted) break;

            processEvent(event);
          }

          // Stream completed — finalize the assistant message.
          if (!controller.signal.aborted) {
            if (finalThreadId) setThreadId(finalThreadId);

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: accumulated,
                      pending: false,
                      sourceRefs: finalSourceRefs,
                      toolCalls: finalToolCalls,
                      pendingReviews: finalPendingReviews,
                      threadId: finalThreadId ?? undefined,
                    }
                  : m,
              ),
            );
            setStreamingText("");
            setPhase("completed");
          }
        } catch (err) {
          if (!mountedRef.current) return;
          if (controller.signal.aborted) {
            setPhase("idle");
          } else {
            const streamError = classifyError(err);
            setError(streamError);
            setPhase("failed");
            // Remove the pending assistant message on hard failure.
            setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
          }
        } finally {
          if (mountedRef.current) {
            resetLatencyFlags();
            setStreamingText("");
          }
        }
      }

      function processEvent(event: A2AEvent) {
        if (!mountedRef.current) return;
        if (event.type === "TaskStatusUpdateEvent") {
          const state = event.status.state;

          // Extract thread_id from metadata whenever it appears.
          const meta = event.metadata;
          if (meta?.thread_id) {
            finalThreadId = meta.thread_id;
          }

          if (state === "submitted") {
            setPhase("submitted");
            return;
          }

          if (state === "working") {
            // A "working" event after we already have text means a tool event.
            if (accumulated.length === 0) {
              setPhase("thinking");
              setIsThinking(true);
              setIsWaitingForResponse(true);
            }
            return;
          }

          if (state === "completed" || state === "input-required") {
            clearTimers();
            // Extract citations from the terminal event metadata.
            if (meta?.source_refs) {
              finalSourceRefs = meta.source_refs as SourceRef[];
            }
            if (meta?.tool_calls) {
              finalToolCalls = meta.tool_calls as ToolCallEvent[];
            }
            if (meta?.pending_reviews) {
              finalPendingReviews = meta.pending_reviews as PendingReview[];
            }
            if (meta?.thread_id) {
              finalThreadId = meta.thread_id;
            }
            setPhase("completed");
            return;
          }

          if (state === "failed") {
            const errorKey = String(
              meta?.error_key ?? meta?.reason ?? "ERROR_A2A_INTERNAL",
            );
            const streamError = classifyError(new Error(errorKey), errorKey);
            setError(streamError);
            setPhase("failed");
            setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
            clearTimers();
            return;
          }
        }

        if (event.type === "TaskArtifactUpdateEvent") {
          const text = event.artifact.parts
            .filter((p) => p.type === "text")
            .map((p) => (p as { type: "text"; text: string }).text)
            .join("");

          if (text) {
            // First token: transition from thinking/waiting to streaming.
            setIsThinking(false);
            setIsWaitingForResponse(false);
            setPhase("streaming");

            accumulated += text;
            setStreamingText(accumulated);

            // Update the pending assistant message with live text.
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, content: accumulated } : m,
              ),
            );
          }

          // Citations may arrive on the last artifact chunk.
          const meta = event.metadata;
          if (meta?.source_refs) {
            finalSourceRefs = meta.source_refs as SourceRef[];
          }
          if (meta?.tool_calls) {
            finalToolCalls = meta.tool_calls as ToolCallEvent[];
          }
          if (meta?.thread_id) {
            finalThreadId = meta.thread_id;
          }
        }
      }

      void run();
    },
    [
      baseUrl,
      clientOpts?.bearerToken,
      clientOpts?.guestSessionId,
      threadId,
      startSlowTimers,
      clearTimers,
      resetLatencyFlags,
    ],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setPhase("idle");
    resetLatencyFlags();
    setStreamingText("");
    // Remove any pending assistant message.
    setMessages((prev) => prev.filter((m) => !m.pending));
  }, [resetLatencyFlags]);

  const clearThread = useCallback(() => {
    abort();
    setMessages([]);
    setError(null);
    setThreadId(null);
    setPhase("idle");
  }, [abort]);

  return {
    messages,
    phase,
    streamingText,
    isThinking,
    isWaitingForResponse,
    isSlowResponse,
    isVerySlowResponse,
    error,
    threadId,
    sendMessage,
    abort,
    clearThread,
  };
}
