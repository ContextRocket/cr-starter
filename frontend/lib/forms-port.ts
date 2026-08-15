/**
 * forms-port.ts — port/adapter boundary for form submission.
 *
 * Wraps the fetch-based form submission behind a testable interface.
 * Production code uses `createFormSubmissionPort(fetch)`; tests use
 * `createInMemoryFormSubmissionPort(handler)` for deterministic control.
 */

export type SubmitResult =
  | { success: true }
  | { success: false; error: string };

export interface FormSubmissionPort {
  submitForm(
    key: string,
    payload: Record<string, unknown>,
  ): Promise<SubmitResult>;
}

/**
 * Production adapter: delegates to a real `fetch` implementation.
 *
 * The caller supplies `fetch` (global or custom) so the port stays
 * framework-agnostic and testable without network stubs.
 */
export function createFormSubmissionPort(
  fetchImpl: typeof fetch,
): FormSubmissionPort {
  return {
    async submitForm(key, payload) {
      // Read config lazily so tests can vi.resetModules() between cases.
      const { forms } = await import("@/forms.config");
      const cfg = forms[key as keyof typeof forms];

      if (!cfg?.endpoint) {
        // No endpoint configured — treat as success (UI-only form).
        return { success: true };
      }

      try {
        const res = await fetchImpl(cfg.endpoint, {
          method: cfg.method ?? "POST",
          headers: {
            "content-type": "application/json",
            ...(cfg.headers ?? {}),
          },
          body: JSON.stringify({ ...payload, ...(cfg.meta ?? {}) }),
        });

        if (!res.ok) {
          return {
            success: false,
            error: `Form "${key}" submit failed with status ${res.status}`,
          };
        }

        return { success: true };
      } catch (err) {
        return {
          success: false,
          error:
            err instanceof Error
              ? err.message
              : `Form "${key}" submit failed with unknown error`,
        };
      }
    },
  };
}

/**
 * Test double: records every call and delegates to an optional custom handler.
 *
 * Without a handler, every submission succeeds. With a handler, the test
 * controls the outcome per call.
 */
export function createInMemoryFormSubmissionPort(
  handler?: {
    submitForm?: (
      key: string,
      payload: Record<string, unknown>,
    ) => Promise<SubmitResult>;
  },
): FormSubmissionPort & { calls: Array<{ key: string; payload: Record<string, unknown> }> } {
  const calls: Array<{ key: string; payload: Record<string, unknown> }> = [];

  return {
    calls,
    async submitForm(key, payload) {
      calls.push({ key, payload });

      if (handler?.submitForm) {
        return handler.submitForm(key, payload);
      }

      return { success: true };
    },
  };
}
