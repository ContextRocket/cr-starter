/**
 * Site (@content-owners) copy for the blog. Site copy MAY ship a
 * locale subset ahead of full translation (parity is warn-only for site).
 *
 * Fork-owned site copy. Keep brand language here rather than in shared code.
 * The merge barrel (../es.ts) re-merges shared+app+site into `es`,
 * so runtime key resolution is unchanged; this file only decides ownership.
 */

import type { siteEn } from "./en";
import type { LocaleMessages } from "../en";

export const siteEs: LocaleMessages<typeof siteEn> = {
  blog: {
    title: "Blog",
    subtitle: "Artículos, guías y novedades del producto.",
    description: "Artículos, guías y novedades.",
    featured: "Destacado",
    all_posts: "Todas las publicaciones",
    empty: "Aún no hay publicaciones. Vuelve pronto.",
    back: {
      home: "Volver al inicio",
      to: {
        list: "Todas las publicaciones",
      },
    },
    not: {
      found: "Publicación no encontrada",
    },
    min: {
      read: "min de lectura",
    },
  },
} as const;
