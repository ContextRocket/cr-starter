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

export function BrandLogo({ logo, brandName, className }: BrandLogoProps) {
  const variant = logo.variant ?? "icon";

  const image = (
    <img
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      className={className ?? "block shrink-0"}
      style={className ? undefined : { width: logo.width, height: logo.height }}
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
