/**
 * Tests for lib/forms-port.ts
 *
 * Covers:
 *   - Happy path (successful submission)
 *   - Non-OK response
 *   - Network error
 *   - Malformed response (fetch throws non-Error)
 *   - Unconfigured form (no endpoint → no-op success)
 *   - In-memory fake records calls deterministically
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createFormSubmissionPort,
  createInMemoryFormSubmissionPort,
  type SubmitResult,
} from "@/lib/forms-port";

// ── helpers ───────────────────────────────────────────────────────────────────

/** Build a minimal Response-like object for stubbing fetch. */
function okResponse(body = "{}"): Response {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(JSON.parse(body)),
    text: () => Promise.resolve(body),
  } as unknown as Response;
}

function failResponse(status: number, body = "{}"): Response {
  return {
    ok: false,
    status,
    json: () => Promise.resolve(JSON.parse(body)),
    text: () => Promise.resolve(body),
  } as unknown as Response;
}

// ── forms.config mock ─────────────────────────────────────────────────────────

// Default: a configured form endpoint.
const configuredForms = {
  subscribe: {
    endpoint: "https://api.example.com/subscribe",
    method: "POST" as const,
    headers: { "x-site-key": "pub_123" },
    meta: { source: "subscribe" },
  },
};

const unconfiguredForms = {
  subscribe: { endpoint: "", meta: { source: "subscribe" } },
};

vi.mock("@/config/site.config", () => ({
  forms: configuredForms,
}));

// ── createFormSubmissionPort ──────────────────────────────────────────────────

describe("createFormSubmissionPort", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns success on 2xx response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse());
    const port = createFormSubmissionPort(fetchImpl);

    const result = await port.submitForm("subscribe", { email: "a@b.com" });

    expect(result).toEqual({ success: true });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.example.com/subscribe",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "content-type": "application/json",
          "x-site-key": "pub_123",
        }),
      }),
    );
  });

  it("merges payload with config meta in request body", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse());
    const port = createFormSubmissionPort(fetchImpl);

    await port.submitForm("subscribe", { email: "a@b.com" });

    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body).toEqual({
      email: "a@b.com",
      source: "subscribe",
    });
  });

  it("returns error on non-OK response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(failResponse(500));
    const port = createFormSubmissionPort(fetchImpl);

    const result = await port.submitForm("subscribe", { email: "a@b.com" });

    expect(result).toEqual({
      success: false,
      error: 'Form "subscribe" submit failed with status 500',
    });
  });

  it("returns error on network failure (fetch rejects)", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("Network down"));
    const port = createFormSubmissionPort(fetchImpl);

    const result = await port.submitForm("subscribe", { email: "a@b.com" });

    expect(result).toEqual({
      success: false,
      error: "Network down",
    });
  });

  it("returns error with generic message when fetch throws non-Error", async () => {
    const fetchImpl = vi.fn().mockRejectedValue("string throw");
    const port = createFormSubmissionPort(fetchImpl);

    const result = await port.submitForm("subscribe", { email: "a@b.com" });

    expect(result).toEqual({
      success: false,
      error: 'Form "subscribe" submit failed with unknown error',
    });
  });

  it("returns success without calling fetch when form has no endpoint", async () => {
    // Override the mock for this test by re-importing.
    vi.doUnmock("@/config/site.config");
    vi.doMock("@/config/site.config", () => ({ forms: unconfiguredForms }));
    const { createFormSubmissionPort: freshPort } = await import(
      "@/lib/forms-port"
    );

    const fetchImpl = vi.fn();
    const port = freshPort(fetchImpl);

    const result = await port.submitForm("subscribe", { email: "a@b.com" });

    expect(result).toEqual({ success: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns success without calling fetch when form key is absent from config", async () => {
    vi.doUnmock("@/config/site.config");
    vi.doMock("@/config/site.config", () => ({ forms: {} }));
    const { createFormSubmissionPort: freshPort } = await import(
      "@/lib/forms-port"
    );

    const fetchImpl = vi.fn();
    const port = freshPort(fetchImpl);

    const result = await port.submitForm("unknown", { x: 1 });

    expect(result).toEqual({ success: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

// ── createInMemoryFormSubmissionPort ──────────────────────────────────────────

describe("createInMemoryFormSubmissionPort", () => {
  it("records calls and returns success by default", async () => {
    const port = createInMemoryFormSubmissionPort();

    const result = await port.submitForm("subscribe", { email: "a@b.com" });

    expect(result).toEqual({ success: true });
    expect(port.calls).toEqual([
      { key: "subscribe", payload: { email: "a@b.com" } },
    ]);
  });

  it("records multiple calls in order", async () => {
    const port = createInMemoryFormSubmissionPort();

    await port.submitForm("subscribe", { email: "a@b.com" });
    await port.submitForm("waitlist", { name: "Alice" });

    expect(port.calls).toEqual([
      { key: "subscribe", payload: { email: "a@b.com" } },
      { key: "waitlist", payload: { name: "Alice" } },
    ]);
  });

  it("delegates to custom handler when provided", async () => {
    const handlerResult: SubmitResult = { success: false, error: "full" };
    const port = createInMemoryFormSubmissionPort({
      submitForm: vi.fn().mockResolvedValue(handlerResult),
    });

    const result = await port.submitForm("subscribe", { email: "a@b.com" });

    expect(result).toEqual(handlerResult);
    expect(port.calls).toHaveLength(1); // still recorded
  });

  it("custom handler receives correct arguments", async () => {
    const handler = { submitForm: vi.fn().mockResolvedValue({ success: true }) };
    const port = createInMemoryFormSubmissionPort(handler);

    await port.submitForm("waitlist", { name: "Bob", ref: "twitter" });

    expect(handler.submitForm).toHaveBeenCalledWith("waitlist", {
      name: "Bob",
      ref: "twitter",
    });
  });
});
