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
 *   - Server: `const t = await getTranslations(ns?)` (i18n/server.ts).
 *   - Client: `const t = useTranslations(ns?)`        (i18n/client.tsx).
 *
 * next-intl compatibility: the richer, namespace-aware translator with
 * `.rich` / `.raw` / `.has` lives in i18n/intl.tsx and builds on the resolvers
 * and `formatMessage` exported here. This core stays React-free.
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

/** Values for `{name}` interpolation and ICU `plural` selection. */
export type TranslationValues = Record<string, string | number>;

/** A locale-bound translation function: `t("key")` -> string. */
export type Translator = (key: Path | (string & {}), params?: TranslationValues) => string;

export type ArrayTranslator = (key: Path | (string & {})) => readonly string[];

/** Simple `{name}` placeholder interpolation. */
function interpolate(text: string, params?: TranslationValues): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}

const PLURAL_MARKER = ", plural";

/** Index of the `}` that matches the `{` at `open` (balanced). */
function matchBrace(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) return i;
  }
  return -1;
}

/** Parse `one {..} other {..} =0 {..}` into a selector -> body map. */
function parsePluralOptions(options: string): Map<string, string> {
  const map = new Map<string, string>();
  let i = 0;
  while (i < options.length) {
    while (i < options.length && /\s/.test(options[i])) i++;
    let selector = "";
    while (i < options.length && !/\s/.test(options[i]) && options[i] !== "{") {
      selector += options[i++];
    }
    while (i < options.length && /\s/.test(options[i])) i++;
    if (options[i] !== "{") break;
    const close = matchBrace(options, i);
    if (close === -1) break;
    map.set(selector, options.slice(i + 1, close));
    i = close + 1;
  }
  return map;
}

/**
 * Apply ICU `plural` blocks: exact `=N` matches and CLDR categories via
 * `Intl.PluralRules`, with `#` replaced by the locale-formatted number. Covers
 * the subset actually in use (plural only; no select / number-skeleton /
 * nesting). Non-plural `{...}` braces are left untouched for `{name}`
 * interpolation.
 */
function applyPlurals(
  locale: string,
  text: string,
  params: TranslationValues,
): string {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text[i] !== "{") {
      out += text[i++];
      continue;
    }
    const close = matchBrace(text, i);
    if (close === -1) {
      out += text.slice(i);
      break;
    }
    const inner = text.slice(i + 1, close);
    const m = /^\s*([A-Za-z0-9_]+)\s*,\s*plural\s*,\s*([\s\S]*)$/.exec(inner);
    if (!m) {
      out += text.slice(i, close + 1);
      i = close + 1;
      continue;
    }
    const value = Number(params[m[1]] ?? 0);
    const options = parsePluralOptions(m[2]);
    const category = new Intl.PluralRules(locale).select(value);
    const body =
      options.get(`=${value}`) ?? options.get(category) ?? options.get("other") ?? "";
    const num = new Intl.NumberFormat(locale).format(value);
    out += applyPlurals(locale, body.replace(/#/g, num), params);
    i = close + 1;
  }
  return out;
}

/**
 * Format a resolved message: ICU `plural` (only when the string contains one)
 * then `{name}` interpolation. For non-plural strings this is byte-identical to
 * plain interpolation, so existing messages are unaffected.
 */
export function formatMessage(
  locale: string,
  text: string,
  params?: TranslationValues,
): string {
  if (!params) return text;
  const expanded = text.includes(PLURAL_MARKER)
    ? applyPlurals(locale, text, params)
    : text;
  return interpolate(expanded, params);
}

/** Resolve a string leaf from a nested tree by dot-path. */
export function resolveString(tree: Messages, key: string): string | undefined {
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

/** Resolve any node (string or array or object) from a nested tree by dot-path. */
export function resolveNode(tree: Messages, key: string): unknown {
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
  return (key: string, params?: TranslationValues): string => {
    const text = resolveString(messages, key) ?? resolveString(fallback, key);
    if (text === undefined) {
      throw new Error(`[i18n] Missing key: "${key}" (locale: ${locale})`);
    }
    return formatMessage(locale, text, params);
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
  params?: TranslationValues,
): string {
  const resolved = resolveString(messages, raw) ?? resolveString(fallback, raw) ?? raw;
  return interpolate(resolved, params);
}
