"use client";

import { cn } from "@/lib/utils";

/**
 * ValuePropCard -- an animated card for displaying value propositions.
 *
 * Features:
 * - Hover lift effect
 * - Gradient border on hover
 * - Icon support
 * - Responsive design
 */

interface ValuePropCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function ValuePropCard({
  icon,
  title,
  description,
  className,
}: ValuePropCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg hover:border-primary/20",
        className
      )}
    >
      {/* Gradient accent on hover */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/**
 * ValuePropGrid -- a responsive grid of value proposition cards.
 */

interface ValueProp {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ValuePropGridProps {
  items: ValueProp[];
  className?: string;
}

export function ValuePropGrid({ items, className }: ValuePropGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item, index) => (
        <ValuePropCard
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          className="animate-in fade-in slide-in-from-bottom-4"
        />
      ))}
    </div>
  );
}
