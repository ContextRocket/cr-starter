import { parseSSE } from "./sse-parser";
import type {
  WidgetConfig,
  WidgetSendRequest,
  WidgetTransportEvent,
  WidgetTransportState,
} from "./types";

export type EmbedWidgetA2aFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface EmbedWidgetA2aPort {
  request(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export function createEmbedWidgetA2aPort(
  fetchImpl: EmbedWidgetA2aFetch = fetch,
): EmbedWidgetA2aPort {
  return { request: fetchImpl };
}

export function createInMemoryEmbedWidgetA2aPort(
  handler: EmbedWidgetA2aFetch,
): EmbedWidgetA2aPort {
  return { request: handler };
}

export const embedWidgetA2aPort = createEmbedWidgetA2aPort();

const TRANSPORT_STATES = new Set<string>([
  "submitted",
  "working",
  "input-required",
  "completed",
  "canceled",
  "failed",
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const GENERIC_ERROR = "Something went wrong. Please try again.";
const DEMO_RESPONSE =
  "This is a canned ContextRocket demo response. Configure live mode with an organization handle when you are ready to connect your own knowledge base.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTransportState(value: unknown): value is WidgetTransportState {
  return typeof value === "string" && TRANSPORT_STATES.has(value);
}

function extractTextParts(container: unknown): string[] {
  if (!isRecord(container) || !Array.isArray(container.parts)) {
    return [];
  }

  return container.parts.flatMap((part) => {
    if (
      !isRecord(part) ||
      part.type !== "text" ||
      typeof part.text !== "string" ||
      !part.text
    ) {
      return [];
    }
    return [part.text];
  });
}

function mapEnvelopeToEvents(envelope: unknown): WidgetTransportEvent[] {
  if (!isRecord(envelope)) {
    return [{ type: "error", message: GENERIC_ERROR }];
  }

  if (envelope.error !== undefined && envelope.error !== null) {
    return [{ type: "error", message: GENERIC_ERROR }];
  }

  const result = envelope.result;
  if (!isRecord(result)) {
    return [];
  }

  const eventType = result.type;

  if (eventType === "TaskArtifactUpdateEvent") {
    return extractTextParts(result.artifact).map((text) => ({
      type: "delta",
      text,
    }));
  }

  if (eventType !== "TaskStatusUpdateEvent") {
    return [];
  }

  const taskId = typeof result.id === "string" ? result.id : undefined;
  const status = isRecord(result.status) ? result.status : undefined;
  const state = status?.state;

  if (!isTransportState(state)) {
    return [];
  }

  if (state === "failed" || state === "canceled") {
    return [{ type: "error", message: GENERIC_ERROR }];
  }

  const sessionEvents = extractSessionEvents(status, result);

  if (state === "completed" || result.final === true) {
    return [{ type: "done", taskId }, ...sessionEvents];
  }

  return [{ type: "meta", state }, ...sessionEvents];
}

function extractSessionEvents(
  ...containers: unknown[]
): WidgetTransportEvent[] {
  for (const container of containers) {
    if (!isRecord(container)) {
      continue;
    }
    const metadata = isRecord(container.metadata)
      ? container.metadata
      : container;
    const raw =
      (typeof metadata.thread_id === "string" && metadata.thread_id) ||
      (typeof metadata.threadId === "string" && metadata.threadId) ||
      undefined;
    if (raw && UUID_PATTERN.test(raw)) {
      return [{ type: "session", threadId: raw }];
    }
  }
  return [];
}

function mapSseDataToEvents(data: string): WidgetTransportEvent[] {
  try {
    return mapEnvelopeToEvents(JSON.parse(data));
  } catch {
    return [{ type: "error", message: GENERIC_ERROR }];
  }
}

async function* streamTransportEvents(
  body: ReadableStream<Uint8Array> | null,
  signal?: AbortSignal,
): AsyncGenerator<WidgetTransportEvent> {
  if (!body) {
    return;
  }

  for await (const event of parseSSE(body.getReader(), signal)) {
    for (const mapped of mapSseDataToEvents(event.data)) {
      yield mapped;
    }
  }
}

async function* streamDemoEvents(
  request: WidgetSendRequest,
  signal?: AbortSignal,
): AsyncGenerator<WidgetTransportEvent> {
  const threadId = request.threadId ?? "demo-thread";
  yield { type: "meta", state: "working" };
  for (const token of DEMO_RESPONSE.split(/(\s+)/)) {
    if (signal?.aborted) {
      return;
    }
    if (token) yield { type: "delta", text: token };
    await new Promise((resolve) => setTimeout(resolve, token.trim() ? 18 : 4));
  }
  if (signal?.aborted) {
    return;
  }
  yield { type: "session", threadId };
  yield { type: "done", taskId: "demo-task" };
}

/**
 * Stream A2A `tasks/sendSubscribe` events from the embed API base.
 * Uses the public JSON-RPC envelope and calls `/api/agent/a2a` directly with
 * the website API key.
 */
export async function* streamEmbedA2aSubscribe(
  config: WidgetConfig,
  request: WidgetSendRequest,
  port: EmbedWidgetA2aPort = embedWidgetA2aPort,
  signal?: AbortSignal,
): AsyncGenerator<WidgetTransportEvent> {
  if (signal?.aborted) {
    return;
  }

  if (config.mode === "demo") {
    yield* streamDemoEvents(request, signal);
    return;
  }
  const messageObj: Record<string, unknown> = {
    role: "user",
    parts: [{ type: "text", text: request.message }],
  };

  if (request.threadId && UUID_PATTERN.test(request.threadId)) {
    messageObj.contextId = request.threadId;
  }

  const metadata: Record<string, unknown> = {};
  if (config.handle) {
    metadata.handle = config.handle;
  }

  const body = {
    jsonrpc: "2.0",
    id: `embed-chat-${crypto.randomUUID()}`,
    method: "tasks/sendSubscribe",
    params: {
      message: messageObj,
      metadata,
    },
  };

  const endpoint = `${config.apiBaseUrl!.replace(/\/$/, "")}/api/agent/a2a`;

  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "text/event-stream",
  };
  if (config.apiKey) {
    headers["x-api-key"] = config.apiKey;
  }

  let response: Response;
  try {
    response = await port.request(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal,
    });
  } catch {
    if (signal?.aborted) {
      return;
    }
    yield { type: "error", message: GENERIC_ERROR };
    return;
  }

  if (!response.ok) {
    yield { type: "error", message: GENERIC_ERROR };
    return;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/event-stream")) {
    yield { type: "error", message: GENERIC_ERROR };
    return;
  }

  yield* streamTransportEvents(response.body, signal);
}

export async function collectEmbedA2aSubscribe(
  config: WidgetConfig,
  request: WidgetSendRequest,
  port: EmbedWidgetA2aPort = embedWidgetA2aPort,
  signal?: AbortSignal,
): Promise<WidgetTransportEvent[]> {
  const events: WidgetTransportEvent[] = [];
  for await (const event of streamEmbedA2aSubscribe(
    config,
    request,
    port,
    signal,
  )) {
    events.push(event);
  }
  return events;
}
