/**
 * i18n/keys.ts -- build-time / Astro translation entry point.
 * Pattern: const t = createT(locale); t("home.hero.headline")
 */

import { en } from "./messages/en";
import { es } from "./messages/es";
import { de } from "./messages/de";
import {
  createTranslator,
  createArrayTranslator,
  type Path,
  type Messages,
  type Translator,
  type ArrayTranslator,
  type TranslationValues,
} from "./translator";
import type { SupportedLocale } from "./messages/registry";

export type {
  Path,
  SupportedLocale,
  Translator,
  ArrayTranslator,
  TranslationValues,
  Messages,
};

const trees: Record<SupportedLocale, Messages> = {
  en: en as unknown as Messages,
  es: es as unknown as Messages,
  de: de as unknown as Messages,
};

export function getMessages(locale: SupportedLocale): Messages {
  return trees[locale] ?? trees.en;
}

export function createT(locale: SupportedLocale): Translator {
  return createTranslator(locale, getMessages(locale));
}

export function createTArray(locale: SupportedLocale): ArrayTranslator {
  return createArrayTranslator(locale, getMessages(locale));
}
