/** Server/build-time loader for content/gallery.json. */

import * as fs from "fs";
import * as path from "path";
import { siteConfig } from "@/config/site.config";
import { parseGalleryManifest, type GalleryManifest } from "@/lib/gallery";

function resolveGalleryPath(manifestPath: string): string {
  const fromFrontend = path.resolve(process.cwd(), manifestPath);
  if (fs.existsSync(fromFrontend)) return fromFrontend;

  const fromRoot = path.resolve(process.cwd(), "frontend", manifestPath);
  if (fs.existsSync(fromRoot)) return fromRoot;

  return fromFrontend;
}

/**
 * Load the configured gallery manifest. A missing or malformed manifest is a
 * build-time error; an explicit empty manifest is the supported opt-out.
 */
export function loadGalleryManifest(
  manifestPath = siteConfig.gallery.manifestPath,
): GalleryManifest {
  const filePath = resolveGalleryPath(manifestPath);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[gallery] Gallery manifest not found at ${filePath}. ` +
        `Create ${manifestPath} with { "version": 1, "collections": [], "assets": [] }.`,
    );
  }

  let source: string;
  try {
    source = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    throw new Error(`[gallery] Could not read ${filePath}.`, { cause: error });
  }
  return parseGalleryManifest(source, filePath);
}
