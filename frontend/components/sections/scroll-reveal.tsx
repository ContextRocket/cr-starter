"use client";

import type { ReactNode } from "react";

/**
 * ScrollReveal — reveals its children as they scroll into view, using AOS
 * (the project's standard scroll-animation engine, initialized by
 * <AosProvider/>). This is a thin wrapper that renders the appropriate
 * `data-aos` attributes; the animation names map 1:1 to AOS.
 */
type Animation = "fade-up" | "fade-down" | "fade-right" | "fade-left" | "fade-in";

export interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  /** Delay before the animation starts (ms). */
  delay?: number;
  /** Animation duration (ms). */
  duration?: number;
  className?: string;
  /** Only animate once (default true). */
  once?: boolean;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className,
  once = true,
}: ScrollRevealProps) {
  return (
    <div
      className={className}
      data-aos={animation}
      data-aos-delay={delay}
      data-aos-duration={duration}
      data-aos-once={once}
    >
      {children}
    </div>
  );
}
