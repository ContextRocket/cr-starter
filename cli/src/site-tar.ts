/**
 * Minimal, dependency-free `.tar.gz` builder for `contextrocket sites publish`.
 *
 * The CLI has ZERO runtime dependencies (see package.json), so we hand-roll a
 * POSIX ustar tar and gzip it with the built-in `node:zlib`. The backend reads
 * it with Python `tarfile` in `r:gz` mode, which accepts standard ustar +
 * gzip -- so this stays a plain, portable archive with no library coupling.
 *
 * Only regular files are emitted (a static export is served bytes). Member
 * names are the POSIX-relative paths under the export root; the backend applies
 * its own zip-slip guard on top, but we normalize to forward slashes and refuse
 * to emit anything with a `..` segment here too (defense in depth).
 */

import { gzipSync } from "node:zlib";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const BLOCK = 512;

export interface TarEntry {
  /** POSIX-relative path under the export root (forward slashes). */
  name: string;
  data: Buffer;
}

/** Raised when a static-export directory does not look like a built `out/`. */
export class SiteDirError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiteDirError";
  }
}

function octal(value: number, width: number): string {
  // ustar numeric fields: zero-padded octal + trailing NUL.
  return value.toString(8).padStart(width - 1, "0") + "\0";
}

function tarHeader(entry: TarEntry): Buffer {
  const header = Buffer.alloc(BLOCK, 0);
  const name = entry.name;
  if (Buffer.byteLength(name, "utf-8") > 100) {
    // Keep the archive simple/portable -- reject pathologically long names
    // rather than emit a GNU long-name extension the Python reader might not
    // expect. Static exports never legitimately exceed this.
    throw new SiteDirError(`path too long for tar (>100 bytes): ${name}`);
  }
  header.write(name, 0, 100, "utf-8");
  header.write(octal(0o644, 8), 100, 8, "ascii"); // mode
  header.write(octal(0, 8), 108, 8, "ascii"); // uid
  header.write(octal(0, 8), 116, 8, "ascii"); // gid
  header.write(octal(entry.data.length, 12), 124, 12, "ascii"); // size
  header.write(octal(0, 12), 136, 12, "ascii"); // mtime (deterministic)
  header.write("        ", 148, 8, "ascii"); // checksum placeholder (spaces)
  header.write("0", 156, 1, "ascii"); // typeflag: regular file
  header.write("ustar\0", 257, 6, "ascii"); // magic
  header.write("00", 263, 2, "ascii"); // version

  // Checksum: sum of all header bytes with the checksum field treated as spaces.
  let sum = 0;
  for (const b of header) sum += b;
  header.write(octal(sum, 8), 148, 8, "ascii");
  return header;
}

/** Build an uncompressed tar (ustar) from entries, then gzip it. */
export function buildTarGz(entries: TarEntry[]): Buffer {
  const blocks: Buffer[] = [];
  for (const entry of entries) {
    if (entry.name.split("/").some((seg) => seg === "..")) {
      throw new SiteDirError(`refusing to archive path with '..': ${entry.name}`);
    }
    blocks.push(tarHeader(entry));
    blocks.push(entry.data);
    const rem = entry.data.length % BLOCK;
    if (rem !== 0) blocks.push(Buffer.alloc(BLOCK - rem, 0));
  }
  // Two zero blocks terminate the archive.
  blocks.push(Buffer.alloc(BLOCK * 2, 0));
  return gzipSync(Buffer.concat(blocks));
}

function walk(root: string, dir: string, out: TarEntry[]): void {
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      walk(root, full, out);
    } else if (dirent.isFile()) {
      const rel = full.slice(root.length + 1).split(/[\\/]/).join("/");
      out.push({ name: rel, data: readFileSync(full) });
    }
    // symlinks / others are skipped -- a served-bytes site has no link members.
  }
}

/**
 * Validate that `dir` looks like a built static export and archive it.
 *
 * Sanity checks mirror the operator `make publish-site` guard:
 *   - `dir` exists and is a directory.
 *   - `index.html` is present at the root.
 *   - `_next/server` is NOT present (that is a server build, not a static
 *     export).
 *
 * Throws `SiteDirError` (operator-facing) on any failure.
 */
export function tarStaticExport(dir: string): { bytes: Buffer; fileCount: number } {
  const root = resolve(dir);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new SiteDirError(`not a directory: ${dir} -- build the static export first`);
  }
  const index = resolve(root, "index.html");
  if (!existsSync(index) || !statSync(index).isFile()) {
    throw new SiteDirError(
      `'${dir}/index.html' missing -- '${dir}' does not look like a static export (out/)`,
    );
  }
  const serverDir = resolve(root, "_next", "server");
  if (existsSync(serverDir) && statSync(serverDir).isDirectory()) {
    throw new SiteDirError(
      `'${dir}/_next/server' present -- that is a server build, not a static export. ` +
        "Rebuild with a static export (e.g. STATIC_EXPORT=true).",
    );
  }

  const entries: TarEntry[] = [];
  walk(root, root, entries);
  if (entries.length === 0) {
    throw new SiteDirError(`no files found under ${dir}`);
  }
  return { bytes: buildTarGz(entries), fileCount: entries.length };
}
