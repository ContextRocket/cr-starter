import { CheckIcon } from "@heroicons/react/20/solid";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/shared/ui/motion";

/**
 * PricingSection -- a props-driven, content-agnostic promotion of the
 * cr-landing fork's pricing page (`app/[locale]/pricing/page.tsx`).
 *
 * The fork rendered a fixed two-tier grid whose copy was resolved from the
 * i18n `pricing.*` tree. This reusable version keeps the same visual language
 * (subtitle small-caps, title, description, then a tier-card grid with a
 * featured highlight, price + per-month label, a check-icon feature list, and
 * a rounded-full CTA) but takes ALL user-facing strings as already-resolved
 * props. It hardcodes no English and localizes nothing itself -- the caller
 * (a locale-aware page) resolves copy and passes it in.
 */

export interface PricingTier {
  id: string;
  name: string;
  /** Pre-formatted currency string, e.g. "€29". */
  priceMonthly: string;
  description: string;
  /** Already-localized feature lines. */
  features: string[];
  ctaText: string;
  ctaHref: string;
  featured?: boolean;
}

export interface PricingSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  /** e.g. "/month" -- localized by the caller. */
  perMonthLabel: string;
  tiers: PricingTier[];
  className?: string;
}

// Tailwind cannot consume dynamically-built class strings, so map the tier
// count to an explicit column class (capped at 3).
const gridColsByCount: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
};

export function PricingSection({
  title,
  subtitle,
  description,
  perMonthLabel,
  tiers,
  className = "",
}: PricingSectionProps) {
  const cols = gridColsByCount[Math.min(tiers.length, 3)] ?? "lg:grid-cols-3";

  return (
    <section className={`px-6 py-24 sm:py-32 max-w-6xl mx-auto ${className}`}>
      {(subtitle || description) || title ? (
        <div className="text-center">
          {subtitle && (
            <FadeIn>
              <h2 className="text-base/7 font-semibold text-primary">{subtitle}</h2>
            </FadeIn>
          )}
          <FadeIn delay={0.1}>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-foreground sm:text-5xl">
              {title}
            </h2>
          </FadeIn>
          {description && (
            <FadeIn delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-muted-foreground">
                {description}
              </p>
            </FadeIn>
          )}
        </div>
      ) : null}

      <div className={`mt-16 grid gap-8 ${cols} mx-auto`}>
        {tiers.map((tier, index) => (
          <FadeIn key={tier.id} delay={index * 0.15}>
            <div
              className={`rounded-3xl p-8 sm:p-10 ${
                tier.featured
                  ? "bg-primary text-primary-foreground shadow-2xl"
                  : "border border-border bg-card"
              }`}
            >
              <h3
                className={`text-base font-semibold ${
                  tier.featured ? "text-primary-foreground" : "text-primary"
                }`}
              >
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span
                  className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${
                    tier.featured
                      ? "text-primary-foreground"
                      : "text-gray-900 dark:text-foreground"
                  }`}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={`text-sm ${
                    tier.featured
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {perMonthLabel}
                </span>
              </p>
              <p
                className={`mt-6 text-sm leading-6 ${
                  tier.featured
                    ? "text-primary-foreground/90"
                    : "text-muted-foreground"
                }`}
              >
                {tier.description}
              </p>
              <ul
                className={`mt-8 space-y-3 text-sm ${
                  tier.featured
                    ? "text-primary-foreground/90"
                    : "text-muted-foreground"
                }`}
              >
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex gap-x-3">
                    <CheckIcon
                      className={`h-5 w-5 flex-none ${
                        tier.featured ? "text-primary-foreground" : "text-primary"
                      }`}
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.ctaHref}
                className={`mt-10 block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition-all ${
                  tier.featured
                    ? "bg-white text-primary hover:bg-gray-50 shadow-sm"
                    : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {tier.ctaText}
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
