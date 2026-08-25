import type { ReactNode } from "react";

export interface FeatureItem {
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface FeatureGridProps {
  label?: string;
  title: string;
  subtitle?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnClasses: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid({
  label,
  title,
  subtitle,
  items,
  columns = 3,
  className = "",
}: FeatureGridProps) {
  return (
    <section className={`px-6 py-24 sm:py-32 max-w-6xl mx-auto ${className}`}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary text-center">
          {label}
        </p>
      )}
      <h2 className="mt-4 text-3xl font-bold text-center sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground text-center">
          {subtitle}
        </p>
      )}
      <div className={`mt-16 grid gap-6 ${columnClasses[columns]}`}>
        {items.map((item) => (
          <div
            key={item.title}
            className="group rounded-xl border border-card-border bg-card p-6 transition-all hover:border-primary/20 hover:bg-card/80"
          >
            {item.icon && (
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10">
                {item.icon}
              </div>
            )}
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
