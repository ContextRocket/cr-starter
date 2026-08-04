import type { ReactNode } from "react";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({ title, subtitle, align = "center", className = "" }: SectionHeaderProps) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight text-[#2f327d] dark:text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-base text-gray-500 dark:text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
