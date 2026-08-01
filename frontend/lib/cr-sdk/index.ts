/**
 * cr-sdk -- public integration surface for ContextRocket.
 *
 * This module is the ONLY import boundary template consumers use to talk
 * to ContextRocket.  Do not import from lib/a2a-client or lib/cr-sdk/*
 * directly in components -- use this public API.
 *
 * Public API:
 *   createCRClient(config)       -- build a typed client for a specific config.
 *   client.streamTurn(...)       -- stream a user turn via A2A tasks/sendSubscribe.
 *   client.agentCard()           -- fetch /.well-known/agent.json.
 *   client.ensureToken()         -- provision/retrieve the guest or login JWT.
 *   resolveCRConfig()            -- read env vars into a CRConfig object.
 *   getStoredToken()             -- read stored bearer token.
 *   setStoredToken(token)        -- persist a bearer token.
 *   clearStoredToken()           -- remove stored token (logout).
 *
 * Relationship to a2a-client.ts:
 *   a2a-client.ts owns the low-level A2A wire protocol (SSE parser, JSON-RPC
 *   builder, streamTask, sendTask).  The cr-sdk wraps it with credential
 *   handling, config resolution, and the simplified createCRClient surface.
 *   Hooks and components import from cr-sdk, not from a2a-client directly,
 *   so the wire layer can evolve without touching consumer code.
 */

// Re-export configuration helpers.
export { resolveCRConfig } from "./config";
export type { CRConfig } from "./config";

// Re-export credential helpers (used by auth flows + logout action).
export {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  ensureToken,
} from "./credentials";

// Re-export A2A types consumers need.
export type {
  A2AClientOptions,
  A2AEvent,
  A2ATaskParams,
  TaskStatusUpdateEvent,
  TaskArtifactUpdateEvent,
  SourceRef,
  ToolCallEvent,
  PendingReview,
} from "@/lib/a2a-client";

// Re-export A2A utilities used by hooks and components.
export {
  fetchAgentCard,
  buildTextTurnParams,
  streamTask,
  parseA2AEvent,
  A2AParseError,
} from "@/lib/a2a-client";

import { streamTask, fetchAgentCard } from "@/lib/a2a-client";
import type {
  A2AClientOptions,
  A2ATaskParams,
  A2AEvent,
} from "@/lib/a2a-client";
import { ensureToken } from "./credentials";
import type { CRConfig } from "./config";

// ── CRClient ──────────────────────────────────────────────────────────────────

export interface CRClient {
  /**
   * Stream a user turn via A2A tasks/sendSubscribe.
   *
   * Automatically resolves and attaches the stored bearer token.
   * Returns an AsyncGenerator yielding parsed A2AEvent objects.
   */
  streamTurn(
    params: A2ATaskParams,
    signal?: AbortSignal,
  ): AsyncGenerator<A2AEvent>;

  /**
   * Fetch the agent card from /.well-known/agent.json.
   * No auth required per A2A spec.
   */
  agentCard(): Promise<unknown>;

  /**
   * Ensure a bearer token is available, provisioning a guest JWT if needed.
   * Returns null when backend is disabled.
   */
  ensureToken(): Promise<string | null>;

  /** The resolved A2A agent URL for this client. */
  readonly agentUrl: string;
}

/**
 * Build a CRClient for the given config.
 *
 * The returned client automatically attaches the stored bearer token to
 * every A2A request.  Call client.ensureToken() once on first chat open
 * to provision a guest JWT when the user is unauthenticated.
 *
 * @example
 * ```ts
 * const config = resolveCRConfig();
 * const client = createCRClient(config);
 * await client.ensureToken();
 * for await (const event of client.streamTurn(params)) { ... }
 * ```
 */
export function createCRClient(config: CRConfig): CRClient {
  const { agentUrl, backendEnabled, backendUrl } = config;

  return {
    agentUrl,

    async ensureToken() {
      return ensureToken(backendEnabled, backendUrl);
    },

    async *streamTurn(params: A2ATaskParams, signal?: AbortSignal) {
      const token = await ensureToken(backendEnabled, backendUrl);
      const opts: A2AClientOptions = {
        baseUrl: agentUrl,
        bearerToken: token ?? undefined,
      };
      yield* streamTask(opts, params, signal);
    },

    async agentCard() {
      return fetchAgentCard(agentUrl);
    },
  };
}
