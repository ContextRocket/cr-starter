import Image from "next/image";
import type { ReactNode } from "react";

/**
 * A full-width hero surface with an image, configurable overlay, and a
 * constrained content slot. The image is decorative by default; the visible
 * hero copy should carry the meaning for assistive technology.
 */
export interface HeroBackgroundSectionProps {
  children: ReactNode;
  imageSrc: string;
  imageAlt?: string;
  imageClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  className?: string;
}

export function HeroBackgroundSection({
  children,
  imageSrc,
  imageAlt = "",
  imageClassName = "object-cover object-center",
  overlayClassName =
    "bg-gradient-to-b from-black/60 via-black/35 to-black/80",
  contentClassName = "max-w-4xl",
  className = "",
}: HeroBackgroundSectionProps) {
  return (
    <section
      className={`relative isolate overflow-hidden px-6 pt-24 pb-32 sm:pt-32 sm:pb-40 ${className}`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className={`z-0 ${imageClassName}`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-10 ${overlayClassName}`}
      />
      <div className={`relative z-20 mx-auto ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
}
