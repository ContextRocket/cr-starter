import Link from "next/link";
import { ContextRocketBadge } from "@/components/shared/ui/badge-widget";

export interface FooterLink {
  label: string;
  href: string;
}

/**
 * Footer STYLE.
 *   "full"    -- the default company footer (white surface, centered row).
 *   "minimal" -- a compact personal-brand footer (token-styled surface, brand +
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
  /** Inner container class for the minimal variant. Defaults to max-w-screen-md px-4 sm:px-6. */
  containerClassName?: string;
  showPoweredByBadge?: boolean;
}

export function FooterSection({
  links,
  companyName,
  variant = "full",
  className = "",
  showPoweredByBadge = true,
  containerClassName = "max-w-screen-md px-4 sm:px-6",
}: FooterSectionProps) {
  if (variant === "minimal") {
    return (
      <footer
        className={`mt-auto border-t border-border bg-background text-muted-foreground ${className}`}
      >
        <div className={`mx-auto flex flex-col items-center justify-between gap-3 py-6 text-sm sm:flex-row ${containerClassName}`}>
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
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {links.map((link, index) => (
                <span key={link.href} className="flex items-center gap-x-2">
                  <Link
                    href={link.href}
                    className="underline hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < links.length - 1 && (
                    <span className="text-muted-foreground/60" aria-hidden="true">
                      |
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          {/* Understated attribution -- the subtle ContextRocket anchor. */}
          {showPoweredByBadge !== false && (
            <div className="mt-6">
              <ContextRocketBadge className="group" />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
