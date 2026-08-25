import Link from "next/link";

export interface CtaSectionProps {
  title: string;
  description: string;
  action: { label: string; href: string };
  variant?: "primary" | "outline";
  className?: string;
}

export function CtaSection({
  title,
  description,
  action,
  variant = "primary",
  className = "",
}: CtaSectionProps) {
  return (
    <section
      className={`border-t border-border py-24 sm:py-32 px-6 max-w-2xl mx-auto text-center ${className}`}
    >
      <h2 className="text-3xl font-bold sm:text-5xl leading-tight">{title}</h2>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        {description}
      </p>
      <Link
        href={action.href}
        className={
          variant === "primary"
            ? "mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground transition-all hover:shadow-xl hover:-translate-y-0.5"
            : "mt-10 inline-flex items-center gap-2 rounded-full border border-primary px-10 py-4 text-lg font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        }
      >
        {action.label}
      </Link>
    </section>
  );
}
