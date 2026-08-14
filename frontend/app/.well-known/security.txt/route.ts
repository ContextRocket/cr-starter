/**
 * /.well-known/security.txt route -- RFC 9116 security contact file.
 *
 * security.txt (https://securitytxt.org / RFC 9116) is a machine- and
 * human-readable convention that tells security researchers where to
 * report vulnerabilities. Publishing it is a low-cost best practice that
 * search/security scanners look for.
 *
 * Content is generated from site.config so forks stay consistent with
 * their own contact + canonical domain without editing this file. The
 * `Expires` field is computed one year out per RFC 9116 (files with an
 * expiry more than a year away, or none at all, are treated as stale).
 */

import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

function buildSecurityTxt(): string {
  const origin = siteConfig.siteUrl.replace(/\/$/, "");
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  return [
    `Contact: mailto:${siteConfig.contactEmail}`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${origin}/.well-known/security.txt`,
  ].join("\n");
}

export function GET() {
  return new Response(buildSecurityTxt(), {
    headers: {
      "cache-control": "public, max-age=3600",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
