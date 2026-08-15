/**
 * brand-logo.tsx — the theme-aware header brand mark.
 *
 * Renders one of two variants (selected upstream via `chrome.logoVariant`):
 *   - "icon"     → the icon-only rocket glyph, sized as a small square
 *                  (`h-7 w-7`).
 *   - "wordmark" → the wide full wordmark, clamped to the header height
 *                  (`h-6 w-auto`).
 *
 * Each variant is THEME-AWARE: when a `srcDark` is supplied, a second image is
 * swapped in under `.dark` via the CSS `dark:` variant (no JS, no mount
 * flicker) — the light image is `dark:hidden`, the dark image is
 * `hidden dark:block`. This is the shared primitive used by both the marketing
 * Navbar and the MinimalHeader so the swap logic lives in one place.
 *
 * `width`/`height` on the asset are intrinsic-ratio hints for next/image
 * layout reservation.
 */

import Image from "next/image";

export interface BrandLogoAsset {
  /** Light-theme image src. */
  src: string;
  /** Optional dark-theme image src; when set it swaps in under `.dark`. */
  srcDark?: string;
  /** Accessible alt text (brand name). */
  alt: string;
  /** Which mark variant this asset is — drives the default sizing class. */
  variant: "icon" | "wordmark";
  /** Intrinsic width hint. */
  width: number;
  /** Intrinsic height hint. */
  height: number;
}

interface BrandLogoProps {
  logo: BrandLogoAsset;
  /**
   * Size/utility classes applied to each <Image>. Defaults per variant: a
   * small square for "icon", a height-clamped wide mark for "wordmark".
   */
  className?: string;
}

const DEFAULT_CLASS: Record<BrandLogoAsset["variant"], string> = {
  icon: "h-7 w-7",
  wordmark: "h-6 w-auto",
};

export function BrandLogo({ logo, className }: BrandLogoProps) {
  const imgClass = className ?? DEFAULT_CLASS[logo.variant];

  if (!logo.srcDark) {
    return (
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={imgClass}
        priority
      />
    );
  }

  return (
    <>
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={`${imgClass} dark:hidden`}
        priority
      />
      <Image
        src={logo.srcDark}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={`${imgClass} hidden dark:block`}
        priority
      />
    </>
  );
}
