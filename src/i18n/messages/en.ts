/**
 * English i18n message tree for the cr-starter.
 *
 * The tree is partitioned by ownership domain into three slices:
 *   - shared/en.ts (@eng)            form, nav, error, locale, breadcrumb, pagination, cookie
 *   - app/en.ts    (@eng)            dev, chat, embed
 *   - site/en.ts   (@content-owners) landing-page and blog copy
 * The slices have pairwise-disjoint top-level keys. Locale shape parity is
 * checked by scripts/check-i18n-parity.cjs.
 *
 * BOUNDARY NOTE:
 *   messages/* = UI copy (button labels, prompts, and validation messages).
 *   site.config.ts = brand identity (companyName, tagline, description, siteUrl).
 *   Do NOT duplicate brand identity strings here; components read from siteConfig directly.
 */

import { sharedEn } from "./shared/en";
import { appEn } from "./app/en";
import { siteEn } from "./site/en";

/**
 * Preserve the message shape while allowing translated strings.
 */
export type LocaleMessages<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? readonly string[]
      : T[K] extends object
        ? LocaleMessages<T[K]>
        : T[K];
};

export const en = {
  ...sharedEn,
  ...appEn,
  ...siteEn,
} as const;
