/**
 * lib/attributions.ts -- Attribution data seam: type + pure loader.
 *
 * Powers an /attribution-style credits surface (fonts, icon sets, open-source
 * libraries, image sources). One static data atom (content/attributions.json)
 * is read at build time and validated. A fork replaces the JSON with its own
 * credits; the loader stays content-agnostic and language-agnostic (names,
 * licenses, and notes are proper nouns / verbatim data, not chrome copy).
 *
 * FAIL-LOUD CONTRACT (CR "no hidden fallback" rule):
 *   - A missing file, invalid JSON, non-array root, or a malformed entry is a
 *     build-time error (throws with file/index context) — NEVER a silent [].
 *   - The only allowed empty result is an explicit, well-formed empty array.
 *
 * SERVER-SIDE ONLY: fs/path imports are Node-only. Use in Server Components or
 * at build time; never import from a client component.
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A single credit entry. `name` is required; everything else is optional so a
 * fork can credit a font (name only), an icon set (name + url + license), or a
 * library (name + url + license + note) with the same shape.
 */
export interface Attribution {
  /** Display name of the credited work (font, library, icon set, source). */
  name: string;
  /** Optional canonical URL for the work (rendered as an external link). */
  url?: string;
  /** Optional license identifier (e.g. "MIT", "OFL-1.1", "CC BY 4.0"). */
  license?: string;
  /** Optional supporting note (copyright line, author credit, description). */
  note?: string;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate a single raw entry into an Attribution. Throws with index context
 * on any malformed shape (missing/empty name, wrong field types).
 */
function validateEntry(raw: unknown, index: number, filePath: string): Attribution {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error(
      `[attributions] Entry ${index} in ${filePath} must be an object, got ${typeof raw}.`,
    );
  }
  const entry = raw as Record<string, unknown>;

  if (typeof entry.name !== "string" || entry.name.trim() === "") {
    throw new Error(
      `[attributions] Entry ${index} in ${filePath} is missing a non-empty "name" string.`,
    );
  }

  for (const field of ["url", "license", "note"] as const) {
    if (entry[field] !== undefined && typeof entry[field] !== "string") {
      throw new Error(
        `[attributions] Entry ${index} ("${entry.name}") in ${filePath} has a "${field}" ` +
          `that is not a string (got ${typeof entry[field]}).`,
      );
    }
  }

  return {
    name: entry.name.trim(),
    url: (entry.url as string | undefined)?.trim() || undefined,
    license: (entry.license as string | undefined)?.trim() || undefined,
    note: (entry.note as string | undefined)?.trim() || undefined,
  };
}

/**
 * Parse and validate the raw JSON text of an attributions atom. Exposed
 * separately from file IO so it can be unit-tested without the filesystem.
 * The root must be a JSON array of Attribution objects.
 */
export function parseAttributions(source: string, filePath: string): Attribution[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (err) {
    throw new Error(`[attributions] Invalid JSON in ${filePath}.`, { cause: err });
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      `[attributions] Root of ${filePath} must be a JSON array, got ${typeof parsed}.`,
    );
  }

  return parsed.map((raw, i) => validateEntry(raw, i, filePath));
}

// ---------------------------------------------------------------------------
// File loader (production)
// ---------------------------------------------------------------------------

/**
 * Resolve the content/attributions.json path, probing both repo-root
 * (test cwd) and frontend/ (Next.js build cwd), matching lib/blog.ts.
 */
function resolveAttributionsPath(): string {
  const fromRoot = path.resolve(process.cwd(), "content/attributions.json");
  if (fs.existsSync(fromRoot)) return fromRoot;

  const fromFrontend = path.resolve(process.cwd(), "../content/attributions.json");
  if (fs.existsSync(fromFrontend)) return fromFrontend;

  return fromRoot; // error messages reference this candidate
}

/**
 * Load and validate content/attributions.json at build time. A missing or
 * malformed file throws (fail loud) — never returns [] silently.
 */
export function loadAttributions(): Attribution[] {
  const filePath = resolveAttributionsPath();
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[attributions] Attribution data not found at ${filePath}. ` +
        `Create content/attributions.json (a JSON array of { name, url?, license?, note? }).`,
    );
  }

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    throw new Error(`[attributions] Could not read ${filePath}.`, { cause: err });
  }

  return parseAttributions(raw, filePath);
}
