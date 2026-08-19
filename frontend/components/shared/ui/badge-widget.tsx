"use client";

/**
 * Badge Widget -- ContextRocket brand attribution badge.
 *
 * This is a shared component that provides consistent ContextRocket
 * branding across all forks. The badge is localized and works in
 * both light and dark mode.
 *
 * Usage:
 *   <ContextRocketBadge />
 *   <ContextRocketBadge variant="minimal" />
 */

import Image from "next/image";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";


interface ContextRocketBadgeProps {
  /** Badge variant */
  variant?: "default" | "minimal" | "icon-only";
  /** Additional class names */
  className?: string;
}

export function ContextRocketBadge({
  variant = "default",
  className,
}: ContextRocketBadgeProps) {

  const baseClasses = "inline-flex items-center gap-1.5 transition-colors";
  const variantClasses = {
    // Full-opacity muted-foreground (43% gray) clears WCAG AA 4.5:1 on the
    // footer surface; the reduced-opacity variants were too faint to pass.
    default: "text-xs text-muted-foreground",
    minimal: "text-[10px] text-muted-foreground",
    "icon-only": "text-muted-foreground",
  };

  return (
    <a
      href="https://contextrocket.ai"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseClasses, variantClasses[variant], "group", className)}
    >
      {variant !== "icon-only" && (
        <span className="text-[10px] tracking-wide uppercase font-semibold">
          {t("footer.powered_by")}
        </span>
      )}
      {/* Light mode logo */}
      <Image
        src="/brand/cr-logo-horizontal.svg"
        alt="ContextRocket"
        width={96}
        height={16}
        className={cn(
          "h-3 w-auto opacity-70 transition-opacity group-hover:opacity-100",
          variant === "icon-only" && "h-4 w-4",
          "dark:hidden"
        )}
      />
      {/* Dark mode logo */}
      <Image
        src="/brand/cr-logo-horizontal-white.png"
        alt="ContextRocket"
        width={96}
        height={16}
        className={cn(
          "h-3 w-auto opacity-70 transition-opacity group-hover:opacity-100",
          variant === "icon-only" && "h-4 w-4",
          "hidden dark:block"
        )}
      />
    </a>
  );
}

/**
 * @deprecated Use ContextRocketBadge instead.
 * This is kept for backward compatibility only.
 */
export function BadgeWidget(props: ContextRocketBadgeProps) {
  return <ContextRocketBadge {...props} />;
}
