"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { InsightCard } from "./insight-card";
import { ScrollReveal } from "./scroll-reveal";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";

/**
 * HeroInsights — a reusable insight-panel with two layouts.
 *
 * layout="grid" (DEFAULT, config-driven): a headline/subhead over a responsive
 * grid of {@link InsightCard}s, each revealed on scroll via <ScrollReveal/>
 * (the project's AOS engine). NO hero image required, so a fork renders it
 * straight from `company.config.heroInsights` with only text content — every
 * card is `{ label, value, description }` and the panel is fully token-styled
 * (works light + dark). This is the panel the starter home ships.
 *
 * layout="overlay" (image-driven): a hero image that, once loaded, triggers a
 * staggered entrance — a score badge scales in first, then a cascade of cards
 * fade/slide in over the art. This mode needs the fork to supply an image and
 * per-card absolute-position classes tuned to that art; use it only when a fork
 * has a bespoke hero illustration.
 *
 * CONTENT is always fork-provided (copy/value/description, and — for overlay —
 * the image path and position classes). This file hardcodes no copy, no image
 * path, and no icon library.
 */

/** A single insight card for the config-driven grid layout. */
export interface HeroInsightItem {
  /** Small uppercase eyebrow above the value (e.g. "Answer readiness"). */
  label: string;
  /** The headline metric/value (e.g. "92%"). */
  value: string;
  /** One supporting sentence. */
  description?: string;
  /** Card accent color for the icon box. Default "primary". */
  color?: "primary" | "blue" | "yellow" | "green" | "neutral";
  /** Optional icon node rendered in the accent box. */
  icon?: ReactNode;
}

/** A single insight card for the image-overlay layout. */
export interface HeroInsightCard {
  /** Card accent color — must be one of InsightCard's supported colors. */
  color?: "blue" | "yellow" | "green";
  icon: ReactNode;
  title: string;
  description: string;
  /** Absolute-position + width utility classes for THIS card (fork tunes to its art). */
  positionClassName: string;
  /** Transition delay for the staggered entrance, e.g. "1000ms". */
  delay: string;
}

/** Config shape a fork places under `company.heroInsights`. */
export interface HeroInsightsContent {
  headline: string;
  subhead?: string;
  items: HeroInsightItem[];
}

export interface HeroInsightsGridProps {
  layout?: "grid";
  headline: string;
  subhead?: string;
  items: HeroInsightItem[];
  className?: string;
}

export interface HeroInsightsOverlayProps {
  layout: "overlay";
  imageSrc: string;
  /** Decorative by default. */
  imageAlt?: string;
  /** Fork tunes the aspect/size wrapper if needed. */
  imageClassName?: string;
  scoreBadge?: {
    title: string;
    value: string;
    positionClassName: string;
    delay?: string;
  };
  cards: HeroInsightCard[];
  className?: string;
}

export type HeroInsightsProps = HeroInsightsGridProps | HeroInsightsOverlayProps;

export function HeroInsights(props: HeroInsightsProps) {
  if (props.layout === "overlay") {
    return <HeroInsightsOverlay {...props} />;
  }
  return <HeroInsightsGrid {...props} />;
}

/**
 * Config-driven grid panel. Renders a headline + subhead over a responsive card
 * grid, each card revealed on scroll. Pure text content, fully token-styled.
 */
function HeroInsightsGrid({
  headline,
  subhead,
  items,
  className,
}: HeroInsightsGridProps) {
  return (
    <SectionWrapper className={className}>
      <ScrollReveal>
        <SectionHeader title={headline} subtitle={subhead} />
      </ScrollReveal>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <ScrollReveal key={item.label} animation="fade-up" delay={Math.min(i, 4) * 75}>
            <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div
                    className={
                      "flex size-9 shrink-0 items-center justify-center rounded-lg " +
                      accentBox(item.color)
                    }
                  >
                    {item.icon}
                  </div>
                )}
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
              </div>
              <p className="mt-3 text-3xl font-extrabold leading-none tracking-tight">
                {item.value}
              </p>
              {item.description && (
                <p className="mt-2 text-sm leading-snug text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}

/** Icon-box accent background per color, resolved to theme tokens where one exists. */
function accentBox(color: HeroInsightItem["color"] = "primary"): string {
  switch (color) {
    case "blue":
      return "bg-blue-500 text-white";
    case "yellow":
      return "bg-amber-400 text-white";
    case "green":
      return "bg-emerald-500 text-white";
    case "neutral":
      return "bg-muted text-foreground";
    case "primary":
    default:
      return "bg-primary text-primary-foreground";
  }
}

/**
 * Image-overlay engine (opt-in). A hero image that, once loaded, plays a
 * staggered entrance over it — score badge first, then the card cascade.
 */
function HeroInsightsOverlay({
  imageSrc,
  imageAlt = "",
  imageClassName,
  scoreBadge,
  cards,
  className,
}: HeroInsightsOverlayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={className}>
      <div className={imageClassName ?? "relative w-full"}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-contain rounded-xl"
          onLoad={() => setImageLoaded(true)}
          sizes="(min-width: 1024px) 460px, 90vw"
        />

        {/* Score badge — scales in first. Two-line badge (label over value);
            InsightCard falls back to a Sparkles glyph when no icon is given. */}
        {scoreBadge && (
          <InsightCard
            variant="badge"
            title={scoreBadge.title}
            description={scoreBadge.value}
            className={`absolute ${scoreBadge.positionClassName}`}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transform: imageLoaded ? "scale(1)" : "scale(0.8)",
              transition: "all 0.5s ease-out",
              transitionDelay: scoreBadge.delay ?? "800ms",
            }}
            data-testid="score-badge"
          />
        )}

        {/* Insight cards — staggered cascade */}
        {cards.map((card, i) => (
          <InsightCard
            key={i}
            color={card.color}
            icon={card.icon}
            title={card.title}
            description={card.description}
            className={`absolute ${card.positionClassName}`}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transform: imageLoaded ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.6s ease-out",
              transitionDelay: card.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
