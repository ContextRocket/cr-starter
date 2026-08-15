/**
 * English i18n message tree for the cr-starter.
 *
 * MERGE BARREL (cr-x3j8): the tree is partitioned by OWNERSHIP DOMAIN into
 * three slices that are re-merged here into the same-shaped `en` object every
 * call-site and importer already depends on:
 *   - shared/en.ts (@eng)            form, nav, error, locale, breadcrumb, pagination, cookie
 *   - app/en.ts    (@eng)            auth, dashboard, dev, chat, embed
 *   - site/en.ts   (@content-owners) home, blog, faq, footer, impressum, privacy, preview
 * The slices have pairwise-disjoint top-level keys, so the spread merge is
 * lossless and runtime key resolution is byte-compatible with the pre-split tree.
 *
 * Keys use SCREAMING_SNAKE_CASE / dot-paths to match existing call-sites.
 * Spanish and German bundles live in ./es.ts and ./de.ts.
 * Parity across locales is enforced by scripts/check-i18n-parity.js
 * (runs as a pre-commit hook; supports --domain app|site|shared).
 *
 * BOUNDARY NOTE:
 *   messages/* = UI copy (button labels, prompts, validation messages, legal boilerplate).
 *   site.config.ts = brand identity (companyName, tagline, description, siteUrl, legal fields).
 *   Do NOT duplicate brand identity strings here; components read from siteConfig directly.
 */

import { sharedEn } from "./shared/en";
import { appEn } from "./app/en";
import { siteEn } from "./site/en";

export const en = {
  ...sharedEn,
  ...appEn,
  ...siteEn,
} as const;
