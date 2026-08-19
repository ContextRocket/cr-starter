/**
 * lib/paths.ts -- resolver for the internal link-target map.
 *
 * Next.js routes are file-based, so this seam does NOT create or guarantee a
 * local route. It resolves a logical link key (nav item, "view all" href, CTA
 * target) to the destination configured in site.config.ts `paths`. That value
 * is where a LINK points -- a same-origin path (leading "/") or an absolute
 * URL -- not a promise that a matching route file exists.
 *
 * Forks remap link targets by overriding keys in site.config.ts `paths`; they
 * never edit component code to move where a link goes.
 */

import { siteConfig } from "@/config/site.config";

export type PathKey = keyof typeof siteConfig.paths;

/** Resolve a logical link target to its configured path. Forks override in site.config.ts `paths`. */
export function path(key: PathKey): string {
  return siteConfig.paths[key];
}
