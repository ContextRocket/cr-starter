/**
 * TestimonialsSection — a generalized, i18n-agnostic testimonials grid.
 *
 * This component takes ALREADY-RESOLVED strings (chrome heading/eyebrow/aria
 * from the caller's t(), testimonial content pre-resolved per locale by
 * lib/testimonials.ts). It renders a responsive grid of testimonial cards with
 * avatar/initials, author, company, role, quote, and an optional star rating.
 *
 * It is fully generic: no product- or brand-specific copy, no i18n imports, no
 * data source. It is the promoted successor to the older prop-only
 * TestimonialGrid, adding the high-fidelity kit's AOS scroll-reveal + hover
 * micro-interaction, star ratings, avatar initials fallback, and a11y.
 *
 * Styling uses siteConfig.theme tokens (bg-card, border-border, text-primary,
 * text-muted-foreground, …) so it works in both light and dark mode with no
 * per-theme branching.
 */

import Image from "next/image";
import { ScrollReveal } from "./scroll-reveal";
import { SectionHeader } from "./section-header";
import type { Testimonial } from "@/lib/testimonials";

export interface TestimonialsSectionProps {
  /** Small eyebrow label above the heading (chrome, already localized). */
  eyebrow?: string;
  /** Section heading (chrome, already localized). */
  title: string;
  /** Optional subtitle under the heading (chrome, already localized). */
  subtitle?: string;
  /** Resolved testimonials for the current locale. */
  items: Testimonial[];
  /**
   * Accessible label for the star-rating group, already localized. Receives a
   * single `{rating}` placeholder-free form; callers pass a plain string like
   * "Rated 5 out of 5" — the component appends nothing further.
   */
  ratingLabel?: (rating: number) => string;
  /** Accessible label for the whole region (already localized). */
  regionLabel?: string;
  className?: string;
}

/** Derive up-to-two-letter initials from an author name for the avatar fallback. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Render a 5-slot star row with `rating` filled. Decorative; label is on the group. */
function StarRating({
  rating,
  label,
}: {
  rating: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={label ?? `${clamped}/5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${
            i < clamped ? "text-primary" : "text-muted-foreground/25"
          }`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79L1.58 7.62l5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  item,
  ratingLabel,
}: {
  item: Testimonial;
  ratingLabel?: (rating: number) => string;
}) {
  const affiliation = [item.role, item.company].filter(Boolean).join(", ");
  return (
    <blockquote className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus-within:border-primary/30 sm:p-8">
      {typeof item.rating === "number" && (
        <div className="mb-4">
          <StarRating
            rating={item.rating}
            label={ratingLabel ? ratingLabel(item.rating) : undefined}
          />
        </div>
      )}
      <p className="flex-1 text-sm italic leading-7 text-muted-foreground">
        &ldquo;{item.quote}&rdquo;
      </p>
      <footer className="mt-6 flex items-center gap-3 border-t border-border pt-4">
        {item.avatar ? (
          <Image
            src={item.avatar}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 flex-none rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
          >
            {initials(item.author)}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-foreground">
            {item.author}
          </span>
          {affiliation && (
            <span className="block truncate text-xs text-muted-foreground/70">
              {affiliation}
            </span>
          )}
        </span>
      </footer>
    </blockquote>
  );
}

export function TestimonialsSection({
  eyebrow,
  title,
  subtitle,
  items,
  ratingLabel,
  regionLabel,
  className = "",
}: TestimonialsSectionProps) {
  // Defensive: callers gate on non-empty already, but never render an empty
  // section (no heading floating over nothing, no layout shift).
  if (items.length === 0) return null;

  return (
    <section
      aria-label={regionLabel ?? title}
      className={`mx-auto max-w-6xl px-6 py-24 sm:py-32 ${className}`}
    >
      <ScrollReveal>
        <SectionHeader title={title} subtitle={subtitle} />
        {eyebrow && (
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
      </ScrollReveal>
      <ul className="mt-14 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.id}>
            <ScrollReveal animation="fade-up" delay={Math.min(i, 4) * 75}>
              <TestimonialCard item={item} ratingLabel={ratingLabel} />
            </ScrollReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
