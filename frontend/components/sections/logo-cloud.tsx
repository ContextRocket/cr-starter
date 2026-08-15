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
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10 sm:gap-y-6">
        {items.map((item) => {
          // Muted grayscale by default; full color + opacity on hover. Many of
          // these are dark wordmarks that vanish on a dark surface, so in dark
          // mode each logo sits on a subtle light chip that keeps it legible in
          // both themes without touching global styles.
          const logo = (
            <span className="inline-flex items-center rounded-md px-2 py-1 transition dark:bg-white/85 dark:px-3 dark:py-1.5 dark:group-hover:bg-white">
              <Image
                src={item.src}
                alt={item.alt}
                width={140}
                height={28}
                style={{ width: "auto" }}
                className="h-6 opacity-60 grayscale transition duration-200 group-hover:opacity-100 group-hover:grayscale-0 sm:h-7 dark:opacity-70"
              />
            </span>
          );
          return item.href ? (
            <a
              key={item.src}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.alt}
              className="group inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {logo}
            </a>
          ) : (
            <span key={item.src} className="group inline-flex">
              {logo}
            </span>
          );
        })}
      </div>
    </section>
  );
}
