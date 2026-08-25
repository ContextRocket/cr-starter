"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * StatsSection -- a modern stats section with animated counters.
 *
 * Features:
 * - Animated count-up on scroll into view
 * - Responsive grid layout
 * - Clean, minimal design
 */

interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface StatsSectionProps {
  title?: string;
  stats: StatItem[];
  className?: string;
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: string;
  prefix?: string;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          // Parse the number from the value string
          const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
          const isDecimal = value.includes(".");
          const duration = 2000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);

            const current = numericValue * eased;
            setDisplayValue(
              isDecimal ? current.toFixed(1) : Math.floor(current).toString(),
            );

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(value.replace(/[^0-9.]/g, ""));
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export function StatsSection({ title, stats, className }: StatsSectionProps) {
  return (
    <div className={cn("py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {title && (
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          </div>
        )}
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
