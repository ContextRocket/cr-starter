"use client";

/**
 * Cookie preferences panel -- the granular "Manage settings" surface shared by
 * BOTH banner layouts ("bar" and "card"). Renders one row per consent category
 * with a toggle, plus a "Save preferences" action.
 *
 * Categories (see lib/analytics.ts):
 *   - Necessary  -- always on, toggle disabled (strictly-required cookies).
 *   - Analytics  -- governs whether analytics scripts load.
 *   - Marketing  -- persisted for forks; the shipped starter loads nothing.
 *
 * This is layout-agnostic: the bar and card wrappers each expand this same
 * panel inline. Only the wrapper/positioning differs by cookieBannerStyle; the
 * category rows, toggles, save contract, and testids are identical.
 *
 * Adapted (and simplified) from
 * context-rocket/frontend/components/cookie-consent/cookie-preferences-controls.tsx
 * for the starter's tokens, i18n (useTranslations from i18n/client), and binary
 * analytics gate. No CR-specific terminal styling.
 */

import { useState } from "react";
import {
  OPTIONAL_CONSENT_CATEGORIES,
  readConsentCategories,
  saveConsentCategories,
  type ConsentCategories,
  type OptionalConsentCategory,
} from "@/lib/analytics";
import { useTranslations } from "@/i18n/locale-provider";


const OPTIONAL_META: Record<
  OptionalConsentCategory,
  { labelKey: string; descriptionKey: string }
> = {
  analytics: {
    labelKey: "cookie.consent.prefs.category.analytics.label",
    descriptionKey: "cookie.consent.prefs.category.analytics.description",
  },
  marketing: {
    labelKey: "cookie.consent.prefs.category.marketing.label",
    descriptionKey: "cookie.consent.prefs.category.marketing.description",
  },
};

/**
 * A single category row: label + description on the left, a native checkbox
 * toggle on the right. `necessary` is locked on (disabled).
 */
function CategoryRow({
  label,
  description,
  checked,
  disabled,
  onChange,
  testId,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  testId: string;
}) {
  return (
    <div
      className="flex items-start justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2.5"
      data-testid={testId}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border accent-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

/**
 * Shared preferences panel. `onSaved` fires after a successful save so the
 * wrapper can dismiss the banner.
 */
export function CookiePreferencesPanel({
  onSaved,
}: {
  onSaved?: () => void;
}) {
  const t = useTranslations();

  // Seed from any prior granular choice; default is privacy-preserving (off).
  const [categories, setCategories] = useState<ConsentCategories>(
    () =>
      readConsentCategories() ?? {
        necessary: true,
        analytics: false,
        marketing: false,
      },
  );

  function toggle(category: OptionalConsentCategory, enabled: boolean) {
    setCategories((current) => ({ ...current, [category]: enabled }));
  }

  function handleSave() {
    saveConsentCategories(categories);
    onSaved?.();
  }

  return (
    <div className="flex flex-col gap-2" data-testid="cookie-consent-preferences">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("cookie.consent.prefs.description")}
      </p>

      <CategoryRow
        label={t("cookie.consent.prefs.category.necessary.label")}
        description={t("cookie.consent.prefs.category.necessary.description")}
        checked
        disabled
        testId="cookie-consent-pref-necessary"
      />

      {OPTIONAL_CONSENT_CATEGORIES.map((category) => {
        const meta = OPTIONAL_META[category];
        return (
          <CategoryRow
            key={category}
            label={t(meta.labelKey)}
            description={t(meta.descriptionKey)}
            checked={categories[category]}
            onChange={(enabled) => toggle(category, enabled)}
            testId={`cookie-consent-pref-${category}`}
          />
        );
      })}

      <div className="mt-0.5 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          data-testid="cookie-consent-save"
          className="inline-flex min-h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        >
          {t("cookie.consent.prefs.save")}
        </button>
      </div>
    </div>
  );
}
