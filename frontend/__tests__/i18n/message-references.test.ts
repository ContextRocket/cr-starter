import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { en } from "@/i18n/messages/en";

/**
 * Guard against "Missing key" runtime crashes on outer-loop pages.
 *
 * `check-i18n-parity` verifies locales agree with each other, but NOT that keys
 * referenced in the UI actually exist. This test flattens the merged `en` tree
 * and asserts every static `t("a.b.c")` key used under `app/` and `components/`
 * resolves. Dynamic keys (template literals / variables) are skipped.
 */
function flatten(
  obj: unknown,
  prefix = "",
  out = new Set<string>(),
): Set<string> {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else if (prefix) {
    out.add(prefix);
  }
  return out;
}

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(t|j)sx?$/.test(name) && !/\.test\.(t|j)sx?$/.test(name))
      acc.push(p);
  }
  return acc;
}

const KEYS = flatten(en);
// Static `t("literal")` / `t('literal')` only (exclude template literals/vars).
const T_CALL = /\bt\(\s*["']([^"'`$\n]+)["']\s*[),]/g;

describe("i18n message references", () => {
  it("every static t() key under app/ and components/ exists in en", () => {
    const files = [...walk("app"), ...walk("components")];
    const missing = new Map<string, string>();
    for (const file of files) {
      const src = readFileSync(file, "utf8");
      let m: RegExpExecArray | null;
      while ((m = T_CALL.exec(src)) !== null) {
        const key = m[1];
        // Only real dotted key paths (letters/digits per segment). Skips glob
        // or documentation strings like "home.*".
        if (!/^[a-z][a-zA-Z0-9]*(\.[a-zA-Z0-9]+)+$/.test(key)) continue;
        if (!KEYS.has(key) && !missing.has(key)) missing.set(key, file);
      }
    }
    if (missing.size) {
      const report = [...missing]
        .map(([k, f]) => `  ${k}  (${f})`)
        .join("\n");
      throw new Error(
        `Missing i18n keys referenced by pages/components:\n${report}`,
      );
    }
    expect(missing.size).toBe(0);
  });
});
