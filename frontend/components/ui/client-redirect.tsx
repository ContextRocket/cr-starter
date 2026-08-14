"use client";

import { useEffect } from "react";

/**
 * ClientRedirect — a static-export-friendly "this page has moved" redirect.
 *
 * Use for a route that must stay reachable (e.g. it's in the sitemap / has
 * inbound links) but whose content has moved elsewhere. On a static host there
 * is no server to issue a 301, so this sends visitors on via three layers:
 *   1. React 19 hoists the `<meta http-equiv="refresh">` into <head> — a
 *      no-JavaScript redirect.
 *   2. `window.location.replace` on mount — the fast path (and it replaces the
 *      history entry so Back doesn't bounce).
 *   3. A visible manual link as a final fallback.
 *
 * Props-driven (cr-starter convention): the copy is passed in and localized at
 * the call site. `to` should be a fully-resolved path (include the locale
 * segment on a localized static site, e.g. `/en/auth/register`).
 *
 * A true 301 for SEO is best configured at the CDN/host layer; this is the
 * in-app best effort for static export.
 */
export interface ClientRedirectProps {
  /** Destination path (fully resolved, e.g. "/en/auth/register"). */
  to: string;
  /** Short "Redirecting…" line. */
  message: string;
  /** Manual-fallback link label. */
  linkLabel: string;
}

export function ClientRedirect({ to, message, linkLabel }: ClientRedirectProps) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <>
      {/* No-JS fallback — React 19 hoists this into <head>. */}
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-muted-foreground">{message}</p>
        <a
          href={to}
          className="text-primary underline underline-offset-2 hover:no-underline"
        >
          {linkLabel}
        </a>
      </main>
    </>
  );
}
