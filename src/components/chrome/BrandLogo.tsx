export interface BrandLogoAsset {
  src: string;
  alt: string;
  variant?: "icon" | "wordmark";
  width: number;
  height: number;
}

interface BrandLogoProps {
  logo: BrandLogoAsset;
  brandName?: string;
  className?: string;
}

const DEFAULT_CLASS: Record<"icon" | "wordmark", string> = {
  icon: "h-7 w-7",
  wordmark: "h-7 w-auto",
};

export function BrandLogo({ logo, brandName, className }: BrandLogoProps) {
  const variant = logo.variant ?? "icon";
  const sizeClass = className ?? DEFAULT_CLASS[variant];

  const image = (
    <img
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      className={sizeClass}
    />
  );

  if (variant === "wordmark") {
    return <span className="inline-flex items-center">{image}</span>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      {image}
      {brandName ? (
        <span className="text-base font-semibold tracking-tight text-foreground">
          {brandName}
        </span>
      ) : null}
    </span>
  );
}
