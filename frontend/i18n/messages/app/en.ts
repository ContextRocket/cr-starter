/**
 * App (@eng) i18n slice -- chat, embed, and development/demo surfaces.
 * Strict tri-locale parity.
 *
 * The app slice is decomposed by UI SURFACE into `modules/<surface>/` (see
 * `../modules/en.ts`); each surface is spread back in here so the merge barrel
 * (`../en.ts`) and runtime key resolution are byte-identical to the
 * pre-carve tree. This file only re-imports the carved surfaces.
 */

import { modulesEn } from "../modules/en";

export const appEn = {
  ...modulesEn,
} as const;
