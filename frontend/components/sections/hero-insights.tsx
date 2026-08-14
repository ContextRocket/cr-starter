"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { InsightCard } from "@/components/sections";

/**
 * HeroInsights — a props-driven hero-image overlay engine.
 *
 * ENGINE (reusable, lives here): a hero image that, once loaded, triggers a
 * staggered entrance animation over it — a score badge scales in first, then a
 * cascade of {@link InsightCard}s fade/slide in with increasing per-item delay.
 * The `imageLoaded` state gates every transition so the cascade only plays once
 * the art is painted.
 *
 * CONTENT (fork-provided, NOT baked in): the image path, the alt text, every
 * card's copy/color/icon, and the absolute-position utility classes that pin
 * each card to a spot on the fork's specific artwork. Callers translate their
 * own strings and pass their own icon nodes — this file hardcodes no image
 * path, no copy, and no icon library.
 */

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

export interface HeroInsightsProps {
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

export function HeroInsights({
  imageSrc,
  imageAlt = "",
  imageClassName,
  scoreBadge,
  cards,
  className,
}: HeroInsightsProps) {
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
