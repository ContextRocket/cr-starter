"use client";

/**
 * Cookie preferences dialog -- the granular "Manage settings" surface rendered
 * as a MODAL (not the previous inline expandable panel). Shared by every banner
 * layout ("bar", "card", "terminal"): the banner's "Manage settings" control
 * opens this dialog; "Save preferences" persists the choice and dismisses both
 * the dialog and the banner.
 *
 * Categories (see lib/analytics.ts): Necessary (locked on) + Analytics +
 * Marketing toggles. The dialog is layout-agnostic; only the wrapper positions
 * it.
 */

import { useEffect } from "react";
import { useTranslations } from "@/i18n/locale-provider";

import { CookiePreferencesPanel } from "./preferences-panel";

export function CookiePreferencesDialog({
  onSaved,
  onClose,
}: {
  /** Persisted a granular choice -- dismiss the dialog AND the banner. */
  onSaved: () => void;
  /** Closed without saving (backdrop / Escape / X) -- banner stays visible. */
  onClose: () => void;
}) {
  const t = useTranslations();

  // Escape closes the dialog without saving.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop: click outside / Escape closes without saving. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        data-testid="cookie-consent-dialog-backdrop"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Dialog card. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("cookie.consent.prefs.title")}
        data-testid="cookie-consent-dialog"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-card-border bg-background shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            {t("cookie.consent.prefs.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("cookie.consent.prefs.close")}
            data-testid="cookie-consent-dialog-close"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
          <CookiePreferencesPanel onSaved={onSaved} />
        </div>
      </div>
    </div>
  );
}
