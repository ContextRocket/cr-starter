import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardColor = "primary" | "blue" | "yellow" | "green" | "neutral";

const colorMap: Record<CardColor, { bg: string; iconBg: string }> = {
  primary: { bg: "bg-primary", iconBg: "bg-primary/15" },
  blue: { bg: "bg-blue-500", iconBg: "bg-blue-500/15" },
  yellow: { bg: "bg-amber-400", iconBg: "bg-amber-400/15" },
  green: { bg: "bg-emerald-500", iconBg: "bg-emerald-500/15" },
  neutral: { bg: "bg-muted", iconBg: "bg-muted" },
};

export interface InsightCardProps {
  variant?: "default" | "badge";
  color?: CardColor;
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Floating insight card — used in hero section overlays.
 * Two variants:
 *   badge  — pill-shaped, colored background, compact
 *   default — white rounded card with colored icon box
 */
export function InsightCard({
  variant = "default",
  color = "primary",
  icon,
  title,
  description,
  className,
  style,
}: InsightCardProps) {
  const colors = colorMap[color];

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg",
          colors.bg,
          className,
        )}
        style={style}
      >
        {icon}
        <span>{title}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-card border border-border p-4 shadow-lg max-w-[240px]",
        className,
      )}
      style={style}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            colors.iconBg,
          )}
        >
          <span className={cn("size-5", colors.bg !== "bg-muted" ? colors.bg : "text-foreground")}>
            {icon}
          </span>
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
