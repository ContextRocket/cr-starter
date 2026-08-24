/**
 * i18n/intl.tsx -- next-intl-compatible translator factory.
 *
 * Builds a translator whose signature matches next-intl's `useTranslations` /
 * `getTranslations` return value, so a component written against next-intl works
 * unchanged once its import is repointed here:
 *
 *   const t = getIntlTranslator(locale, messages, "namespace");
 *   t("key")                       -> string (namespace-relative keys, {name}, ICU plural)
 *   t.rich("key", { b: (c) => <b>{c}</b> }) -> ReactNode
 *   t.markup("key", { b: (c) => `<b>${c}</b>` }) -> string
 *   t.raw("key")                   -> the raw message node
 *   t.has("key")                   -> boolean
 *
 * This is the ONE place that knows about namespaces and rich text; the pure core
 * (translator.ts) stays React-free and does key resolution + `formatMessage`.
 */

import { createElement, Fragment, type ReactNode } from "react";
import { en } from "./messages/en";
import {
  formatMessage,
  resolveString,
  resolveNode,
  type Messages,
  type Path,
  type TranslationValues,
} from "./translator";

/** Rich values may also carry tag render functions, like next-intl's `t.rich`. */
export type RichTranslationValues = Record<
  string,
  string | number | ((chunks: ReactNode) => ReactNode)
>;

export type MarkupTranslationValues = Record<
  string,
  string | number | ((chunks: string) => string)
>;

/** next-intl-shaped translator: callable, plus `.rich` / `.markup` / `.raw` / `.has`. */
export interface IntlTranslator {
  (key: Path | (string & {}), values?: TranslationValues): string;
  rich(key: Path | (string & {}), values?: RichTranslationValues): ReactNode;
  markup(key: Path | (string & {}), values?: MarkupTranslationValues): string;
  raw(key: Path | (string & {})): unknown;
  has(key: Path | (string & {})): boolean;
}

/** Split a message into text / `{name}` / `<tag>...</tag>` parts (non-nested tags). */
function renderRich(
  locale: string,
  text: string,
  values: RichTranslationValues,
): ReactNode {
  const nodes: ReactNode[] = [];
  const tagRe = /<(\w+)>([\s\S]*?)<\/\1>/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  const plain = (segment: string) =>
    formatMessage(locale, segment, values as TranslationValues);

  while ((match = tagRe.exec(text)) !== null) {
    if (match.index > last) nodes.push(plain(text.slice(last, match.index)));
    const fn = values[match[1]];
    const inner = renderRich(locale, match[2], values);
    nodes.push(
      <Fragment key={key++}>
        {typeof fn === "function" ? fn(inner) : inner}
      </Fragment>,
    );
    last = tagRe.lastIndex;
  }
  if (last < text.length) nodes.push(plain(text.slice(last)));
  return nodes.length === 1
    ? nodes[0]
    : createElement(Fragment, null, ...nodes);
}

/** Like `renderRich` but string-in/string-out, for `t.markup`. */
function renderMarkup(
  locale: string,
  text: string,
  values: MarkupTranslationValues,
): string {
  const tagRe = /<(\w+)>([\s\S]*?)<\/\1>/g;
  const withTags = text.replace(tagRe, (_, tag: string, inner: string) => {
    const fn = values[tag];
    const rendered = renderMarkup(locale, inner, values);
    return typeof fn === "function" ? fn(rendered) : rendered;
  });
  return formatMessage(locale, withTags, values as TranslationValues);
}

/**
 * Create a next-intl-shaped translator bound to `messages` (falling back to
 * English), optionally scoped to `namespace` so keys resolve relative to it.
 */
export function getIntlTranslator(
  locale: string,
  messages: Messages,
  namespace?: string,
  fallback: Messages = en as unknown as Messages,
): IntlTranslator {
  const full = (key: string) => (namespace ? `${namespace}.${key}` : key);

  const t = ((key: string, values?: TranslationValues): string => {
    const fk = full(key);
    const text = resolveString(messages, fk) ?? resolveString(fallback, fk);
    if (text === undefined) {
      throw new Error(`[i18n] Missing key: "${fk}" (locale: ${locale})`);
    }
    return formatMessage(locale, text, values);
  }) as IntlTranslator;

  t.rich = (key, values = {}) => {
    const fk = full(key);
    const text = resolveString(messages, fk) ?? resolveString(fallback, fk);
    if (text === undefined) {
      throw new Error(`[i18n] Missing key: "${fk}" (locale: ${locale})`);
    }
    return renderRich(locale, text, values);
  };

  t.markup = (key, values = {}) => {
    const fk = full(key);
    const text = resolveString(messages, fk) ?? resolveString(fallback, fk);
    if (text === undefined) {
      throw new Error(`[i18n] Missing key: "${fk}" (locale: ${locale})`);
    }
    return renderMarkup(locale, text, values);
  };

  t.raw = (key) => {
    const fk = full(key);
    return resolveNode(messages, fk) ?? resolveNode(fallback, fk);
  };

  t.has = (key) => {
    const fk = full(key);
    return (
      resolveString(messages, fk) !== undefined ||
      resolveString(fallback, fk) !== undefined
    );
  };

  return t;
}
