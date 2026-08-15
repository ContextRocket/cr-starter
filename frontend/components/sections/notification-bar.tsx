"use client";

/**
 * notification-bar.tsx — reusable top-of-page notification banners.
 *
 * A vertical STACK of full-width banners pinned above the site chrome. Each bar
 * is one row: [leading icon] + message (with an optional inline action link) +
 * a right-aligned dismiss × button. Tones map to soft-tinted accent-surface
 * pairs (theme tokens only — no hardcoded hex here). Multiple bars stack; each
 * is independently dismissible and stays dismissed across reloads via
 * localStorage.
 *
 * i18n-AGNOSTIC BY DESIGN: `message` and `action.label` are ALREADY-RESOLVED
 * strings — the CALLER passes t()'d copy (see app/[locale]/layout.tsx, which
 * resolves company.config `notifications` keys). This keeps the component a
 * pure, reusable primitive with no coupling to the message tree.
 *
 * EMPTY-SAFE: NotificationBarStack renders NOTHING (no wrapper, no layout
 * shift) when there are no visible items — the shipped default config is empty,
 * so nothing renders out of the box.
 */

import { useEffect, useState } from "react";
import {
  X,
  Info,
  TriangleAlert,
  CircleCheck,
  CircleAlert,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Visual tone of a notification bar — maps to a soft accent-surface pair. */
export type NotificationTone = "info" | "warning" | "success" | "neutral";

/**
 * Curated lucide-icon map for config-driven (server-passed) items. A server
 * component cannot pass a React component across the RSC boundary, so the
 * config path references an icon by NAME and this client component resolves it.
 * Programmatic client callers may still pass a LucideIcon directly (see `icon`).
 * Extend this map to reference a new icon by name from company.config.
 */
const ICON_BY_NAME: Record<string, LucideIcon> = {
  Info,
  TriangleAlert,
  CircleCheck,
  CircleAlert,
  Megaphone,
};

/**
 * One notification. `message` and `action.label` are resolved strings supplied
 * by the caller (i18n happens upstream). `id` must be stable — it is the
 * dismissal key persisted to localStorage.
 *
 * ICON: pass EITHER `icon` (a LucideIcon — only from client callers, since a
 * component cannot cross the RSC boundary) OR `iconName` (a serializable name
 * resolved via ICON_BY_NAME — the path server components / config use).
 */
export interface NotificationItem {
  /** Stable id — also the localStorage dismissal key. */
  id: string;
  /** Visual tone. Default "neutral". */
  tone?: NotificationTone;
  /** Optional leading lucide icon (client-caller path; not RSC-serializable). */
  icon?: LucideIcon;
  /** Optional leading lucide icon by name (RSC-safe; resolved via ICON_BY_NAME). */
  iconName?: string;
  /** Already-resolved message text. */
  message: string;
  /** Optional inline action link (resolved label + href). */
  action?: { label: string; href: string };
  /** Whether the bar shows a dismiss × button. Default true. */
  dismissible?: boolean;
}

/** localStorage key holding the JSON array of dismissed notification ids. */
const DISMISSED_STORAGE_KEY = "cr-dismissed-notifications";

/**
 * Tone → theme-token classes. Backgrounds/foregrounds are the soft
 * accent-surface pairs defined in app/globals.css (@theme). NO hardcoded hex.
 * The action link reuses the tone foreground with an underline so it stays
 * readable on the tinted background and clears WCAG AA.
 */
const TONE_CLASSES: Record<NotificationTone, string> = {
  info: "bg-accent-indigo-bg text-accent-indigo-fg",
  warning: "bg-accent-pink-bg text-accent-pink-fg",
  success: "bg-accent-green-bg text-accent-green-fg",
  neutral: "bg-accent-slate-bg text-accent-slate-fg",
};

/** Read the dismissed-id set from localStorage (SSR-safe: caller guards). */
function readDismissed(): string[] {
  try {
    const raw = window.localStorage.getItem(DISMISSED_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

/** Persist the dismissed-id set to localStorage. */
function writeDismissed(ids: string[]): void {
  try {
    window.localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private mode / quota) — dismissal stays in-memory.
  }
}

export interface NotificationBarProps {
  item: NotificationItem;
  /** Resolved aria-label for the dismiss button (i18n'd by the caller). */
  dismissLabel: string;
  /** Invoked when the dismiss × is clicked. */
  onDismiss: (id: string) => void;
}

/** A single full-width notification banner row. */
export function NotificationBar({
  item,
  dismissLabel,
  onDismiss,
}: NotificationBarProps) {
  const tone = item.tone ?? "neutral";
  const dismissible = item.dismissible ?? true;
  const Icon = item.icon ?? (item.iconName ? ICON_BY_NAME[item.iconName] : undefined);

  return (
    <div
      role="status"
      data-testid="notification-bar"
      data-tone={tone}
      className={[
        "flex w-full items-center gap-3 px-4 py-2.5 text-sm",
        TONE_CLASSES[tone],
      ].join(" ")}
    >
      {Icon && (
        <Icon aria-hidden="true" className="size-4 shrink-0" />
      )}
      <p className="min-w-0 flex-1 leading-snug">
        {item.message}
        {item.action && (
          <>
            {" "}
            <Link
              href={item.action.href}
              className="font-medium underline underline-offset-2 transition-opacity duration-200 hover:opacity-80 motion-reduce:transition-none"
            >
              {item.action.label}
            </Link>
          </>
        )}
      </p>
      {dismissible && (
        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          aria-label={dismissLabel}
          data-testid="notification-bar-dismiss"
          className="shrink-0 rounded-sm p-0.5 opacity-70 transition-opacity duration-200 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current motion-reduce:transition-none"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  );
}

export interface NotificationBarStackProps {
  items: NotificationItem[];
  /** Resolved aria-label for the stack region (i18n'd by the caller). */
  regionLabel: string;
  /** Resolved aria-label for each dismiss button (i18n'd by the caller). */
  dismissLabel: string;
  /**
   * Persist dismissals to localStorage so a dismissed bar stays hidden across
   * reloads. Default true. Set false for ephemeral (session-only) dismissal.
   */
  persist?: boolean;
}

/**
 * The stacking container. Renders the non-dismissed items in order, manages
 * dismissed-id state, and (when `persist`) keeps dismissals across reloads.
 * Renders NOTHING when there are no visible items — no wrapper, no layout shift.
 */
export function NotificationBarStack({
  items,
  regionLabel,
  dismissLabel,
  persist = true,
}: NotificationBarStackProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Hydrate persisted dismissals AFTER mount (localStorage is client-only, so
  // this keeps SSR output stable and avoids a hydration mismatch).
  useEffect(() => {
    if (persist) setDismissed(readDismissed());
  }, [persist]);

  function handleDismiss(id: string) {
    setDismissed((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (persist) writeDismissed(next);
      return next;
    });
  }

  const visible = items.filter((item) => !dismissed.includes(item.id));
  if (visible.length === 0) return null;

  return (
    <div
      role="region"
      aria-label={regionLabel}
      data-testid="notification-bar-stack"
      className="flex w-full flex-col divide-y divide-border/60"
    >
      {visible.map((item) => (
        <NotificationBar
          key={item.id}
          item={item}
          dismissLabel={dismissLabel}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
}
