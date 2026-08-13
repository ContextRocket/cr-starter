import Image from "next/image";

export interface LogoCloudItem {
  src: string;
  alt: string;
  href?: string;
}

export interface LogoCloudProps {
  heading?: string;
  items: LogoCloudItem[];
  className?: string;
}

export function LogoCloud({ heading, items, className = "" }: LogoCloudProps) {
  return (
    <section className={`px-6 py-16 max-w-5xl mx-auto ${className}`}>
      {heading && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground text-center">
          {heading}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {items.map((item) => {
          const logo = (
            <Image
              src={item.src}
              alt={item.alt}
              width={120}
              height={40}
              className="h-8 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          );
          return item.href ? (
            <a
              key={item.src}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              {logo}
            </a>
          ) : (
            <span key={item.src} className="inline-flex">
              {logo}
            </span>
          );
        })}
      </div>
    </section>
  );
}
