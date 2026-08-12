"use client";

import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";
import type { PolicyClass } from "@/hooks/use-a2a-stream";

interface PolicyClassCardProps {
  policyClass: PolicyClass;
  /**
   * When true the card animates in after a brief delay (completes after text).
   * Respects prefers-reduced-motion.
   */
  animate?: boolean;
}

/**
 * Policy-class guidance card rendered below the assistant message bubble.
 *
 * Data source: the platform's completed-event metadata (policy_class object).
 * This component renders nothing when policyClass is absent -- the parent
 * controls whether to mount it.
 *
 * Severity tokens:
 *   danger    -> red/destructive border + background
 *   attention -> amber/warning border + background
 *   neutral   -> border + muted background (default)
 *
 * Content key: brand-authored copy key (content_key). In the starter this is
 * displayed as the key itself since there is no brand-authored content registry.
 * Forks replace this with a lookup into their own content registry.
 */
export function PolicyClassCard({
  policyClass,
  animate = true,
}: PolicyClassCardProps) {
  const severityClass =
    {
      danger: cn(
        "border-destructive/40 bg-destructive/8",
        "[--policy-icon-color:theme(colors.destructive)]",
      ),
      attention: cn(
        "border-amber-400/40 bg-amber-50/60 dark:bg-amber-900/10",
        "[--policy-icon-color:theme(colors.amber.600)]",
      ),
      neutral: cn(
        "border-border/60 bg-muted/40",
        "[--policy-icon-color:theme(colors.muted.foreground)]",
      ),
    }[policyClass.class] ?? cn("border-border/60 bg-muted/40");

  const indicatorClass =
    {
      danger: "bg-destructive",
      attention: "bg-amber-500",
      neutral: "bg-muted-foreground",
    }[policyClass.class] ?? "bg-muted-foreground";

  return (
    <div
      data-testid="policy-class-card"
      data-policy-class={policyClass.class}
      data-policy-tier={policyClass.tier}
      className={cn(
        "mt-1 rounded-xl border px-3 py-2.5",
        severityClass,
        // Staggered entrance after text completes.
        animate &&
          "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1",
      )}
      style={
        animate
          ? { animationDelay: "300ms", animationFillMode: "both" }
          : undefined
      }
      role="note"
    >
      <div className="flex items-start gap-2">
        {/* Severity indicator dot */}
        <span
          aria-hidden="true"
          className={cn("mt-1 size-2 shrink-0 rounded-full", indicatorClass)}
        />

        <div className="flex-1 min-w-0">
          {/* Content key: displayed as-is in the starter. Forks replace with
              a brand-authored content registry lookup. */}
          <p className="text-xs font-medium text-foreground leading-snug">
            {policyClass.content_key}
          </p>

          {/* Optional cited source */}
          {policyClass.cited_source && (
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium">
                {t("chat.policy.card.source")}:{" "}
              </span>
              {policyClass.cited_source}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
