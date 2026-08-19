import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const paddingClasses = {
  default: { top: "pt-12 sm:pt-16", bottom: "pb-20 sm:pb-28" },
  tight: { top: "pt-8 sm:pt-12", bottom: "pb-12 sm:pb-16" },
  loose: { top: "pt-20 sm:pt-28", bottom: "pb-28 sm:pb-36" },
  none: { top: "", bottom: "" },
};

export interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  padding?: keyof typeof paddingClasses;
  paddingTop?: string;
  paddingBottom?: string;
  /** Section background override -- uses siteConfig.theme tokens */
  backgroundClass?: string;
}

export function SectionWrapper({
  children,
  className,
  padding = "default",
  paddingTop,
  paddingBottom,
  backgroundClass = "bg-background",
}: SectionWrapperProps) {
  const p = paddingClasses[padding];

  return (
    <section
      className={cn(
        p.top,
        p.bottom,
        paddingTop,
        paddingBottom,
        backgroundClass,
        className,
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
