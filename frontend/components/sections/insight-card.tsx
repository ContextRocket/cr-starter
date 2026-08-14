import type { HTMLAttributes, ReactNode } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

type CardColor = "primary" | "blue" | "yellow" | "green" | "neutral";

/**
 * Solid accent background per color. The default card renders its icon inside
 * a SOLID colored box (matching the reference hero overlay); the badge uses the
 * same accent as its pill background. Colors resolve to theme tokens where one
 * exists (primary/neutral) and to a fixed accent otherwise.
 */
const colorMap: Record<CardColor, string> = {
  primary: "bg-primary",
  blue: "bg-blue-500",
  yellow: "bg-amber-400",
  green: "bg-emerald-500",
  neutral: "bg-muted",
};

export interface InsightCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "badge";
  color?: CardColor;
  /** Icon node. Optional: the badge falls back to a Sparkles glyph. */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Standalone alignment helper (mx-auto / ml-auto) for non-overlay use. */
  align?: "left" | "center" | "right";
  className?: string;
}

/**
 * Floating insight card — used in hero-overlay compositions (see HeroInsights).
 * Two variants:
 *   badge   — pill with a small uppercase title over a bold value
 *             (e.g. "LLM Score" / "72%"); defaults to a Sparkles icon.
 *   default — card with a solid colored icon box, title + optional description.
 *
 * Content-agnostic: all copy/colors/icons arrive as props and every surface is
 * themed via design tokens (bg-primary, bg-card, text-muted-foreground, …), so
 * a fork restyles it entirely through siteConfig.theme. Extra DOM attributes
 * (data-testid, aria-*, style, …) pass through to the root element.
 */
export function InsightCard({
  variant = "default",
  color = "primary",
  icon,
  title,
  description,
  align = "left",
  className,
  ...props
}: InsightCardProps) {
  const alignClass =
    align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : undefined;

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-2 text-primary-foreground shadow-lg",
          colorMap[color],
          alignClass,
          className,
        )}
        suppressHydrationWarning
        {...props}
      >
        {icon ?? <SparklesIcon className="size-4" />}
        <div className="text-left leading-snug">
          <div className="text-[10px] font-semibold uppercase tracking-wide">
            {title}
          </div>
          {description && (
            <div className="text-base font-extrabold leading-tight">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-lg max-w-[280px]",
        alignClass,
        className,
      )}
      suppressHydrationWarning
      {...props}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            colorMap[color],
          )}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground leading-tight">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
