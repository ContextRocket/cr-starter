"use client";

import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";


interface SuggestionPillsProps {
  suggestions: string[];
  /**
   * Called when the user taps a suggestion chip.
   * The parent (ChatPanel) should call chat.sendMessage with this text.
   */
  onSelect: (suggestion: string) => void;
  /**
   * When true the pills animate in with a staggered entrance.
   * Disabled when prefers-reduced-motion is active.
   */
  animate?: boolean;
}

/**
 * Follow-up suggestion chips rendered below a completed assistant message.
 *
 * Data source: the platform's completed-event metadata (suggestions: string[]).
 * This component renders nothing when suggestions is empty.
 * Never more than one row per the contract.
 *
 * Entrance: staggered fade-in at ~150ms intervals, respecting
 * prefers-reduced-motion via the CSS media query class strategy.
 */
export function SuggestionPills({
  suggestions,
  onSelect,
  animate = true,
}: SuggestionPillsProps) {

  if (!suggestions.length) return null;

  return (
    <div
      className="flex flex-wrap gap-1.5 pt-1"
      aria-label={t("chat.suggestions.label")}
      data-testid="suggestion-pills"
    >
      {suggestions.map((text, i) => (
        <button
          key={`suggestion-${i}`}
          onClick={() => onSelect(text)}
          data-testid={`suggestion-pill-${i + 1}`}
          className={cn(
            "rounded-full border border-border/60 bg-background px-3 py-1",
            "text-xs font-medium text-foreground",
            "transition-all duration-150 hover:border-primary/60 hover:bg-primary/5 hover:text-primary",
            // Staggered entrance animation using Tailwind animate-in.
            // motion:reduce respects prefers-reduced-motion.
            animate && "motion-safe:animate-in motion-safe:fade-in",
          )}
          style={
            animate
              ? {
                  // ~150ms stagger per pill, 0ms base delay.
                  animationDelay: `${i * 150}ms`,
                  animationFillMode: "both",
                }
              : undefined
          }
        >
          {text}
        </button>
      ))}
    </div>
  );
}
