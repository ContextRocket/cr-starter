/**
 * i18n/format.ts -- next-intl-compatible formatter (`useFormatter` /
 * `getFormatter`). Thin wrappers over the platform `Intl.*` APIs, locale-bound.
 * Covers the subset in use: dateTime, number, relativeTime, list.
 */

import type { SupportedLocale } from "./messages/registry";

export interface Formatter {
  dateTime(value: Date | number, options?: Intl.DateTimeFormatOptions): string;
  number(value: number | bigint, options?: Intl.NumberFormatOptions): string;
  relativeTime(value: Date | number, now?: Date | number): string;
  list(value: Iterable<string>, options?: Intl.ListFormatOptions): string;
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
  ["second", 1000],
];

export function createFormatter(locale: SupportedLocale): Formatter {
  return {
    dateTime(value, options) {
      return new Intl.DateTimeFormat(locale, options).format(value);
    },
    number(value, options) {
      return new Intl.NumberFormat(locale, options).format(value);
    },
    relativeTime(value, now) {
      const from = now instanceof Date ? now.getTime() : (now ?? Date.now());
      const to = value instanceof Date ? value.getTime() : value;
      const deltaMs = to - from;
      const abs = Math.abs(deltaMs);
      const [unit, ms] =
        RELATIVE_UNITS.find(([, u]) => abs >= u) ??
        RELATIVE_UNITS[RELATIVE_UNITS.length - 1];
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
      return rtf.format(Math.round(deltaMs / ms), unit);
    },
    list(value, options) {
      return new Intl.ListFormat(locale, options).format(value);
    },
  };
}
