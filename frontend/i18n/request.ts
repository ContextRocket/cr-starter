/**
 * next-intl request configuration.
 *
 * Wired by `createNextIntlPlugin` in `next.config.mjs`. next-intl calls this
 * per server request to resolve the active locale and message tree.
 *
 * Reuses the existing hand-translated TS message trees in
 * `frontend/i18n/messages/{en,es,de}.ts` - no new message format is
 * introduced. The `resolveLocale` helper from `./messages` normalises any
 * unknown value to `"en"`.
 *
 * This file is the ONLY next-intl-specific addition; the custom `t()`
 * system (keys.ts) keeps working unchanged for the existing call sites.
 */

import { getRequestConfig } from "next-intl/server";
import { en } from "./messages/en";
import { es } from "./messages/es";
import { de } from "./messages/de";
import { resolveLocale } from "./messages";

/** All locale trees keyed by SupportedLocale. */
const TREES = { en, es, de } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` is a Promise<string | undefined> supplied by next-intl.
  // It resolves to the `[locale]` segment value (or undefined for routes
  // outside the segment). Normalise via `resolveLocale` so unknowns -> "en".
  const raw = await requestLocale;
  const locale = resolveLocale(raw);
  return {
    locale,
    messages: TREES[locale] as unknown as Record<string, unknown>,
  };
});
