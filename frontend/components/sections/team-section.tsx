/**
 * TeamSection — a props-driven promotion of the cr-landing fork's about-page
 * team block into the canonical starter template.
 *
 * All user-facing copy (title, subtitle, member role, bio paragraphs) arrives
 * as already-localized props; this component hardcodes NO marketing English.
 * The only literals are the social network brand nouns (X / LinkedIn / GitHub),
 * which are proper nouns and therefore i18n-safe in the aria-labels.
 *
 * On-screen we deliberately omit expertise / knowsAbout data — matching the
 * source, that belongs in Person JSON-LD only. That structured data is built
 * separately at the page level via `buildPersonJsonLd`; it is not this
 * component's concern.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface TeamMember {
  name: string;
  /** Already-localized role / title. */
  role: string;
  /** Already-localized bio paragraphs, rendered as a vertical stack. */
  bioParagraphs: string[];
  imageUrl: string;
  social?: { x?: string; linkedin?: string; github?: string };
}

export interface TeamSectionProps {
  title: string;
  subtitle?: string;
  members: TeamMember[];
  className?: string;
}

export function TeamSection({
  title,
  subtitle,
  members,
  className = "",
}: TeamSectionProps) {
  return (
    <section className={cn("px-6 py-24 sm:py-32 max-w-4xl mx-auto", className)}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-foreground mb-4">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {members.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8"
          >
            <div className="flex-shrink-0">
              <Image
                src={member.imageUrl}
                alt={member.name}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-lg text-muted-foreground mb-4">
                  {member.role}
                </p>
              </div>
              <div className="space-y-4 text-left">
                {member.bioParagraphs.map((paragraph, i) => (
                  <p key={i} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-4 md:justify-start">
                {member.social?.x && (
                  <a
                    href={member.social.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} – X`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
                {member.social?.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} – LinkedIn`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.328v15.344C1 18.4 1.595 19 2.328 19h15.34c.734 0 1.332-.6 1.332-1.328V2.328C19 1.581 18.4 1 17.668 1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
                {member.social?.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} – GitHub`}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
