"use client";

import { cn } from "@/lib/utils";

/**
 * BentoGrid -- a modern bento-box layout for showcasing features.
 *
 * Inspired by Tailwind Plus marketing blocks. Uses CSS grid with
 * spanning for visual hierarchy.
 */

interface BentoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  span?: "col-2" | "row-2" | "full";
}

export function BentoCard({
  title,
  description,
  icon,
  className,
  span,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300",
        "hover:border-primary/20 hover:shadow-lg",
        span === "col-2" && "md:col-span-2",
        span === "row-2" && "md:row-span-2",
        span === "full" && "md:col-span-full",
        className
      )}
    >
      {/* Gradient accent on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
