import Link from "next/link";

export interface HeroAction {
  label: string;
  href: string;
  variant?: "primary" | "outline";
}

export interface HeroProps {
  title: string | React.ReactNode;
  description: string;
  actions?: HeroAction[];
  className?: string;
  children?: React.ReactNode;
}

const actionStyles = {
  // High-intent CTA ("Get started") uses the brand-accent token (pink) so a
  // fork gets a branded primary button for free; secondary stays ghost/outline.
  primary:
    "inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  outline:
    "inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-base font-semibold transition-all hover:border-primary/30 hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
};

export function HeroSection({
  title,
  description,
  actions,
  className = "",
  children,
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden px-6 pt-24 pb-32 sm:pt-32 sm:pb-40 max-w-4xl mx-auto text-center ${className}`}
    >
      <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      <p className="mt-8 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
      {actions && actions.length > 0 && (
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={actionStyles[action.variant ?? "primary"]}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
      {children}
    </section>
  );
}
