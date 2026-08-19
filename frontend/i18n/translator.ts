/**
 * i18n/translator.ts -- pure translation core (no React, no global state).
 *
 * The active locale's message tree is always passed in EXPLICITLY, and the
 * English tree is statically bundled as the fallback. This mirrors the
 * context-rocket frontend pattern (server passes translations explicitly;
 * client reads them from a provider) while keeping next-intl's `t("key")`
 * ergonomics -- and crucially it means the shared client bundle contains NO
 * locale strings except English: every other locale is loaded per-request on
 * the server and serialized to the client as a prop.
 *
 *   - Server: `const t = await getTranslator(locale)` (i18n/server.ts).
 *   - Client: `const { t } = useTranslations()` (i18n/client.tsx).
 */

import { en } from "./messages/en";
import type { SupportedLocale } from "./messages/registry";

export type { SupportedLocale };
export type Messages = Record<string, unknown>;

type LeafPaths<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends string
    ? `${K}`
    : T[K] extends readonly unknown[]
      ? `${K}`
      : T[K] extends object
        ? `${K}.${LeafPaths<T[K]>}`
        : never
  : never;

export type Path = LeafPaths<typeof en>;

/** A locale-bound translation function: `t("key")` -> string. */
export type Translator = (key: Path | (string & {}), params?: Record<string, string>) => string;

export type ArrayTranslator = (key: Path | (string & {})) => readonly string[];

function interpolate(text: string, params?: Record<string, string>): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`);
}

function resolveString(tree: Messages, key: string): string | undefined {
  const direct = (tree as Record<string, unknown>)[key];
  if (typeof direct === "string") return direct;

  // Nested path: dot-walk (handles "locale.labelEnglish" etc.).
  const segments = key.split(".");
  if (segments.length > 1) {
    let node: unknown = tree;
    for (const seg of segments) {
      if (node === null || typeof node !== "object") {
        node = undefined;
        break;
      }
      node = (node as Record<string, unknown>)[seg];
    }
    if (typeof node === "string") return node;
  }

  return undefined;
}

/** Resolve any node (string or array) from a nested tree by dot-path. */
function resolveNode(tree: Messages, key: string): unknown {
  const direct = (tree as Record<string, unknown>)[key];
  if (direct !== undefined) return direct;

  const segments = key.split(".");
  if (segments.length > 1) {
    let node: unknown = tree;
    for (const seg of segments) {
      if (node === null || typeof node !== "object") {
        return undefined;
      }
      node = (node as Record<string, unknown>)[seg];
    }
    return node;
  }

  return undefined;
}

/**
 * Create a translator bound to `messages`, falling back to English. Throws on
 * a missing key (fail-fast, never silent).
 */
export function createTranslator(
  locale: SupportedLocale,
  messages: Messages,
  fallback: Messages = en,
): Translator {
  return (key: string, params?: Record<string, string>): string => {
    const text = resolveString(messages, key) ?? resolveString(fallback, key);
    if (text === undefined) {
      throw new Error(`[i18n] Missing key: "${key}" (locale: ${locale})`);
    }
    return interpolate(text, params);
  };
}

export function createArrayTranslator(
  locale: SupportedLocale,
  messages: Messages,
  fallback: Messages = en,
): ArrayTranslator {
  return (key: string): readonly string[] => {
    const node = resolveNode(messages, key) ?? resolveNode(fallback, key);
    return Array.isArray(node) ? node : [];
  };
}

/**
 * Translate a raw backend error key into a human-readable message, returning
 * the raw string unchanged when it is not a known key.
 */
export function translateError(
  messages: Messages,
  raw: string,
  fallback: Messages = en,
  params?: Record<string, string>,
): string {
  const resolved = resolveString(messages, raw) ?? resolveString(fallback, raw) ?? raw;
  return interpolate(resolved, params);
}
