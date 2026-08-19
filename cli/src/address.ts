/**
 * Content-store addressing -- pure `cr://<org>/<folder-path>/<filename>` helpers.
 *
 * Ported from the backend `content_store/address.py` so the CLI parses the same
 * S3-analogous address grammar without a second, subtly-different parser:
 *
 *     cr://<bucket>/<folder-path>/<filename>
 *          └ org ─┘ └── key prefix ──┘ └ key ┘
 *
 * Path-traversal is a HARD boundary: a `..` segment, an absolute path, a
 * backslash, or a NUL byte anywhere in the address throws `ContentAddressError`.
 * Absence of an explicit filename is allowed for prefix operations (ls / rm a
 * whole folder) but never for a byte get / put.
 *
 * All helpers are pure (no I/O) and language/site-agnostic.
 */

const SCHEME = "cr://";

/** Thrown when a `cr://` address or a folder/filename component is unsafe. */
export class ContentAddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentAddressError";
  }
}

export interface ContentAddress {
  /** Org handle/identity token (or UUID) -- opaque; resolved at the I/O edge. */
  bucket: string;
  /** Normalized folder namespace (`a/b/c` or `""` for the root). */
  folderPath: string;
  /** Final key segment, or `null` for a prefix-only address. */
  filename: string | null;
}

/**
 * Return a canonical `a/b/c` path or `""` for the root.
 *
 * Strips leading/trailing slashes, collapses repeats, drops empty and `.`
 * segments. `null`/empty/whitespace-only → `""`. Whitespace inside a segment is
 * preserved; only surrounding whitespace on each segment is trimmed. (Port of
 * `app.core.source_folders.normalize_folder_path`.)
 */
export function normalizeFolderPath(folderPath: string | null | undefined): string {
  if (!folderPath) return "";
  const segments = folderPath.split("/").map((s) => s.trim());
  const kept = segments.filter((s) => s && s !== ".");
  return kept.join("/");
}

function rejectUnsafeSegment(segment: string, kind: string): void {
  if (!segment) {
    throw new ContentAddressError(`empty ${kind} segment is not allowed`);
  }
  if (segment === "." || segment === "..") {
    throw new ContentAddressError(
      `${kind} segment '${segment}' would traverse the namespace`,
    );
  }
  if (segment.includes("/") || segment.includes("\\")) {
    throw new ContentAddressError(
      `${kind} segment must not contain a path separator: '${segment}'`,
    );
  }
  if (segment.includes("\x00")) {
    throw new ContentAddressError(`${kind} segment must not contain a NUL byte`);
  }
}

/** Return a canonical, traversal-safe folder prefix, fail-closed on `..`/`\`/NUL. */
export function normalizeContentFolderPath(folderPath: string | null | undefined): string {
  const normalized = normalizeFolderPath(folderPath);
  if (!normalized) return "";
  for (const segment of normalized.split("/")) {
    if (segment === "..") {
      throw new ContentAddressError(
        "folder path segment '..' would traverse the namespace",
      );
    }
    if (segment.includes("\\") || segment.includes("\x00")) {
      throw new ContentAddressError(`folder path segment is unsafe: '${segment}'`);
    }
  }
  return normalized;
}

/** Return a single safe filename segment (basename only), fail-closed. */
export function normalizeContentFilename(filename: string): string {
  const candidate = (filename ?? "").trim();
  rejectUnsafeSegment(candidate, "filename");
  return candidate;
}

/**
 * Parse a `cr://<bucket>/<folder-path>/<filename>` string, fail-closed.
 *
 *     cr://acme/gtm/positioning.md -> bucket=acme folder=gtm file=positioning.md
 *     cr://acme/gtm/               -> bucket=acme folder=gtm file=null (prefix)
 *     cr://acme/report.md          -> bucket=acme folder=""  file=report.md
 *     cr://acme                    -> bucket=acme folder=""  file=null (root prefix)
 */
export function parseContentAddress(address: string): ContentAddress {
  if (typeof address !== "string" || !address.trim()) {
    throw new ContentAddressError("address is required");
  }
  const raw = address.trim();
  if (!raw.toLowerCase().startsWith(SCHEME)) {
    throw new ContentAddressError(
      `address must start with '${SCHEME}' (got '${raw.slice(0, 16)}'...)`,
    );
  }
  if (raw.includes("\x00")) {
    throw new ContentAddressError("address must not contain a NUL byte");
  }

  const remainder = raw.slice(SCHEME.length);
  const trailingSlash = remainder.endsWith("/");
  const parts = remainder.split("/").filter((s) => s !== "");
  if (parts.length === 0) {
    throw new ContentAddressError("address is missing a bucket (org) component");
  }

  const bucket = parts[0].trim();
  if (!bucket) {
    throw new ContentAddressError("address bucket (org) component is empty");
  }
  if (bucket === "." || bucket === ".." || bucket.includes("\\")) {
    throw new ContentAddressError(`unsafe bucket component: '${bucket}'`);
  }

  const rest = parts.slice(1);
  if (rest.length === 0) {
    return { bucket, folderPath: "", filename: null };
  }

  if (trailingSlash) {
    const folderPath = normalizeContentFolderPath(rest.join("/"));
    return { bucket, folderPath, filename: null };
  }

  const filename = normalizeContentFilename(rest[rest.length - 1]);
  const folderPath = normalizeContentFolderPath(rest.slice(0, -1).join("/"));
  return { bucket, folderPath, filename };
}
