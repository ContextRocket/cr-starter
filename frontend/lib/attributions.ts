/**
 * lib/attributions.ts -- Attribution data seam: types + pure loader.
 *
 * Powers the /attribution credits surface (image sources + open-source
 * libraries). One static data atom (content/attributions.json) is read at build
 * time and validated. A fork replaces the JSON with its own credits; the loader
 * stays content-agnostic and language-agnostic (names, licenses, notes, and
 * photographer credits are proper nouns / verbatim data, not chrome copy).
 *
 * SCHEMA (content/attributions.json):
 *   {
 *     "images":    ImageAttribution[]     // photo credits (e.g. Unsplash)
 *     "libraries": Attribution[]          // fonts, icon sets, OSS libraries
 *   }
 *
 * FAIL-LOUD CONTRACT (CR "no hidden fallback" rule):
 *   - A missing file, invalid JSON, a non-object root, a non-array `images` /
 *     `libraries`, or a malformed entry is a build-time error (throws with
 *     file/section/index context) -- NEVER a silent empty result.
 *   - The only allowed empty result is an explicit, well-formed empty array in
 *     either section.
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
 * A single library / font / icon-set credit. `name` is required; everything
 * else is optional so a fork can credit a font (name only), an icon set (name +
 * url + license), or a library (name + url + license + note) with one shape.
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

/**
 * A single image credit (e.g. an Unsplash photo self-hosted under
 * public/images/). Photographer + source are rendered as external links.
 */
export interface ImageAttribution {
  /** File name of the self-hosted asset (display label). */
  filename: string;
  /** Public path to the self-hosted image (rendered as a thumbnail). */
  thumbnail: string;
  /** Photographer credit: display name + profile URL. */
  author: {
    name: string;
    url: string;
  };
  /** Source credit: display name (e.g. "Unsplash") + the photo/source URL. */
  source: {
    name: string;
    url: string;
  };
  /** Canonical URL of the original photo (the "view original" link). */
  url: string;
}

/** The full attribution atom: image credits + library credits. */
export interface AttributionData {
  images: ImageAttribution[];
  libraries: Attribution[];
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate a single raw library entry into an Attribution. Throws with index
 * context on any malformed shape (missing/empty name, wrong field types).
 */
function validateLibrary(
  raw: unknown,
  index: number,
  filePath: string,
): Attribution {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error(
      `[attributions] libraries[${index}] in ${filePath} must be an object, got ${typeof raw}.`,
    );
  }
  const entry = raw as Record<string, unknown>;

  if (typeof entry.name !== "string" || entry.name.trim() === "") {
    throw new Error(
      `[attributions] libraries[${index}] in ${filePath} is missing a non-empty "name" string.`,
    );
  }

  for (const field of ["url", "license", "note"] as const) {
    if (entry[field] !== undefined && typeof entry[field] !== "string") {
      throw new Error(
        `[attributions] libraries[${index}] ("${entry.name}") in ${filePath} has a "${field}" ` +
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

/** Validate a `{ name, url }` link pair (author / source). */
function validateLink(
  raw: unknown,
  index: number,
  section: string,
  filePath: string,
): { name: string; url: string } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error(
      `[attributions] images[${index}].${section} in ${filePath} must be an object with "name" and "url".`,
    );
  }
  const link = raw as Record<string, unknown>;
  for (const field of ["name", "url"] as const) {
    if (
      typeof link[field] !== "string" ||
      (link[field] as string).trim() === ""
    ) {
      throw new Error(
        `[attributions] images[${index}].${section} in ${filePath} is missing a non-empty "${field}" string.`,
      );
    }
  }
  return {
    name: (link.name as string).trim(),
    url: (link.url as string).trim(),
  };
}

/**
 * Validate a single raw image entry into an ImageAttribution. Throws with index
 * context on any malformed shape.
 */
function validateImage(
  raw: unknown,
  index: number,
  filePath: string,
): ImageAttribution {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error(
      `[attributions] images[${index}] in ${filePath} must be an object, got ${typeof raw}.`,
    );
  }
  const entry = raw as Record<string, unknown>;

  for (const field of ["filename", "thumbnail", "url"] as const) {
    if (
      typeof entry[field] !== "string" ||
      (entry[field] as string).trim() === ""
    ) {
      throw new Error(
        `[attributions] images[${index}] in ${filePath} is missing a non-empty "${field}" string.`,
      );
    }
  }

  return {
    filename: (entry.filename as string).trim(),
    thumbnail: (entry.thumbnail as string).trim(),
    author: validateLink(entry.author, index, "author", filePath),
    source: validateLink(entry.source, index, "source", filePath),
    url: (entry.url as string).trim(),
  };
}

/**
 * Parse and validate the raw JSON text of an attributions atom. Exposed
 * separately from file IO so it can be unit-tested without the filesystem.
 * The root must be an object with array `images` and `libraries` sections.
 */
export function parseAttributions(
  source: string,
  filePath: string,
): AttributionData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (err) {
    throw new Error(`[attributions] Invalid JSON in ${filePath}.`, {
      cause: err,
    });
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(
      `[attributions] Root of ${filePath} must be a JSON object with "images" and "libraries" arrays.`,
    );
  }

  const root = parsed as Record<string, unknown>;

  if (!Array.isArray(root.images)) {
    throw new Error(
      `[attributions] "images" in ${filePath} must be a JSON array (got ${typeof root.images}).`,
    );
  }
  if (!Array.isArray(root.libraries)) {
    throw new Error(
      `[attributions] "libraries" in ${filePath} must be a JSON array (got ${typeof root.libraries}).`,
    );
  }

  return {
    images: root.images.map((raw, i) => validateImage(raw, i, filePath)),
    libraries: root.libraries.map((raw, i) =>
      validateLibrary(raw, i, filePath),
    ),
  };
}

// ---------------------------------------------------------------------------
// File loader (production)
// ---------------------------------------------------------------------------

/**
 * Resolve the content/attributions.json path, probing both the Next.js build
 * cwd (frontend/) and the repo root (test / tooling cwd).
 */
function resolveAttributionsPath(): string {
  const fromFrontend = path.resolve(process.cwd(), "content/attributions.json");
  if (fs.existsSync(fromFrontend)) return fromFrontend;

  const fromRoot = path.resolve(
    process.cwd(),
    "frontend/content/attributions.json",
  );
  if (fs.existsSync(fromRoot)) return fromRoot;

  return fromFrontend; // error messages reference this candidate
}

/**
 * Load and validate content/attributions.json at build time. A missing or
 * malformed file throws (fail loud) -- never returns an empty result silently.
 */
export function loadAttributions(): AttributionData {
  const filePath = resolveAttributionsPath();
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[attributions] Attribution data not found at ${filePath}. ` +
        `Create content/attributions.json ({ "images": [...], "libraries": [...] }).`,
    );
  }

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    throw new Error(`[attributions] Could not read ${filePath}.`, {
      cause: err,
    });
  }

  return parseAttributions(raw, filePath);
}
