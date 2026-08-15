/**
 * Spanish (es) i18n message tree for the cr-starter.
 *
 * MERGE BARREL (cr-x3j8): re-merges the ownership-domain slices into the
 * same-shaped `es` object all importers depend on:
 *   - shared/es.ts (@eng)            form, nav, error, locale, breadcrumb, pagination, cookie
 *   - app/es.ts    (@eng)            auth, dashboard, dev, chat, embed
 *   - site/es.ts   (@content-owners) home, blog, faq, footer, impressum, privacy, preview
 * Slices have pairwise-disjoint top-level keys; the spread merge is lossless.
 *
 * Hand-translated. All keys must remain in parity with en.ts.
 * Verified by scripts/check-i18n-parity.js (pre-commit hook).
 *
 * Legal terms: "Impressum" is retained as-is -- it is a German/EU legal term
 * with no idiomatic Spanish equivalent in the context of EU web law; the
 * German term is internationally understood in EU legal contexts.
 * "Datenschutz" -> "Privacidad" / "Politica de privacidad" is the standard.
 */

import { sharedEs } from "./shared/es";
import { appEs } from "./app/es";
import { siteEs } from "./site/es";

export const es = {
  ...sharedEs,
  ...appEs,
  ...siteEs,
} as const;
