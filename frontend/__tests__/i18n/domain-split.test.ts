/**
 * i18n domain-split tests (cr-x3j8).
 *
 * The message tree is partitioned by OWNERSHIP DOMAIN into three slices
 * (shared/app/site) that a merge barrel re-merges into `en`/`es`/`de`. These
 * tests guard the partition contract so the split cannot silently drift into
 * overlapping ownership or a lossy merge:
 *   (a) the three slices per locale have pairwise-DISJOINT top-level keys
 *       (no namespace owned by two domains),
 *   (b) their union equals the merged barrel's top-level keys (lossless merge,
 *       no orphaned or dropped namespace),
 *   (c) en/es/de expose identical top-level key sets (locale parity at the
 *       namespace level).
 *
 * Per CR test doctrine, these assert key SETS, not translated copy values.
 */

import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";
import { de } from "@/i18n/messages/de";

import { sharedEn } from "@/i18n/messages/shared/en";
import { sharedEs } from "@/i18n/messages/shared/es";
import { sharedDe } from "@/i18n/messages/shared/de";
import { appEn } from "@/i18n/messages/app/en";
import { appEs } from "@/i18n/messages/app/es";
import { appDe } from "@/i18n/messages/app/de";
import { siteEn } from "@/i18n/messages/site/en";
import { siteEs } from "@/i18n/messages/site/es";
import { siteDe } from "@/i18n/messages/site/de";

type Tree = Record<string, unknown>;

const topKeys = (t: Tree): string[] => Object.keys(t).sort();

const intersect = (a: string[], b: string[]): string[] =>
  a.filter((k) => b.includes(k));

interface LocaleSlices {
  merged: Tree;
  shared: Tree;
  app: Tree;
  site: Tree;
}

const byLocale: Record<"en" | "es" | "de", LocaleSlices> = {
  en: { merged: en, shared: sharedEn, app: appEn, site: siteEn },
  es: { merged: es, shared: sharedEs, app: appEs, site: siteEs },
  de: { merged: de, shared: sharedDe, app: appDe, site: siteDe },
};

describe("i18n domain split", () => {
  describe.each(["en", "es", "de"] as const)("locale %s", (locale) => {
    const { merged, shared, app, site } = byLocale[locale];

    it("has pairwise-disjoint top-level keys across shared/app/site", () => {
      const s = topKeys(shared);
      const a = topKeys(app);
      const i = topKeys(site);
      expect(intersect(s, a)).toEqual([]);
      expect(intersect(s, i)).toEqual([]);
      expect(intersect(a, i)).toEqual([]);
    });

    it("union of slice top-level keys equals the merged barrel top-level keys", () => {
      const union = [
        ...topKeys(shared),
        ...topKeys(app),
        ...topKeys(site),
      ].sort();
      expect(union).toEqual(topKeys(merged));
    });

    it("re-merges each slice's values by reference (lossless barrel)", () => {
      // Every top-level namespace on the barrel is the same object identity as
      // the slice that owns it -- proves the spread merge did not clone/mutate.
      for (const [key, value] of Object.entries({
        ...shared,
        ...app,
        ...site,
      })) {
        expect((merged as Tree)[key]).toBe(value);
      }
    });
  });

  it("en/es/de expose identical top-level key sets (namespace parity)", () => {
    const enKeys = topKeys(en);
    expect(topKeys(es)).toEqual(enKeys);
    expect(topKeys(de)).toEqual(enKeys);
  });

  it("each domain owns the same namespaces across all three locales", () => {
    expect(topKeys(sharedEs)).toEqual(topKeys(sharedEn));
    expect(topKeys(sharedDe)).toEqual(topKeys(sharedEn));
    expect(topKeys(appEs)).toEqual(topKeys(appEn));
    expect(topKeys(appDe)).toEqual(topKeys(appEn));
    expect(topKeys(siteEs)).toEqual(topKeys(siteEn));
    expect(topKeys(siteDe)).toEqual(topKeys(siteEn));
  });
});
