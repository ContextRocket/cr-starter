import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";

export type LocaleOption = {
  code: string;
  label: string;
  href: string;
};

interface LocaleSwitcherProps {
  locale: string;
  options: LocaleOption[];
  changeLanguageLabel: string;
  className?: string;
}

export function LocaleSwitcher({
  locale,
  options,
  changeLanguageLabel,
  className,
}: LocaleSwitcherProps) {
  if (options.length < 2) return null;

  return (
    <details className={cn("relative z-[70]", className)}>
      <summary
        aria-label={changeLanguageLabel}
        title={changeLanguageLabel}
        data-testid="locale-switcher"
        className="flex h-9 min-w-[3rem] cursor-pointer list-none select-none items-center gap-1 rounded px-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"
      >
        <GlobeAltIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium uppercase">{locale}</span>
      </summary>

      <nav
        aria-label={changeLanguageLabel}
        data-testid="locale-switcher-menu"
        className="absolute right-0 top-[calc(100%+4px)] z-[9999] w-40 rounded border border-border bg-card py-1 shadow-lg"
      >
        <ul>
          {options.map((option) => (
            <li key={option.code}>
              <a
                href={option.href}
                aria-current={option.code === locale ? "page" : undefined}
                data-testid={`locale-switcher-option-${option.code}`}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:bg-foreground/5",
                  option.code === locale && "font-medium text-primary",
                )}
              >
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
