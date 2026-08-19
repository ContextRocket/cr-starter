"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * FeatureShowcase -- a modern feature section with large screenshot.
 *
 * Inspired by Tailwind Plus "With product screenshot" pattern.
 * Image on one side, feature list on the other.
 */

interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeatureShowcaseProps {
  title: string;
  subtitle?: string;
  description: string;
  features: FeatureItem[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  className?: string;
}

export function FeatureShowcase({
  title,
  subtitle,
  description,
  features,
  imageSrc,
  imageAlt,
  imagePosition = "right",
  className,
}: FeatureShowcaseProps) {
  return (
    <div className={cn("py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2",
            imagePosition === "left" && "lg:grid-flow-dense"
          )}
        >
          {/* Content */}
          <div
            className={cn(
              "lg:pt-4",
              imagePosition === "left" && "lg:col-start-2"
            )}
          >
            {subtitle && (
              <p className="text-sm font-semibold leading-7 text-primary">
                {subtitle}
              </p>
            )}
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {description}
            </p>

            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-muted-foreground lg:max-w-none">
              {features.map((feature, index) => (
                <div key={index} className="relative pl-9">
                  <dt className="inline font-semibold text-foreground">
                    {feature.icon && (
                      <div className="absolute left-1 top-1 h-5 w-5 text-primary">
                        {feature.icon}
                      </div>
                    )}
                    {feature.title}
                  </dt>{" "}
                  <dd className="inline">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Image */}
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border bg-muted",
              imagePosition === "left" && "lg:col-start-1"
            )}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={2432}
              height={1442}
              className="object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * FeatureGrid -- a simple 3-column feature grid with icons.
 */

interface FeatureGridProps {
  title: string;
  subtitle?: string;
  features: FeatureItem[];
  className?: string;
}

export function FeatureGrid({
  title,
  subtitle,
  features,
  className,
}: FeatureGridProps) {
  return (
    <div className={cn("py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          {subtitle && (
            <p className="text-sm font-semibold leading-7 text-primary">
              {subtitle}
            </p>
          )}
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  {feature.icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                  )}
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
