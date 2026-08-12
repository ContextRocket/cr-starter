/**
 * i18n parity tests.
 *
 * Verifies that the key sets across all three message files (en, es, de)
 * are in parity. Per CR test doctrine, these tests assert keys RESOLVE
 * and key SETS MATCH -- not literal translated copy values.
 *
 * Running the parity script (node scripts/check-i18n-parity.js) provides
 * the ground-truth AST check; these Vitest tests give CI-integrated coverage.
 */

import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";
import { de } from "@/i18n/messages/de";

type MessageTree = Record<string, unknown>;

/** Collect all leaf dot-paths from a (potentially nested) message tree. */
function collectPaths(tree: MessageTree, prefix = ""): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(tree)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string" || Array.isArray(value)) {
      paths.push(fullPath);
    } else if (value !== null && typeof value === "object") {
      paths.push(...collectPaths(value as MessageTree, fullPath));
    }
  }
  return paths.sort();
}

const enPaths = collectPaths(en as unknown as MessageTree);
const esPaths = collectPaths(es as unknown as MessageTree);
const dePaths = collectPaths(de as unknown as MessageTree);

describe("i18n parity", () => {
  describe("es vs en", () => {
    it("has the same number of leaf keys as en", () => {
      expect(esPaths.length).toBe(enPaths.length);
    });

    it("has no keys missing from es that are in en", () => {
      const missingInEs = enPaths.filter((k) => !esPaths.includes(k));
      expect(missingInEs).toEqual([]);
    });

    it("has no orphan keys in es that are absent from en", () => {
      const orphanInEs = esPaths.filter((k) => !enPaths.includes(k));
      expect(orphanInEs).toEqual([]);
    });
  });

  describe("de vs en", () => {
    it("has the same number of leaf keys as en", () => {
      expect(dePaths.length).toBe(enPaths.length);
    });

    it("has no keys missing from de that are in en", () => {
      const missingInDe = enPaths.filter((k) => !dePaths.includes(k));
      expect(missingInDe).toEqual([]);
    });

    it("has no orphan keys in de that are absent from en", () => {
      const orphanInDe = dePaths.filter((k) => !enPaths.includes(k));
      expect(orphanInDe).toEqual([]);
    });
  });

  describe("key resolution", () => {
    // Spot-check that known keys resolve to non-empty strings in all three
    // locales. We assert keys RESOLVE (truthy string), not copy values.
    const spotCheckKeys = [
      "auth.login.title",
      "form.email",
      "footer.privacy",
      "impressum.title",
      "cookie.consent.accept",
      "chat.send",
      "dashboard.title",
    ] as const;

    const getPath = (tree: MessageTree, path: string): unknown =>
      path.split(".").reduce<unknown>((acc, seg) => {
        if (acc && typeof acc === "object") {
          return (acc as MessageTree)[seg];
        }
        return undefined;
      }, tree);

    for (const key of spotCheckKeys) {
      it(`"${key}" resolves to a non-empty string in all locales`, () => {
        for (const tree of [en, es, de]) {
          const value = getPath(tree as unknown as MessageTree, key);
          expect(typeof value).toBe("string");
          expect((value as string).length).toBeGreaterThan(0);
        }
      });
    }

    it("locale labels resolve in all three locales", () => {
      expect(en.locale.labelEnglish.length).toBeGreaterThan(0);
      expect(en.locale.labelSpanish.length).toBeGreaterThan(0);
      expect(en.locale.labelGerman.length).toBeGreaterThan(0);

      expect(es.locale.labelEnglish.length).toBeGreaterThan(0);
      expect(es.locale.labelSpanish.length).toBeGreaterThan(0);
      expect(es.locale.labelGerman.length).toBeGreaterThan(0);

      expect(de.locale.labelEnglish.length).toBeGreaterThan(0);
      expect(de.locale.labelSpanish.length).toBeGreaterThan(0);
      expect(de.locale.labelGerman.length).toBeGreaterThan(0);
    });

    it("no key resolves to an empty string in any locale", () => {
      const checkEmpty = (tree: MessageTree, locale: string, prefix = "") => {
        for (const [key, value] of Object.entries(tree)) {
          const path = prefix ? `${prefix}.${key}` : key;
          if (typeof value === "string") {
            expect(value.length).toBeGreaterThan(0); // key=${path} in ${locale}
          } else if (value !== null && typeof value === "object") {
            checkEmpty(value as MessageTree, locale, path);
          }
        }
      };
      checkEmpty(en as unknown as MessageTree, "en");
      checkEmpty(es as unknown as MessageTree, "es");
      checkEmpty(de as unknown as MessageTree, "de");
    });
  });
});
