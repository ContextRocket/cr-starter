import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/sections/section-wrapper";

/**
 * IntegrationsSection — a two-column "logo grid + text + CTA" band.
 *
 * Generic and props-driven (cr-starter convention): the caller supplies the
 * logos, copy, and CTA, so content/i18n stays at the call site. The two columns
 * animate in from opposite sides via AOS (fade-right / fade-left), initialized
 * by <AosProvider/>.
 */
export interface IntegrationsLogo {
  src: string;
  alt: string;
}

export interface IntegrationsSectionProps {
  logos: IntegrationsLogo[];
  /** Small uppercase eyebrow label. */
  label?: string;
  title: string;
  /** One or more body paragraphs. */
  paragraphs: string[];
  /** Optional CTA button. */
  cta?: { label: string; href: string };
  className?: string;
  /** Section background — uses siteConfig.theme tokens. */
  backgroundClass?: string;
}

export function IntegrationsSection({
  logos,
  label,
  title,
  paragraphs,
  cta,
  className,
  backgroundClass = "bg-card",
}: IntegrationsSectionProps) {
  return (
    <SectionWrapper backgroundClass={backgroundClass} className={className}>
      <div className="flex flex-col items-start md:flex-row md:space-x-10">
        {/* Logo grid */}
        <div
          className="grid w-full grid-cols-3 items-center justify-items-center gap-6 md:w-6/12"
          data-aos="fade-right"
          suppressHydrationWarning
        >
          {logos.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={160}
              height={60}
              className="h-auto w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          ))}
        </div>

        {/* Text + CTA */}
        <div
          className="mt-12 w-full md:mt-0 md:w-6/12"
          data-aos="fade-left"
          suppressHydrationWarning
        >
          {label ? (
            <div className="mb-2 flex items-center space-x-4">
              <span className="w-10 border-t border-border" />
              <span className="text-sm uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
            </div>
          ) : null}
          <h2 className="mb-4 text-2xl font-bold text-foreground">{title}</h2>
          {paragraphs.map((para, i) => (
            <p key={i} className="mb-4 text-muted-foreground last:mb-6">
              {para}
            </p>
          ))}
          {cta ? (
            <Button asChild variant="outline" size="default">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  );
}
