"use client";

import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";

const SESSION_KEY = "cr_nudge_dismissed";

interface ConversionNudgeProps {
  /**
   * Whether the current user is a guest (unauthenticated).
   * The nudge renders only when true.
   */
  isGuest: boolean;
  /**
   * Called when the user clicks the CTA action button.
   * Typically routes to /register or opens the auth flow.
   */
  onAction: () => void;
}

/**
 * Dismissible inline nudge prompting guest users to create an account.
 *
 * Rules from the contract:
 *   - Shown only to unauthenticated/guest users.
 *   - One nudge per session maximum (sessionStorage flag).
 *   - Dismissal is persisted in sessionStorage for the session.
 *   - Copy states a concrete benefit, not a generic signup plea.
 *
 * The parent (ChatPanel) controls WHEN to mount this component (i.e. it
 * mounts only after turnThreshold substantive turns). This component handles
 * the session-storage one-per-session gate and the dismiss animation.
 */
export function ConversionNudge({ isGuest, onAction }: ConversionNudgeProps) {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isGuest) return;
    // Check session storage: if already dismissed in this session, stay hidden.
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setDismissed(true);
        return;
      }
    } catch {
      // sessionStorage unavailable (private mode, iframe restriction, etc.)
      // Fall through and show the nudge anyway.
    }
    // Small delay so the nudge appears after the message settles.
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, [isGuest]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Ignore storage errors.
    }
  };

  const handleAction = () => {
    handleDismiss();
    onAction();
  };

  if (!isGuest || dismissed) return null;

  return (
    <div
      data-testid="conversion-nudge"
      className={cn(
        "mx-auto w-full max-w-4xl px-2 md:px-4",
        "transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none",
      )}
      role="complementary"
      aria-label={t("chat.nudge.title")}
    >
      <div
        className={cn(
          "relative rounded-xl border border-primary/20 bg-primary/5 px-4 py-3",
          "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2",
        )}
        style={{ animationFillMode: "both" }}
      >
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          aria-label={t("chat.nudge.dismiss")}
          data-testid="conversion-nudge-dismiss"
          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <XIcon className="size-3.5" aria-hidden />
        </button>

        <p className="pr-6 text-sm font-medium text-foreground">
          {t("chat.nudge.title")}
        </p>
        <p className="mt-0.5 pr-6 text-xs text-muted-foreground">
          {t("chat.nudge.body")}
        </p>

        <button
          onClick={handleAction}
          data-testid="conversion-nudge-action"
          className={cn(
            "mt-2.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground",
            "transition-opacity hover:opacity-90",
          )}
        >
          {t("chat.nudge.action")}
        </button>
      </div>
    </div>
  );
}
