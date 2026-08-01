/**
 * Tests for the A2A client — focuses on the SSE parser and request builder.
 *
 * Fixtures are constructed from the shapes defined in:
 *   backend/app/modules/agent/a2a/tasks.py
 *   backend/app/modules/agent/a2a/types.py
 */

import {
  parseA2AEvent,
  buildTextTurnParams,
  A2AParseError,
  type TaskStatusUpdateEvent,
  type TaskArtifactUpdateEvent,
} from "@/lib/a2a-client";

// ── Fixtures derived from CR backend shapes ───────────────────────────────────

const TASK_ID = "task-abc-123";

/** Wraps an event in the JSON-RPC 2.0 success envelope the server emits. */
function envelope(event: Record<string, unknown>): string {
  return `data: ${JSON.stringify({ jsonrpc: "2.0", id: "rpc-1", result: event })}`;
}

const SUBMITTED_EVENT = envelope({
  type: "TaskStatusUpdateEvent",
  id: TASK_ID,
  status: { state: "submitted", timestamp: "2026-08-01T00:00:00Z" },
  final: false,
});

const WORKING_EVENT = envelope({
  type: "TaskStatusUpdateEvent",
  id: TASK_ID,
  status: { state: "working", timestamp: "2026-08-01T00:00:01Z" },
  final: false,
});

const ARTIFACT_FIRST_CHUNK = envelope({
  type: "TaskArtifactUpdateEvent",
  id: TASK_ID,
  artifact: {
    name: "response",
    parts: [{ type: "text", text: "Hello, " }],
    index: 0,
    append: false,
    lastChunk: false,
  },
  final: false,
});

const ARTIFACT_SECOND_CHUNK = envelope({
  type: "TaskArtifactUpdateEvent",
  id: TASK_ID,
  artifact: {
    name: "response",
    parts: [{ type: "text", text: "world!" }],
    index: 0,
    append: true,
    lastChunk: false,
  },
  final: false,
});

const ARTIFACT_LAST_CHUNK = envelope({
  type: "TaskArtifactUpdateEvent",
  id: TASK_ID,
  artifact: {
    name: "response",
    parts: [{ type: "text", text: "" }],
    index: 0,
    append: true,
    lastChunk: true,
  },
  final: false,
  metadata: {
    customerSafe: true,
    thread_id: "thread-xyz",
    source_refs: [
      {
        sourceRefId: "ref-1",
        kind: "context_pack_chunk",
        title: "ContextRocket Docs",
        url: "https://example.com/docs",
        score: 0.92,
      },
    ],
  },
});

const COMPLETED_EVENT = envelope({
  type: "TaskStatusUpdateEvent",
  id: TASK_ID,
  status: {
    state: "completed",
    timestamp: "2026-08-01T00:00:05Z",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "Hello, world!" }],
    },
  },
  final: true,
  metadata: {
    customerSafe: true,
    thread_id: "thread-xyz",
  },
});

const FAILED_EVENT = envelope({
  type: "TaskStatusUpdateEvent",
  id: TASK_ID,
  status: { state: "failed", timestamp: "2026-08-01T00:00:02Z" },
  final: true,
  metadata: {
    customerSafe: true,
    reason: "byok_key_failure",
    error_key: "byok_key_failure",
  },
});

const TOOL_WORKING_EVENT = envelope({
  type: "TaskStatusUpdateEvent",
  id: TASK_ID,
  status: { state: "working", timestamp: "2026-08-01T00:00:01Z" },
  final: false,
  metadata: {
    customerSafe: true,
    tool_calls: [{ name: "search_context_pack", status: "running" }],
  },
});

// ── Parser tests ──────────────────────────────────────────────────────────────

describe("parseA2AEvent", () => {
  describe("TaskStatusUpdateEvent — submitted", () => {
    it("parses the submitted state", () => {
      const event = parseA2AEvent(SUBMITTED_EVENT) as TaskStatusUpdateEvent;
      expect(event).not.toBeNull();
      expect(event.type).toBe("TaskStatusUpdateEvent");
      expect(event.status.state).toBe("submitted");
      expect(event.final).toBe(false);
      expect(event.id).toBe(TASK_ID);
    });
  });

  describe("TaskStatusUpdateEvent — working", () => {
    it("parses the working state", () => {
      const event = parseA2AEvent(WORKING_EVENT) as TaskStatusUpdateEvent;
      expect(event.status.state).toBe("working");
      expect(event.final).toBe(false);
    });

    it("parses the working state with tool_calls in metadata", () => {
      const event = parseA2AEvent(TOOL_WORKING_EVENT) as TaskStatusUpdateEvent;
      expect(event.status.state).toBe("working");
      expect(event.metadata?.tool_calls).toHaveLength(1);
      expect(event.metadata?.tool_calls?.[0]).toMatchObject({
        name: "search_context_pack",
        status: "running",
      });
    });
  });

  describe("TaskArtifactUpdateEvent — token delta", () => {
    it("parses the first artifact chunk (append=false)", () => {
      const event = parseA2AEvent(
        ARTIFACT_FIRST_CHUNK,
      ) as TaskArtifactUpdateEvent;
      expect(event).not.toBeNull();
      expect(event.type).toBe("TaskArtifactUpdateEvent");
      expect(event.artifact.append).toBe(false);
      expect(event.artifact.lastChunk).toBe(false);
      expect(event.artifact.parts[0]).toMatchObject({
        type: "text",
        text: "Hello, ",
      });
    });

    it("parses subsequent artifact chunks (append=true)", () => {
      const event = parseA2AEvent(
        ARTIFACT_SECOND_CHUNK,
      ) as TaskArtifactUpdateEvent;
      expect(event.artifact.append).toBe(true);
      expect(event.artifact.parts[0]).toMatchObject({
        type: "text",
        text: "world!",
      });
    });

    it("parses the last artifact chunk with citation metadata", () => {
      const event = parseA2AEvent(
        ARTIFACT_LAST_CHUNK,
      ) as TaskArtifactUpdateEvent;
      expect(event.artifact.lastChunk).toBe(true);
      expect(event.metadata?.thread_id).toBe("thread-xyz");
      expect(event.metadata?.source_refs).toHaveLength(1);
      expect(event.metadata?.source_refs?.[0]).toMatchObject({
        sourceRefId: "ref-1",
        title: "ContextRocket Docs",
      });
    });
  });

  describe("TaskStatusUpdateEvent — completed", () => {
    it("parses the completed terminal state", () => {
      const event = parseA2AEvent(COMPLETED_EVENT) as TaskStatusUpdateEvent;
      expect(event.status.state).toBe("completed");
      expect(event.final).toBe(true);
      expect(event.metadata?.thread_id).toBe("thread-xyz");
    });
  });

  describe("TaskStatusUpdateEvent — failed", () => {
    it("parses the failed terminal state with error_key", () => {
      const event = parseA2AEvent(FAILED_EVENT) as TaskStatusUpdateEvent;
      expect(event.status.state).toBe("failed");
      expect(event.final).toBe(true);
      expect(event.metadata?.error_key).toBe("byok_key_failure");
      expect(event.metadata?.reason).toBe("byok_key_failure");
    });
  });

  describe("JSON-RPC error envelope", () => {
    it("maps a JSON-RPC error to a failed TaskStatusUpdateEvent", () => {
      const line = `data: ${JSON.stringify({
        jsonrpc: "2.0",
        id: "rpc-1",
        error: { code: -32603, message: "authentication required" },
      })}`;
      const event = parseA2AEvent(line) as TaskStatusUpdateEvent;
      expect(event.type).toBe("TaskStatusUpdateEvent");
      expect(event.status.state).toBe("failed");
      expect(event.final).toBe(true);
      expect(event.metadata?.reason).toBe("authentication required");
    });
  });

  describe("edge cases", () => {
    it("returns null for non-data lines (comments)", () => {
      expect(parseA2AEvent(": heartbeat")).toBeNull();
    });

    it("returns null for empty data lines", () => {
      expect(parseA2AEvent("data:")).toBeNull();
      expect(parseA2AEvent("data: ")).toBeNull();
    });

    it("returns null for [DONE] sentinel", () => {
      expect(parseA2AEvent("data: [DONE]")).toBeNull();
    });

    it("returns null for a non-data prefix line", () => {
      expect(parseA2AEvent("event: update")).toBeNull();
    });

    it("throws A2AParseError on malformed JSON", () => {
      expect(() => parseA2AEvent("data: {not json}")).toThrow(A2AParseError);
    });

    it("returns null for unknown event type (does not throw)", () => {
      const line = `data: ${JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        result: { type: "UnknownEvent", id: "x", final: false },
      })}`;
      expect(parseA2AEvent(line)).toBeNull();
    });
  });
});

// ── buildTextTurnParams tests ──────────────────────────────────────────────────

describe("buildTextTurnParams", () => {
  it("creates a text message with user role", () => {
    const params = buildTextTurnParams("Hello");
    expect(params.message.role).toBe("user");
    expect(params.message.parts).toHaveLength(1);
    expect(params.message.parts[0]).toMatchObject({
      type: "text",
      text: "Hello",
    });
  });

  it("attaches thread_id to message.contextId and metadata", () => {
    const params = buildTextTurnParams("Hi", { threadId: "thread-abc" });
    expect(params.message.contextId).toBe("thread-abc");
    expect(params.metadata?.thread_id).toBe("thread-abc");
  });

  it("includes org_id in metadata when provided", () => {
    const params = buildTextTurnParams("Hi", { orgId: "org-xyz" });
    expect(params.metadata?.org_id).toBe("org-xyz");
  });

  it("includes guest_session_id in metadata when provided", () => {
    const params = buildTextTurnParams("Hi", {
      guestSessionId: "guest-session-1",
    });
    expect(params.metadata?.guest_session_id).toBe("guest-session-1");
  });

  it("omits metadata when no options are provided", () => {
    const params = buildTextTurnParams("Hi");
    expect(params.metadata).toBeUndefined();
  });

  it("includes scope in metadata when provided", () => {
    const scope = { source_ids: ["src-1"] };
    const params = buildTextTurnParams("Hi", { scope });
    expect(params.metadata?.scope).toEqual(scope);
  });
});
