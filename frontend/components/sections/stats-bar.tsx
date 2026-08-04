export interface StatItem {
  value: string;
  label: string;
}

export interface StatsBarProps {
  items: StatItem[];
  className?: string;
}

export function StatsBar({ items, className = "" }: StatsBarProps) {
  return (
    <section className={`border-y border-border bg-muted/50 py-10 ${className}`}>
      <div
        className="max-w-5xl mx-auto px-6 grid gap-8"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-2xl font-extrabold text-primary sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
