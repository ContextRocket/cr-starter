/**
 * i18n parity tests.
 *
 * The generated fixture imports exactly the locale bundles present in this
 * checkout. The same test therefore covers a three-language starter and a
 * deliberately simple English-only fork without hard-coded language imports.
 */

import { LOCALE_MESSAGE_TREES } from "@/i18n/messages/test-fixtures";

type MessageTree = Record<string, unknown>;

function collectPaths(tree: MessageTree, prefix = ""): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(tree)) {
    const fullPath = prefix ? prefix + "." + key : key;
    if (typeof value === "string" || Array.isArray(value)) {
      paths.push(fullPath);
    } else if (value !== null && typeof value === "object") {
      paths.push(...collectPaths(value as MessageTree, fullPath));
    }
  }
  return paths.sort();
}

const localeEntries = Object.entries(LOCALE_MESSAGE_TREES) as Array<
  [string, MessageTree]
>;
const en = LOCALE_MESSAGE_TREES.en as unknown as MessageTree;
const enPaths = collectPaths(en);

describe("i18n parity", () => {
  for (const [locale, tree] of localeEntries) {
    if (locale === "en") continue;
    const paths = collectPaths(tree);

    describe(locale + " vs en", () => {
      it("has the same number of leaf keys as en", () => {
        expect(paths.length).toBe(enPaths.length);
      });

      it("has no keys missing from the locale that are in en", () => {
        expect(enPaths.filter((key) => !paths.includes(key))).toEqual([]);
      });

      it("has no orphan keys absent from en", () => {
        expect(paths.filter((key) => !enPaths.includes(key))).toEqual([]);
      });
    });
  }

  describe("key resolution", () => {
    const spotCheckKeys = [
      "form.email",
      "footer.privacy",
      "impressum.title",
      "cookie.consent.accept",
      "chat.send",
    ];

    const getPath = (tree: MessageTree, path: string): unknown =>
      path.split(".").reduce<unknown>((acc, segment) => {
        if (acc && typeof acc === "object") {
          return (acc as MessageTree)[segment];
        }
        return undefined;
      }, tree);

    for (const key of spotCheckKeys) {
      it('"' + key + '" resolves in every configured locale', () => {
        for (const [, tree] of localeEntries) {
          const value = getPath(tree, key);
          expect(typeof value).toBe("string");
          expect((value as string).length).toBeGreaterThan(0);
        }
      });
    }

    it("locale labels resolve in every configured locale", () => {
      for (const [, tree] of localeEntries) {
        const locale = tree.locale as MessageTree;
        expect(String(locale.labelEnglish).length).toBeGreaterThan(0);
      }
    });

    it("no key resolves to an empty string in any locale", () => {
      const checkEmpty = (tree: MessageTree, prefix = "") => {
        for (const [key, value] of Object.entries(tree)) {
          const path = prefix ? prefix + "." + key : key;
          if (typeof value === "string") {
            expect(value.length, "empty key: " + path).toBeGreaterThan(0);
          } else if (value !== null && typeof value === "object") {
            checkEmpty(value as MessageTree, path);
          }
        }
      };
      for (const [, tree] of localeEntries) checkEmpty(tree);
    });
  });
});
