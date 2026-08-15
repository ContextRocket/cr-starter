import Link from "next/link";

export interface FooterLink {
  label: string;
  href: string;
}

/**
 * Footer STYLE.
 *   "full"    — the default company footer (white surface, centered row).
 *   "minimal" — a compact personal-brand footer (token-styled surface, brand +
 *               copyright on one side, links on the other). Selected via
 *               siteConfig.chrome.footer = "minimal".
 */
export type FooterVariant = "full" | "minimal";

export interface FooterSectionProps {
  links: FooterLink[];
  companyName: string;
  /** Footer style. Default "full" preserves cr-starter's current footer. */
  variant?: FooterVariant;
  className?: string;
}

export function FooterSection({
  links,
  companyName,
  variant = "full",
  className = "",
}: FooterSectionProps) {
  if (variant === "minimal") {
    return (
      <footer
        className={`mt-auto border-t border-border bg-background text-muted-foreground ${className}`}
      >
        <div className="mx-auto flex max-w-screen-md flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-6">
          <span>
            &copy; {new Date().getFullYear()} {companyName}
          </span>
          {links.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`bg-background text-muted-foreground border-t border-border mt-auto ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm py-6 text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-0">
            <span>
              &copy; {new Date().getFullYear()} {companyName}
            </span>
            <span className="hidden sm:inline mx-2">-</span>
            <div className="flex justify-center items-center gap-1">
              {links.map((link, index) => (
                <span key={link.href} className="flex items-center">
                  <Link
                    href={link.href}
                    className="underline hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < links.length - 1 && (
                    <span className="mx-2 text-muted-foreground/60">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          {/* Understated attribution — the subtle ContextRocket anchor. */}
          <p className="mt-2 text-xs text-muted-foreground/70">
            Powered by{" "}
            <a
              href="https://contextrocket.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              ContextRocket
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
