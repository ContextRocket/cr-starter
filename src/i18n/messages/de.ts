/**
 * German (de) i18n message tree for the cr-starter.
 *
 * MERGE BARREL (cr-x3j8): re-merges the ownership-domain slices into the
 * same-shaped `de` object all importers depend on:
 *   - shared/de.ts (@eng)            form, nav, error, locale, breadcrumb, pagination, cookie
 *   - app/de.ts    (@eng)            dev, chat, embed
 *   - site/de.ts   (@content-owners) home, blog, faq, footer, impressum, privacy, preview
 * Slices have pairwise-disjoint top-level keys; the spread merge is lossless.
 *
 * Hand-translated. All keys must remain in parity with en.ts.
 * Verified by scripts/check-i18n-parity.js (pre-commit hook).
 *
 * Legal terminology notes:
 *   "Impressum"          -- German legal term (§ 5 Digitale-Dienste-Gesetz, DDG); retained verbatim.
 *   "Datenschutzerklärung" -- standard German for "Privacy Policy".
 *   "Handelsregister"    -- Company Register.
 *   "Umsatzsteuer-ID"    -- VAT ID (Umsatzsteuer-Identifikationsnummer).
 *   "Vertreten durch"    -- Represented by (legal representative).
 *   "Datenschutzkontakt" -- Privacy contact.
 */

import type { en, LocaleMessages } from "./en";
import { sharedDe } from "./shared/de";
import { appDe } from "./app/de";
import { siteDe } from "./site/de";

export const de: LocaleMessages<typeof en> = {
  ...sharedDe,
  ...appDe,
  ...siteDe,
} as const;
