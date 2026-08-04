import Link from "next/link";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSectionProps {
  links: FooterLink[];
  companyName: string;
  className?: string;
}

export function FooterSection({
  links,
  companyName,
  className = "",
}: FooterSectionProps) {
  return (
    <footer className={`border-t border-border px-6 py-12 ${className}`}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {companyName}</p>
        <nav className="flex gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
