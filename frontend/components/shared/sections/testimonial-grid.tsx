export interface TestimonialItem {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface TestimonialGridProps {
  label?: string;
  title: string;
  items: TestimonialItem[];
  className?: string;
}

export function TestimonialGrid({
  label,
  title,
  items,
  className = "",
}: TestimonialGridProps) {
  return (
    <section className={`px-6 py-24 sm:py-32 max-w-6xl mx-auto ${className}`}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary text-center">
          {label}
        </p>
      )}
      <h2 className="mt-4 text-3xl font-bold text-center sm:text-4xl">{title}</h2>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <blockquote
            key={item.name}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-primary/20"
          >
            <p className="text-sm leading-7 text-muted-foreground italic">
              &ldquo;{item.quote}&rdquo;
            </p>
            <footer className="mt-6 pt-4 border-t border-border">
              <p className="text-sm font-bold">{item.name}</p>
              {item.role && (
                <p className="text-xs text-muted-foreground/60">{item.role}</p>
              )}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
