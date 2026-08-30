"use client";

/**
 * Badge Widget -- ContextRocket brand attribution badge.
 *
 * This is a shared component that provides the one ContextRocket attribution
 * treatment across all forks. The badge deliberately keeps its brand label
 * stable in every locale: `Powered by ContextRocket`.
 *
 * Usage:
 *   <ContextRocketBadge />
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ContextRocketBadgeProps {
  /** Additional class names */
  className?: string;
}

export function ContextRocketBadge({
  className,
}: ContextRocketBadgeProps) {
  return (
    <a
      href="https://www.contextrocket.ai"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "powered-by-badge inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group",
        className,
      )}
      data-testid="powered-by-badge"
    >
      {/* The attribution icon is intentionally separate from the label. */}
      <Image
        src="/brand/cr-icon-red.svg"
        alt=""
        width={14}
        height={14}
        aria-hidden="true"
        className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100 dark:hidden"
      />
      <Image
        src="/brand/cr-icon-white.svg"
        alt=""
        width={14}
        height={14}
        aria-hidden="true"
        className="hidden h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100 dark:block"
      />
      <span className="font-semibold">Powered by ContextRocket</span>
    </a>
  );
}
