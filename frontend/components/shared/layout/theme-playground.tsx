"use client";

/**
 * ThemePlayground -- URL-preview affordance for the marketing/terminal SURFACE.
 *
 * DEV/design aid, gated behind NEXT_PUBLIC_THEME_PLAYGROUND_ENABLED (OFF by
 * default) so forks do not ship it in their app runtime. When enabled:
 *   - ?surface=terminal|marketing  -- flip the SURFACE (mono+square vs sans+round)
 *                                    by setting `data-surface` on <body>.
 *
 * The override is client-only and disappears on navigation; it never writes
 * config or consent.
 */

import { useEffect } from "react";

export function ThemePlayground() {
  // Literal access so Next.js inlines the NEXT_PUBLIC_* value into the client
  // bundle (a dynamic process.env[key] lookup is NOT inlined). OFF by default,
  // so forks do not ship the playground; enable via the env var to experiment.
  const enabled = process.env.NEXT_PUBLIC_THEME_PLAYGROUND_ENABLED === "true";

  useEffect(() => {
    if (!enabled) return;

    const surface = new URLSearchParams(window.location.search).get("surface");
    if (surface === "terminal" || surface === "marketing") {
      document.body.dataset.surface = surface;
    }
  }, [enabled]);

  return null;
}
