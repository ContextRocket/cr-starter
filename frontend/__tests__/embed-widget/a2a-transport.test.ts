import { describe, expect, it, vi } from "vitest";

import {
  collectEmbedA2aSubscribe,
  createInMemoryEmbedWidgetA2aPort,
  streamEmbedA2aSubscribe,
} from "../../../clients/embed-widget/src/a2a-transport";

const encode = (chunk: string) => new TextEncoder().encode(chunk);
const sseFrame = (payload: unknown) => `data: ${JSON.stringify(payload)}\n\n`;

function sseStream(...frames: unknown[]): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const frame of frames) {
        controller.enqueue(encode(sseFrame(frame)));
      }
      controller.close();
    },
  });
}

const artifactEvent = (text: string) => ({
  jsonrpc: "2.0",
  id: "req-1",
  result: {
    type: "TaskArtifactUpdateEvent",
    id: "task-1",
    artifact: { parts: [{ type: "text", text }] },
    final: false,
  },
});

const statusEvent = (state: string) => ({
  jsonrpc: "2.0",
  id: "req-1",
  result: {
    type: "TaskStatusUpdateEvent",
    id: "task-1",
    status: { state },
    final: state === "completed",
  },
});

describe("embed-widget a2a-transport", () => {
  it("posts JSON-RPC with an API key and normalized endpoint", async () => {
    const handler = vi.fn().mockResolvedValue(
      new Response(sseStream(statusEvent("completed")), {
        status: 200,
        headers: { "content-type": "text/event-stream" },
      }),
    );
    const port = createInMemoryEmbedWidgetA2aPort(handler);

    await collectEmbedA2aSubscribe(
      {
        apiKey: "crk_api_test",
        apiBaseUrl: "https://api.example.com/",
        mode: "live",
      },
      { message: "What is our pricing?" },
      port,
    );

    expect(handler).toHaveBeenCalledOnce();
    const [url, init] = handler.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.example.com/api/agent/a2a");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      "x-api-key": "crk_api_test",
      accept: "text/event-stream",
    });
    expect(
      (init.headers as Record<string, string>).authorization,
    ).toBeUndefined();

    const body = JSON.parse(init.body as string);
    expect(body.params.metadata).toEqual({});
  });

  it("posts handle metadata without an Authorization header", async () => {
    const handler = vi.fn().mockResolvedValue(
      new Response(sseStream(statusEvent("completed")), {
        status: 200,
        headers: { "content-type": "text/event-stream" },
      }),
    );
    const port = createInMemoryEmbedWidgetA2aPort(handler);

    await collectEmbedA2aSubscribe(
      {
        apiBaseUrl: "https://api.example.com",
        handle: "example-brand",
        mode: "live",
      },
      { message: "Who are you?" },
      port,
    );

    const [, init] = handler.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({ accept: "text/event-stream" });
    expect(
      (init.headers as Record<string, string>).authorization,
    ).toBeUndefined();
    expect(JSON.parse(init.body as string).params.metadata).toEqual({
      handle: "example-brand",
    });
  });

  it("maps artifact and completed status SSE events", async () => {
    const handler = vi.fn().mockResolvedValue(
      new Response(
        sseStream(artifactEvent("Hello from agent."), statusEvent("completed")),
        {
          status: 200,
          headers: { "content-type": "text/event-stream" },
        },
      ),
    );
    const events = await collectEmbedA2aSubscribe(
      {
        apiKey: "crk_api_test",
        apiBaseUrl: "https://api.example.com",
        mode: "live",
      },
      { message: "Hi" },
      createInMemoryEmbedWidgetA2aPort(handler),
    );

    expect(events).toEqual([
      { type: "delta", text: "Hello from agent." },
      { type: "meta", state: "working", terminal: false },
      { type: "meta", state: "completed", terminal: true },
      { type: "done", taskId: "task-1" },
    ]);
  });

  it("preserves bounded citations and suggestions from terminal metadata", async () => {
    const completed = statusEvent("completed");
    completed.result.metadata = {
      source_refs: [
        {
          sourceRefId: "source-1",
          title: "Docs",
          url: "https://example.com/docs",
          excerpt: "A useful excerpt",
        },
      ],
      suggestions: ["Tell me more", 42, "Show an example"],
    };
    const events = await collectEmbedA2aSubscribe(
      {
        apiBaseUrl: "https://api.example.com",
        mode: "live",
      },
      { message: "Hi" },
      createInMemoryEmbedWidgetA2aPort(
        vi.fn().mockResolvedValue(
          new Response(sseStream(completed), {
            status: 200,
            headers: { "content-type": "text/event-stream" },
          }),
        ),
      ),
    );

    expect(events).toContainEqual({
      type: "meta",
      state: "completed",
      terminal: true,
      sourceRefs: [
        {
          sourceRefId: "source-1",
          title: "Docs",
          url: "https://example.com/docs",
          excerpt: "A useful excerpt",
        },
      ],
      suggestions: ["Tell me more", "Show an example"],
    });
  });

  it("marks an abruptly closed stream as interrupted instead of completed", async () => {
    const events = await collectEmbedA2aSubscribe(
      {
        apiBaseUrl: "https://api.example.com",
        mode: "live",
      },
      { message: "Hi" },
      createInMemoryEmbedWidgetA2aPort(
        vi.fn().mockResolvedValue(
          new Response(sseStream(artifactEvent("Partial answer")), {
            status: 200,
            headers: { "content-type": "text/event-stream" },
          }),
        ),
      ),
    );

    expect(events.at(-1)).toEqual({
      type: "error",
      message:
        "The connection ended before the answer was complete. Please try again.",
    });
    expect(events.some((event) => event.type === "done")).toBe(false);
  });

  it("fails closed on an unknown event type", async () => {
    const events = await collectEmbedA2aSubscribe(
      {
        apiBaseUrl: "https://api.example.com",
        mode: "live",
      },
      { message: "Hi" },
      createInMemoryEmbedWidgetA2aPort(
        vi.fn().mockResolvedValue(
          new Response(sseStream({ result: { type: "UnknownEvent" } }), {
            status: 200,
            headers: { "content-type": "text/event-stream" },
          }),
        ),
      ),
    );

    expect(events).toEqual([
      {
        type: "unsupported",
        message:
          "This content is not available in this chat. Please try again.",
      },
    ]);
  });

  it("uses canned demo mode without making a request", async () => {
    const handler = vi.fn();
    const events = await collectEmbedA2aSubscribe(
      { mode: "demo" },
      { message: "Hi" },
      createInMemoryEmbedWidgetA2aPort(handler),
    );

    expect(handler).not.toHaveBeenCalled();
    expect(events[events.length - 1]).toEqual({
      type: "done",
      taskId: "demo-task",
    });
  });

  it("fails closed for non-OK, non-SSE, malformed, and transport errors", async () => {
    const cases = [
      new Response(JSON.stringify({ error: "auth" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
      new Response("database password=secret", { status: 500 }),
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(encode("data: not-json\n\n"));
            controller.close();
          },
        }),
        { status: 200, headers: { "content-type": "text/event-stream" } },
      ),
    ];

    for (const response of cases) {
      const events = await collectEmbedA2aSubscribe(
        {
          apiKey: "crk_api_test",
          apiBaseUrl: "https://api.example.com",
          mode: "live",
        },
        { message: "Hi" },
        createInMemoryEmbedWidgetA2aPort(vi.fn().mockResolvedValue(response)),
      );
      expect(events).toEqual([
        { type: "error", message: "Something went wrong. Please try again." },
      ]);
    }

    const transportFailure = await collectEmbedA2aSubscribe(
      {
        apiKey: "crk_api_test",
        apiBaseUrl: "https://api.example.com",
        mode: "live",
      },
      { message: "Hi" },
      createInMemoryEmbedWidgetA2aPort(
        vi.fn().mockRejectedValue(new Error("private socket detail")),
      ),
    );
    expect(transportFailure).toEqual([
      { type: "error", message: "Something went wrong. Please try again." },
    ]);
  });

  it("passes an abort signal to the port and cancels the SSE reader", async () => {
    let cancelCalled = false;
    const body = new ReadableStream<Uint8Array>({
      cancel() {
        cancelCalled = true;
      },
    });
    const handler = vi.fn().mockResolvedValue(
      new Response(body, {
        status: 200,
        headers: { "content-type": "text/event-stream" },
      }),
    );
    const controller = new AbortController();
    const iterator = streamEmbedA2aSubscribe(
      {
        apiKey: "crk_api_test",
        apiBaseUrl: "https://api.example.com",
        mode: "live",
      },
      { message: "Hi" },
      createInMemoryEmbedWidgetA2aPort(handler),
      controller.signal,
    );

    const pending = iterator.next();
    await new Promise((resolve) => setTimeout(resolve, 0));
    controller.abort();
    await pending;

    const [, init] = handler.mock.calls[0] as [string, RequestInit];
    expect(init.signal).toBe(controller.signal);
    expect(cancelCalled).toBe(true);
  });
});
