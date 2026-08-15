"use client";

/**
 * dev-notice-bar.tsx — the dismissable development-only configuration notice.
 *
 * A thin client wrapper around the server-gated siteUrl warning in the [locale]
 * layout: the layout decides WHETHER to render (dev + unreplaced siteUrl
 * placeholder) and passes the already-resolved copy; this component owns only
 * the SESSION-SCOPED dismiss (a × that hides it until the tab is reloaded).
 *
 * Dismissal is intentionally in-memory (no localStorage): the bar is a dev-only
 * reminder to replace the placeholder, so it should reappear on the next reload
 * until the config is actually fixed. Token-styled with an amber accent that
 * stays legible in dark mode (border/foreground carry through the tint).
 */

import { useState } from "react";
import { X } from "lucide-react";

interface DevNoticeBarProps {
  /** Bold lead-in label (already i18n-resolved). */
  label: string;
  /** Notice body copy (already i18n-resolved). */
  message: string;
  /** Accessible label for the dismiss button (already i18n-resolved). */
  dismissLabel: string;
}

export function DevNoticeBar({
  label,
  message,
  dismissLabel,
}: DevNoticeBarProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="alert"
      data-testid="siteurl-placeholder-warning"
      className="flex items-center gap-3 border-b border-amber-500/60 bg-amber-100 px-4 py-2 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <p className="min-w-0 flex-1 text-center">
        <strong>{label}</strong> {message}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={dismissLabel}
        data-testid="siteurl-placeholder-warning-dismiss"
        className="shrink-0 rounded-sm p-0.5 opacity-70 transition-opacity duration-200 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current motion-reduce:transition-none"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
