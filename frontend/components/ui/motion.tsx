"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Animation wrappers — standardized on AOS (Animate On Scroll).
 *
 * FadeIn / SlideIn render `data-aos` attributes; AOS (initialized by
 * <AosProvider/>) animates them as they scroll into view. The `delay` prop is
 * kept in SECONDS for API compatibility and converted to AOS milliseconds.
 * ScaleOnHover is a hover effect (not a scroll animation), so it stays a pure
 * CSS transition.
 */
export interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Entrance delay in seconds (converted to AOS ms). */
  delay?: number;
}

function toMs(seconds: number): number {
  return Math.round(seconds * 1000);
}

export function FadeIn({ children, className, delay = 0, ...props }: MotionProps) {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={toMs(delay)}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function SlideIn({ children, className, delay = 0, ...props }: MotionProps) {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={toMs(delay)}
      data-aos-duration="250"
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function ScaleOnHover({
  children,
  className,
  ...props
}: Omit<MotionProps, "delay">) {
  return (
    <div
      className={cn(
        "transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
