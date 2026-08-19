"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { InsightCard } from "./insight-card";
import { SectionWrapper } from "./section-wrapper";
import { SectionHeader } from "./section-header";

/**
 * HeroInsights -- a reusable insight-panel with two layouts.
 *
 * layout="overlay" (image-driven -- the hero the starter home ships): a hero
 * image that, once loaded, triggers a staggered entrance -- a score badge scales
 * in first, then a cascade of cards fade/slide in over the art. This is the
 * classic HeroInsights look. It needs the fork to supply an image and per-card
 * absolute-position classes tuned to that art. `prefers-reduced-motion` skips
 * the entrance so the badge and cards are visible immediately.
 *
 * layout="grid" (config-driven, opt-in): a headline/subhead over a responsive
 * grid of metric cards. The panel sits ABOVE THE FOLD, so its cards animate in
 * ON MOUNT (staggered fade/rise right after hydration) rather than on scroll --
 * an on-scroll (AOS) reveal would leave above-the-fold content at opacity:0
 * until the user scrolls. `prefers-reduced-motion` renders it fully visible
 * immediately. NO hero image required, so a fork renders it straight from
 * fork-provided content (i18n `home.hero.insights.*` keys or props) with only
 * text content -- every card is
 * `{ label, value, description }` and the panel is fully token-styled (works
 * light + dark). A valid reusable alternative when a fork has no hero art.
 *
 * CONTENT is always fork-provided (copy/value/description, and -- for overlay --
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
  /** Card accent color -- must be one of InsightCard's supported colors. */
  color?: "blue" | "yellow" | "green";
  icon: ReactNode;
  title: string;
  description: string;
  /** Absolute-position + width utility classes for THIS card (fork tunes to its art). */
  positionClassName: string;
  /** Transition delay for the staggered entrance, e.g. "1000ms". */
  delay: string;
}

/** Content shape a fork supplies (i18n `home.hero.insights.*` keys or props). */
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
 * grid. This panel sits ABOVE THE FOLD, so it must NOT depend on a scroll event
 * to become visible (an AOS `data-aos` reveal keeps it at opacity:0 until the
 * viewport scrolls). Instead it animates in ON MOUNT: cards start faded/offset
 * and settle to their final state right after hydration, with a small per-card
 * stagger. `prefers-reduced-motion` short-circuits the entrance so the panel
 * renders in its final (visible) state immediately.
 */
function HeroInsightsGrid({
  headline,
  subhead,
  items,
  className,
}: HeroInsightsGridProps) {
  // Start hidden only when motion is allowed; flip to shown on mount so the
  // entrance plays without a scroll. SSR / reduced-motion render fully visible.
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // matchMedia is absent in some non-browser test envs (jsdom); guard it so
    // the entrance degrades to "render visible" rather than throwing.
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(prefersReduced);
    // Next frame so the initial (hidden) styles commit before the transition.
    const id =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(() => setMounted(true))
        : (setMounted(true), 0);
    return () => {
      if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(id);
    };
  }, []);

  const revealed = mounted || reduceMotion;

  return (
    <SectionWrapper className={className}>
      <SectionHeader title={headline} subtitle={subhead} />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={
              "h-full rounded-xl border border-card-border bg-card p-6 shadow-sm transition-all duration-500 ease-out motion-reduce:transition-none " +
              (revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")
            }
            style={
              reduceMotion
                ? undefined
                : { transitionDelay: `${Math.min(i, 4) * 75}ms` }
            }
          >
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
 * staggered entrance over it -- score badge first, then the card cascade.
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
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion: skip the entrance entirely so the badge
    // and cards are visible immediately (no fade/scale/slide). matchMedia is
    // absent in some non-browser test envs (jsdom) -- guard it.
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(prefersReduced);
  }, []);

  // The cascade is gated on the hero image having loaded; reduced-motion short-
  // circuits it to "revealed" so the overlay never sits invisible for a user
  // who has opted out of motion (or if onLoad never fires in that env).
  const revealed = imageLoaded || reduceMotion;

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

        {/* Score badge -- scales in first. Two-line badge (label over value);
            InsightCard falls back to a Sparkles glyph when no icon is given. */}
        {scoreBadge && (
          <InsightCard
            variant="badge"
            title={scoreBadge.title}
            description={scoreBadge.value}
            className={`absolute ${scoreBadge.positionClassName} motion-reduce:!transition-none`}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "scale(1)" : "scale(0.8)",
              transition: reduceMotion ? "none" : "all 0.5s ease-out",
              transitionDelay: reduceMotion ? "0ms" : (scoreBadge.delay ?? "800ms"),
            }}
            data-testid="score-badge"
          />
        )}

        {/* Insight cards -- staggered cascade */}
        {cards.map((card, i) => (
          <InsightCard
            key={i}
            color={card.color}
            icon={card.icon}
            title={card.title}
            description={card.description}
            className={`absolute ${card.positionClassName} motion-reduce:!transition-none`}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateX(0)" : "translateX(-20px)",
              transition: reduceMotion ? "none" : "all 0.6s ease-out",
              transitionDelay: reduceMotion ? "0ms" : card.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
