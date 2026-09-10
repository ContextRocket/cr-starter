/**
 * Given / When / Then as structure, not a framework.
 * See docs/testing-doctrine.md.
 *
 * IMPORTANT: export assertion step as `thenStep`, NOT `then` — a bare `then`
 * export makes the module a thenable and Vitest silently collects zero tests.
 */
import { describe } from "vitest";

export function scenario(title: string, body: () => void): void {
  describe(`Scenario: ${title}`, body);
}

export function given<T>(_label: string, fn: () => T): T {
  return fn();
}

export async function when(
  _label: string,
  fn: () => void | Promise<void>,
): Promise<void> {
  await fn();
}

export async function thenStep(
  _label: string,
  fn: () => void | Promise<void>,
): Promise<void> {
  await fn();
}
