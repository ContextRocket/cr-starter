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
  type FaithfulnessVerdict,
} from "@/lib/a2a-client";
import { mockStreamTask } from "@/lib/cr-sdk/adapters/a2a-mock";
import { t } from "@/i18n/keys";
import { siteConfig } from "@/config/site.config";

import type { Translator } from "@/i18n/translator";

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
  | "interrupted"
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

/**
 * Typed policy-class signal from the platform completed-event metadata.
 * severity drives card styling; content_key is the brand-authored copy key;
 * cited_source is an optional source label for the guidance card.
 */
export interface PolicyClass {
  /** Severity tier driving card color tokens. */
  class: "danger" | "attention" | "neutral";
  /** Discriminated policy tier (e.g. "escalation", "guidance", "refusal"). */
  tier: string;
  /** Brand-authored content key for the card body copy. */
  content_key: string;
  /** Optional source label shown on the card. */
  cited_source?: string;
}

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
  /**
   * Follow-up suggestion pills from the platform completed-event metadata.
   * Sourced from meta.suggestions (string[]). Never parsed from prose.
   */
  suggestions?: string[];
  /**
   * Policy-class signal from the platform completed-event metadata.
   * Sourced from meta.policy_class. Renders a styled card below the answer.
   * Absent means no card renders.
   */
  policyClass?: PolicyClass;
  /**
   * Per-answer faithfulness verdict from the platform faithfulness check.
   * Sourced from meta.faithfulness on the completed-event.
   * Absent when the turn is not closed-domain or the check did not run.
   * Mirror of _faithfulness_metadata_from_verdict in tasks.py.
   */
  faithfulness?: FaithfulnessVerdict;
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
    const envUrl =
      process.env.NEXT_PUBLIC_CR_AGENT_URL || siteConfig.chat.agentUrl;
    if (envUrl) return envUrl.replace(/\/$/, "");
  }
  return "";
}

function makeId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function classifyError(
  err: unknown,
  errorKey: string | undefined,
  isDemoMode: boolean | undefined,
  t: Translator,
): StreamError {
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
  // Demo-mode specific error surfaces: unavailable agent or denied access.
  // Use t() so error.message is already the user-facing string, not a raw key.
  if (isDemoMode) {
    if (
      errorKey === "authentication required" ||
      errorKey?.includes("authentication")
    ) {
      return {
        kind: "auth",
        message: t("chat.demo.error.unauthorized"),
        errorKey,
      };
    }
    if (errorKey?.includes("no published content")) {
      return {
        kind: "agent_failed",
        message: t("chat.demo.error.not.found"),
        errorKey,
      };
    }
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
 * @param clientOpts A2AClientOptions for direct live A2A configuration.
 *   Base URL defaults to NEXT_PUBLIC_CR_AGENT_URL.
 */
export function useA2AStream(
  clientOpts?: Partial<A2AClientOptions>,
): UseA2AStreamResult {
  // An explicit base URL in a caller is an explicit request for live A2A.
  // This keeps the hook easy to exercise in tests and useful for an embedded
  // consumer, while the site-level default remains canned demo mode.
  const mode =
    clientOpts?.mode ?? (clientOpts?.baseUrl ? "live" : siteConfig.chat.mode);
  const baseUrl =
    clientOpts?.baseUrl ?? (mode === "live" ? resolveBaseUrl() : "");
  const handle = clientOpts?.handle ?? siteConfig.chat.handle;
  const apiKey = clientOpts?.apiKey ?? siteConfig.chat.apiKey;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<StreamPhase>("idle");
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<StreamError | null>(null);
  const [threadId, setThreadId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cr_thread_id");
    }
    return null;
  });

  // Latency tier flags: derived from phase + timers; managed as refs to
  // avoid re-render storms during the streaming hot path.
  const [isThinking, setIsThinking] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isSlowResponse, setIsSlowResponse] = useState(false);
  const [isVerySlowResponse, setIsVerySlowResponse] = useState(false);

  // Persist thread ID across page refreshes and locale switches so the A2A
  // conversation continues rather than starting a new thread on remount.
  // The platform ThreadRepo resolves to the existing thread when the client
  // forwards a known thread_id.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (threadId) {
      localStorage.setItem("cr_thread_id", threadId);
    } else {
      localStorage.removeItem("cr_thread_id");
    }
  }, [threadId]);

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
    (text: string, opts?: { scope?: Record<string, unknown> }) => {
      if (!text.trim()) return;

      // Cancel any running turn.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Optimistic: add the user message immediately.
      const userMsgId = makeId();
      const assistantMsgId = makeId();
      const now = new Date().toISOString();

      // Drop any unfinished assistant placeholder from the turn we just
      // cancelled -- it will never complete and must not linger as a
      // permanently-pending bubble.
      setMessages((prev) => [
        ...prev.filter((m) => !m.pending),
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
        apiKey: apiKey || undefined,
        handle: handle || undefined,
        mode,
      };

      const params = buildTextTurnParams(text, {
        threadId: threadId ?? undefined,
        scope: opts?.scope,
        handle,
      });

      let accumulated = "";
      // Honesty guard: a stream that ends WITHOUT a terminal status event
      // (completed / input-required / failed / canceled) must not finalize
      // as success. Track whether we actually saw one.
      let sawTerminalEvent = false;
      let finalThreadId: string | null = null;
      let finalSourceRefs: SourceRef[] | undefined;
      let finalToolCalls: ToolCallEvent[] | undefined;
      let finalPendingReviews: PendingReview[] | undefined;
      let finalSuggestions: string[] | undefined;
      let finalPolicyClass: PolicyClass | undefined;
      let finalFaithfulness: FaithfulnessVerdict | undefined;

      async function run() {
        try {
          const stream =
            opts_client.mode === "live" && opts_client.baseUrl
              ? streamTask(opts_client, params, controller.signal)
              : mockStreamTask(
                  params,
                  controller.signal,
                  t("chat.mock.response"),
                );

          for await (const event of stream) {
            if (controller.signal.aborted) break;

            processEvent(event);
          }

          // Stream ended: finalize the assistant message.
          if (!controller.signal.aborted && abortRef.current === controller) {
            if (finalThreadId) setThreadId(finalThreadId);

            if (sawTerminalEvent) {
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
                        suggestions: finalSuggestions,
                        policyClass: finalPolicyClass,
                        faithfulness: finalFaithfulness,
                        threadId: finalThreadId ?? undefined,
                      }
                    : m,
                ),
              );
              setStreamingText("");
              setPhase("completed");
            } else {
              // The stream closed without a terminal event: honest error.
              // Keep any partial text the user already saw; never present
              // an interrupted answer as a completed one.
              if (accumulated.length > 0) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          content: accumulated,
                          pending: false,
                          threadId: finalThreadId ?? undefined,
                        }
                      : m,
                  ),
                );
              } else {
                setMessages((prev) =>
                  prev.filter((m) => m.id !== assistantMsgId),
                );
              }
              setError({
                kind: "interrupted",
                message: t("chat.stream.interrupted"),
              });
              setStreamingText("");
              setPhase("failed");
            }
          }
        } catch (err) {
          if (!mountedRef.current) return;
          // Stale-turn guard: when a newer sendMessage has taken over
          // (abortRef points at a different controller), this turn's
          // failure handling must not touch the new turn's state.
          if (abortRef.current !== controller) return;
          if (controller.signal.aborted) {
            setPhase("idle");
          } else {
            const streamError = classifyError(err, undefined, undefined, t);
            setError(streamError);
            setPhase("failed");
            // Remove the pending assistant message on hard failure.
            setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
          }
        } finally {
          // Same stale-turn guard: never reset the latency flags or the
          // streaming text that now belong to a newer turn.
          if (mountedRef.current && abortRef.current === controller) {
            resetLatencyFlags();
            setStreamingText("");
          }
        }
      }

      function processEvent(event: A2AEvent) {
        if (!mountedRef.current) return;
        // Events from a superseded turn must not mutate the current turn.
        if (abortRef.current !== controller) return;
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
            sawTerminalEvent = true;
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
            // Suggestion pills and policy-class card from platform metadata.
            if (
              Array.isArray(meta?.suggestions) &&
              meta.suggestions.every((s: unknown) => typeof s === "string")
            ) {
              finalSuggestions = meta.suggestions as string[];
            }
            if (
              meta?.policy_class &&
              typeof meta.policy_class === "object" &&
              meta.policy_class !== null
            ) {
              finalPolicyClass = meta.policy_class as PolicyClass;
            }
            // Faithfulness verdict: defensively read; absent = render nothing.
            // Field names mirror _faithfulness_metadata_from_verdict in tasks.py exactly.
            // meta.faithfulness is typed as FaithfulnessVerdict | undefined by A2AEventMetadata.
            if (
              meta?.faithfulness &&
              typeof meta.faithfulness.state === "string"
            ) {
              finalFaithfulness = meta.faithfulness;
            }
            setPhase("completed");
            return;
          }

          if (state === "failed" || state === "canceled") {
            sawTerminalEvent = true;
            const errorKey = String(
              meta?.error_key ?? meta?.reason ?? "ERROR_A2A_INTERNAL",
            );
            const streamError = classifyError(
              new Error(errorKey),
              errorKey,
              opts_client.mode === "demo" || Boolean(handle),
              t,
            );
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
      apiKey,
      handle,
      mode,
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
