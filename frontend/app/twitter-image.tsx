/**
 * Twitter card image -- /twitter-image
 *
 * Twitter's `summary_large_image` card uses the same 1200x630 surface as
 * OpenGraph, so the OG renderer is reused to keep both assets in sync. Next's
 * metadata route loader needs `runtime` / `dynamic` statically declared in
 * this file, so those directives are duplicated here while the render fn and
 * size/contentType are re-exported from opengraph-image.
 *
 * Mirrors app/opengraph-image.tsx (same size + route conventions).
 */
import OpenGraphImage, {
  size as ogSize,
  contentType as ogContentType,
} from "./opengraph-image";

import { siteConfig } from "@/site.config";

export const dynamic = "force-static";
export const runtime = "nodejs";

export const alt = `${siteConfig.companyName} — ${siteConfig.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default OpenGraphImage;
