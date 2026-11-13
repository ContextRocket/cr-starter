/**
 * Site (@content-owners) copy for the blog. Site copy MAY ship a
 * locale subset ahead of full translation (parity is warn-only for site).
 *
 * Fork-owned site copy. Keep brand language here rather than in shared code.
 * The merge barrel (../de.ts) re-merges shared+app+site into `de`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

import type { siteEn } from "./en";
import type { LocaleMessages } from "../en";

export const siteDe: LocaleMessages<typeof siteEn> = {
  blog: {
    title: "Blog",
    subtitle: "Artikel, Anleitungen und Produkt-Neuigkeiten.",
    description: "Artikel, Anleitungen und Neuigkeiten.",
    featured: "Empfohlen",
    all_posts: "Alle Beiträge",
    topics: "Themen",
    topics_description: "Zeitlose Leitfäden und Referenzartikel.",
    topics_empty: "Noch keine Themen veröffentlicht.",
    contents: "In diesem Artikel",
    updated: "Aktualisiert",
    empty: "Noch keine Beiträge. Schauen Sie bald wieder vorbei.",
    back: {
      home: "Zurück zur Startseite",
      to: {
        list: "Alle Beiträge",
      },
    },
    not: {
      found: "Beitrag nicht gefunden",
    },
    min: {
      read: "Min. Lesezeit",
    },
  },
} as const;
