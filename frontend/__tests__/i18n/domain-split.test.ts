/**
 * i18n domain-split tests.
 *
 * The generated fixtures keep this test independent of the number of locale
 * bundles a site carries. This protects the shared/app/site ownership seam
 * for both multilingual sites and English-only forks.
 */

import { LOCALE_MESSAGE_SLICES } from "@/i18n/messages/test-fixtures";

type Tree = Record<string, unknown>;

const topKeys = (tree: Tree): string[] => Object.keys(tree).sort();
const intersect = (a: string[], b: string[]): string[] =>
  a.filter((key) => b.includes(key));

describe("i18n domain split", () => {
  for (const [locale, slices] of Object.entries(LOCALE_MESSAGE_SLICES)) {
    const { merged, shared, app, site } = slices as {
      merged: Tree;
      shared: Tree;
      app: Tree;
      site: Tree;
    };

    describe("locale " + locale, () => {
      it("has pairwise-disjoint top-level keys across shared/app/site", () => {
        expect(intersect(topKeys(shared), topKeys(app))).toEqual([]);
        expect(intersect(topKeys(shared), topKeys(site))).toEqual([]);
        expect(intersect(topKeys(app), topKeys(site))).toEqual([]);
      });

      it("union of slice keys equals the merged barrel keys", () => {
        const union = [
          ...topKeys(shared),
          ...topKeys(app),
          ...topKeys(site),
        ].sort();
        expect(union).toEqual(topKeys(merged));
      });

      it("re-merges each slice by reference", () => {
        for (const [key, value] of Object.entries({
          ...shared,
          ...app,
          ...site,
        })) {
          expect(merged[key]).toBe(value);
        }
      });
    });
  }

  it("all configured locales expose the same namespaces", () => {
    const entries = Object.values(LOCALE_MESSAGE_SLICES) as Array<{
      merged: Tree;
      shared: Tree;
      app: Tree;
      site: Tree;
    }>;
    const reference = entries[0];
    for (const current of entries.slice(1)) {
      expect(topKeys(current.merged)).toEqual(topKeys(reference.merged));
      expect(topKeys(current.shared)).toEqual(topKeys(reference.shared));
      expect(topKeys(current.app)).toEqual(topKeys(reference.app));
      expect(topKeys(current.site)).toEqual(topKeys(reference.site));
    }
  });
});
