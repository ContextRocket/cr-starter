/**
 * Public ContextRocket integration seam.
 *
 * This module is browser-safe and deliberately independent of the private
 * private auth starter. It supports canned demo data for static sites and direct A2A
 * streaming for live sites; a Next.js API proxy is not required.
 */

export { resolveCRConfig } from "./config";
export type { CRConfig, CRChatMode } from "./config";

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

export {
  fetchAgentCard,
  buildTextTurnParams,
  streamTask,
  parseA2AEvent,
  A2AParseError,
} from "@/lib/a2a-client";

import { fetchAgentCard, streamTask } from "@/lib/a2a-client";
import { mockStreamTask } from "./adapters/a2a-mock";
import type { A2AEvent, A2ATaskParams } from "@/lib/a2a-client";
import type { CRConfig } from "./config";

export interface CRClient {
  streamTurn(
    params: A2ATaskParams,
    signal?: AbortSignal,
  ): AsyncGenerator<A2AEvent>;
  agentCard(): Promise<unknown>;
  readonly agentUrl: string;
}

export function createCRClient(config: CRConfig): CRClient {
  return {
    agentUrl: config.agentUrl,

    async *streamTurn(params, signal) {
      if (config.mode === "demo" || !config.agentUrl) {
        yield* mockStreamTask(params, signal);
        return;
      }
      yield* streamTask(
        {
          baseUrl: config.agentUrl,
          apiKey: config.apiKey,
          handle: config.handle,
          mode: "live",
        },
        params,
        signal,
      );
    },

    async agentCard() {
      if (!config.agentUrl) return null;
      return fetchAgentCard(config.agentUrl, config.handle);
    },
  };
}
