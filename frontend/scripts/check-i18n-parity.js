#!/usr/bin/env node
/**
 * check-i18n-parity.js
 *
 * AST-based parity check between en.ts and every other locale (es.ts, de.ts).
 *
 * Adapted from context-rocket/frontend/scripts/check-i18n-parity.js.
 *
 * For every non-English locale the check:
 *   1. Walks the locale's `export const <locale> = { ... }` object literal
 *      via the TypeScript Compiler API and collects every leaf path.
 *   2. Compares against en's leaf set:
 *        - `missing`:  keys in en but absent from the locale.
 *        - `orphan`:   keys in the locale but absent from en.
 *   3. Exits nonzero if either side has any drift.
 *
 * Usage:
 *   node frontend/scripts/check-i18n-parity.js
 *   (or from inside frontend/): node scripts/check-i18n-parity.js
 *
 * Exit codes:
 *   0  -- all non-en locales are in parity with en
 *   1  -- at least one locale has missing or orphan keys, or failed to parse
 */

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

// Resolve messages dir relative to this script, supporting both
// `node frontend/scripts/...` (from repo root) and
// `node scripts/...` (from inside frontend/).
const MESSAGES_DIR = (() => {
  const candidate1 = path.resolve(__dirname, "../i18n/messages");
  const candidate2 = path.resolve(__dirname, "../../frontend/i18n/messages");
  if (fs.existsSync(candidate1)) return candidate1;
  if (fs.existsSync(candidate2)) return candidate2;
  return candidate1; // will fail gracefully below
})();

const REFERENCE_LOCALE = "en";
const SUPPORTED_LOCALES = ["en", "es", "de"];
const CHECK_LOCALES = SUPPORTED_LOCALES.filter((l) => l !== REFERENCE_LOCALE);

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

/**
 * Recursively walk an ObjectLiteralExpression and yield every leaf dot-path.
 * A "leaf" is a PropertyAssignment whose initializer is a StringLiteral,
 * NoSubstitutionTemplateLiteral, or ArrayLiteralExpression of string literals.
 *
 * @param {import("typescript").ObjectLiteralExpression} root
 * @returns {{ path: string, kind: "string"|"array" }[]}
 */
function collectLeaves(root) {
  const out = [];
  const walk = (node, parts) => {
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const name = propertyName(prop.name);
      if (name === null) continue;
      const value = prop.initializer;
      if (ts.isObjectLiteralExpression(value)) {
        walk(value, [...parts, name]);
      } else if (
        ts.isStringLiteral(value) ||
        ts.isNoSubstitutionTemplateLiteral(value)
      ) {
        out.push({ path: [...parts, name].join("."), kind: "string" });
      } else if (ts.isArrayLiteralExpression(value)) {
        const allString = value.elements.every(
          (el) =>
            ts.isStringLiteral(el) || ts.isNoSubstitutionTemplateLiteral(el),
        );
        if (allString) {
          out.push({ path: [...parts, name].join("."), kind: "array" });
        }
      }
    }
  };
  walk(root, []);
  return out;
}

/**
 * Read `i18n/messages/<locale>.ts`, find `export const <locale> = { ... }`,
 * and return the ObjectLiteralExpression.
 *
 * @param {string} locale
 * @returns {import("typescript").ObjectLiteralExpression}
 */
function loadLocaleObject(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.ts`);
  const source = fs.readFileSync(filePath, "utf8");
  const sf = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  for (const stmt of sf.statements) {
    if (
      ts.isVariableStatement(stmt) &&
      stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const decl of stmt.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.name.text === locale &&
          decl.initializer
        ) {
          let init = decl.initializer;
          if (ts.isAsExpression(init)) init = init.expression;
          if (ts.isObjectLiteralExpression(init)) return init;
        }
      }
    }
  }
  throw new Error(
    `Could not find \`export const ${locale} = { ... }\` in ${filePath}`,
  );
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isPrivateIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name))
    return name.text;
  if (ts.isNumericLiteral(name)) return name.text;
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const referenceFile = path.join(MESSAGES_DIR, `${REFERENCE_LOCALE}.ts`);
if (!fs.existsSync(referenceFile)) {
  console.error(`ERROR: reference locale not found at ${referenceFile}`);
  process.exit(1);
}

let referenceLeaves;
try {
  referenceLeaves = collectLeaves(loadLocaleObject(REFERENCE_LOCALE));
} catch (err) {
  console.error(
    `ERROR: failed to parse ${REFERENCE_LOCALE}.ts: ${err.message}`,
  );
  process.exit(1);
}

const referencePaths = new Set(referenceLeaves.map((l) => l.path));
console.log(
  `Reference locale: ${REFERENCE_LOCALE} (${referencePaths.size} leaf dot-paths)\n`,
);

let hasMismatch = false;

for (const locale of CHECK_LOCALES) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.ts`);
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: missing locale file: ${filePath}`);
    hasMismatch = true;
    continue;
  }

  let leaves;
  try {
    leaves = collectLeaves(loadLocaleObject(locale));
  } catch (err) {
    console.error(`ERROR: failed to parse ${locale}.ts: ${err.message}`);
    hasMismatch = true;
    continue;
  }

  const localePaths = new Set(leaves.map((l) => l.path));
  const missing = [...referencePaths].filter((p) => !localePaths.has(p)).sort();
  const orphan = [...localePaths].filter((p) => !referencePaths.has(p)).sort();

  if (missing.length === 0 && orphan.length === 0) {
    console.log(
      `ok ${locale}: in parity with ${REFERENCE_LOCALE} (${localePaths.size} leaf paths)`,
    );
    continue;
  }

  hasMismatch = true;
  console.log(
    `FAIL ${locale}: ${localePaths.size} keys (en=${referencePaths.size}); missing=${missing.length}, orphan=${orphan.length}`,
  );
  const shown = missing.slice(0, 50);
  for (const k of shown) console.log(`    MISSING: ${k}`);
  if (missing.length > shown.length) {
    console.log(`    ... (${missing.length - shown.length} more missing)`);
  }
  const shownOrphan = orphan.slice(0, 50);
  for (const k of shownOrphan) console.log(`    ORPHAN:  ${k}`);
  if (orphan.length > shownOrphan.length) {
    console.log(`    ... (${orphan.length - shownOrphan.length} more orphan)`);
  }
}

if (hasMismatch) {
  console.log(
    "\nFAIL: One or more locales are out of parity with en. Add or remove keys to align them.",
  );
  process.exit(1);
}

console.log("\nPASS: All non-en locales are in parity with en.");
