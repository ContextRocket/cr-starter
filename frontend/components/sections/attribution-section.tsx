/**
 * AttributionSection — a props-driven credits list (fonts, icon sets,
 * open-source libraries, image sources) promoted from the cr-landing fork's
 * /attribution page into the canonical starter template.
 *
 * Content-agnostic (cr-starter convention): the caller passes already-resolved
 * chrome copy (title / optional subtitle) via t() and the credit `items` from
 * the build-time loader (`loadAttributions()`). This component hardcodes NO
 * marketing English. Item fields (name / license / note) are verbatim data —
 * proper nouns and copyright lines — not chrome, so they render as-is.
 *
 * External links always carry target="_blank" rel="noopener noreferrer".
 */

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { Attribution } from "@/lib/attributions";
import { SectionWrapper } from "@/components/sections/section-wrapper";
import { FadeIn } from "@/components/ui/motion";

export interface AttributionSectionProps {
  /** Already-localized section heading. */
  title: string;
  /** Optional already-localized supporting line under the heading. */
  subtitle?: string;
  /** Credit entries (verbatim data from the attributions atom). */
  items: Attribution[];
  className?: string;
  /** Section background — uses siteConfig.theme tokens. */
  backgroundClass?: string;
}

export function AttributionSection({
  title,
  subtitle,
  items,
  className,
  backgroundClass = "bg-background",
}: AttributionSectionProps) {
  return (
    <SectionWrapper
      padding="loose"
      backgroundClass={backgroundClass}
      className={className}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <FadeIn key={`${item.name}-${i}`} delay={i * 0.05}>
              <li className="h-full rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 transition-colors hover:text-primary"
                      >
                        {item.name}
                        <ArrowTopRightOnSquareIcon
                          className="h-4 w-4 flex-shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      item.name
                    )}
                  </h3>
                  {item.license ? (
                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {item.license}
                    </span>
                  ) : null}
                </div>
                {item.note ? (
                  <p
                    className={cn(
                      "mt-2 text-sm leading-6 text-muted-foreground",
                    )}
                  >
                    {item.note}
                  </p>
                ) : null}
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
