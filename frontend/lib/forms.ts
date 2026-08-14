/**
 * lib/forms.ts — submit a named form to its configured endpoint.
 *
 * Reads `forms.config.ts` so the destination lives in config, not component
 * code. With no endpoint configured for the form, this is a no-op that reports
 * `{ configured: false }` — the caller then shows a local (UI-only) success
 * state. With an endpoint, it POSTs `{ ...payload, ...meta }` and throws on a
 * non-2xx response so the caller can surface an error.
 */

import { forms, type FormKey } from "@/forms.config";

export interface SubmitResult {
  /** true when a real endpoint was configured and the POST succeeded. */
  configured: boolean;
}

export async function submitForm(
  key: FormKey,
  payload: Record<string, unknown>,
): Promise<SubmitResult> {
  const cfg = forms[key];
  if (!cfg?.endpoint) {
    // UI-only: no backend wired for this form.
    return { configured: false };
  }

  const res = await fetch(cfg.endpoint, {
    method: cfg.method ?? "POST",
    headers: { "content-type": "application/json", ...(cfg.headers ?? {}) },
    body: JSON.stringify({ ...payload, ...(cfg.meta ?? {}) }),
  });

  if (!res.ok) {
    throw new Error(`Form "${key}" submit failed with status ${res.status}`);
  }
  return { configured: true };
}
