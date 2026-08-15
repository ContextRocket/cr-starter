/**
 * Port for the A2A client — decouples consumers from the fetch-based implementation.
 *
 * A2AClientPort is the contract; createA2AClientPort wraps the real fetch-based
 * client; createInMemoryA2AClientPort provides a test double.
 */

import type { A2ATaskParams, A2AEvent } from "@/lib/a2a-client";
import {
  fetchAgentCard,
  sendTask,
  streamTask,
} from "@/lib/a2a-client";

// Re-export types so consumers can import from the port module.
export type { A2ATaskParams, A2AEvent };

// ── Port interface ─────────────────────────────────────────────────────────────

export interface A2AClientPort {
  fetchAgentCard(): Promise<unknown>;
  sendTask(params: A2ATaskParams): Promise<Record<string, unknown>>;
  streamTask(params: A2ATaskParams, signal?: AbortSignal): AsyncGenerator<A2AEvent>;
}

// ── Production adapter ─────────────────────────────────────────────────────────

/**
 * Create an A2AClientPort backed by real fetch calls to a CR agent backend.
 *
 * @param fetchImpl  The fetch function (globalThis.fetch or a custom wrapper).
 * @param baseUrl    Base URL of the CR agent backend.
 * @param bearerToken  Optional JWT for authenticated requests.
 */
export function createA2AClientPort(
  fetchImpl: typeof fetch,
  baseUrl: string,
  bearerToken?: string,
): A2AClientPort {
  void fetchImpl; // reserved for future injection; current module-level functions use global fetch
  const opts = { baseUrl, bearerToken };

  return {
    fetchAgentCard() {
      return fetchAgentCard(baseUrl);
    },
    sendTask(params: A2ATaskParams) {
      return sendTask(opts, params);
    },
    async *streamTask(params: A2ATaskParams, signal?: AbortSignal) {
      yield* streamTask(opts, params, signal);
    },
  };
}

// ── In-memory test double ──────────────────────────────────────────────────────

/**
 * Create an in-memory A2AClientPort backed by caller-supplied handler functions.
 *
 * Each method is optional; omitting one makes it throw so tests that hit an
 * unexpected path fail loudly.
 */
export function createInMemoryA2AClientPort(handler: {
  fetchAgentCard?: () => Promise<unknown>;
  sendTask?: (params: A2ATaskParams) => Promise<Record<string, unknown>>;
  streamTask?: (params: A2ATaskParams, signal?: AbortSignal) => AsyncGenerator<A2AEvent>;
}): A2AClientPort {
  return {
    fetchAgentCard() {
      if (!handler.fetchAgentCard) {
        throw new Error("InMemoryA2AClientPort: fetchAgentCard not implemented");
      }
      return handler.fetchAgentCard();
    },
    sendTask(params: A2ATaskParams) {
      if (!handler.sendTask) {
        throw new Error("InMemoryA2AClientPort: sendTask not implemented");
      }
      return handler.sendTask(params);
    },
    async *streamTask(params: A2ATaskParams, signal?: AbortSignal) {
      if (!handler.streamTask) {
        throw new Error("InMemoryA2AClientPort: streamTask not implemented");
      }
      yield* handler.streamTask(params, signal);
    },
  };
}
