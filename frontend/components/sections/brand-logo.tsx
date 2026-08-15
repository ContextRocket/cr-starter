/**
 * brand-logo.tsx — the theme-aware header brand mark.
 *
 * Renders one of two variants (selected upstream via `chrome.logoVariant`):
 *   - "icon"     → the icon-only rocket glyph, sized as a small square
 *                  (`h-7 w-7`), PLUS the brand name rendered as a text
 *                  wordmark-substitute beside it (icon left, name right) when a
 *                  `brandName` is supplied. The icon alone carries no wordmark,
 *                  so the name completes the mark: `[icon]  Your Brand`.
 *   - "wordmark" → the wide full wordmark, clamped to the header height
 *                  (`h-6 w-auto`). The name is already baked into the wordmark
 *                  image, so NO separate text label is rendered here.
 *
 * Each variant is THEME-AWARE: when a `srcDark` is supplied, a second image is
 * swapped in under `.dark` via the CSS `dark:` variant (no JS, no mount
 * flicker) — the light image is `dark:hidden`, the dark image is
 * `hidden dark:block`. The icon-variant text label is token-colored
 * (`text-foreground`) so it stays theme-aware without a second asset. This is
 * the shared primitive used by both the marketing Navbar and the MinimalHeader
 * so the swap logic lives in one place.
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
   * Brand name rendered as a text wordmark-substitute BESIDE the icon in the
   * "icon" variant (`[icon]  Your Brand`). Ignored for the "wordmark" variant,
   * whose image already contains the name. When omitted, the icon renders alone
   * (prior behavior).
   */
  brandName?: string;
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

function LogoImage({
  logo,
  className,
}: {
  logo: BrandLogoAsset;
  className: string;
}) {
  if (!logo.srcDark) {
    return (
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={className}
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
        className={`${className} dark:hidden`}
        priority
      />
      <Image
        src={logo.srcDark}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={`${className} hidden dark:block`}
        priority
      />
    </>
  );
}

export function BrandLogo({ logo, brandName, className }: BrandLogoProps) {
  const imgClass = className ?? DEFAULT_CLASS[logo.variant];

  // Icon variant carries no wordmark: render the name beside it as a
  // token-colored text mark so the header reads `[icon]  Your Brand`. The
  // wordmark variant already bakes the name into the image, so it renders alone.
  if (logo.variant === "icon" && brandName) {
    return (
      <span className="flex items-center gap-2">
        <LogoImage logo={logo} className={imgClass} />
        <span className="text-lg font-semibold text-foreground">
          {brandName}
        </span>
      </span>
    );
  }

  return <LogoImage logo={logo} className={imgClass} />;
}
