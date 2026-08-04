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
    <footer className={`bg-white border-t border-gray-200 mt-auto ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm py-6 text-gray-600">
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
                    <span className="mx-2 text-gray-400">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
