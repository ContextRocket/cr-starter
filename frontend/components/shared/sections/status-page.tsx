/**
 * StatusPage -- a reusable, props-driven status confirmation shell promoted
 * from the cr-landing fork's newsletter verified/unsubscribe pages into the
 * canonical starter template.
 *
 * This is the ONE shared shell behind simple status/confirmation states:
 * "subscription confirmed", "you've been unsubscribed", "page moved",
 * generic success/info/error confirmations. A centered card with an optional
 * icon, a title, a message, and an optional CTA Link.
 *
 * Content-agnostic (cr-starter convention): all user-facing copy (title,
 * message, action label) arrives as already-localized props via t(). This
 * component hardcodes NO English. `tone` only drives the icon/accent color via
 * theme tokens -- it never injects copy.
 *
 * NOTE: This is deliberately NOT a preferences/subscribe form. The subscribe
 * flow is already covered by `CtaSubscribeSection` + `forms.config` -- do not
 * rebuild a form here. Callers that need to collect input compose that form;
 * StatusPage only renders terminal confirmation states.
 */

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/shared/sections/section-wrapper";
import { FadeIn } from "@/components/shared/ui/motion";

export type StatusTone = "success" | "info" | "error";

/** Accent color classes per tone -- theme tokens only, no hardcoded copy. */
const toneClasses: Record<StatusTone, { ring: string; text: string }> = {
  success: { ring: "bg-primary/10", text: "text-primary" },
  info: { ring: "bg-muted", text: "text-muted-foreground" },
  error: { ring: "bg-destructive/10", text: "text-destructive" },
};

export interface StatusPageProps {
  /** Optional leading icon (e.g. a heroicon); tinted by `tone`. */
  icon?: ReactNode;
  /** Already-localized heading. */
  title: string;
  /** Already-localized supporting message. */
  message: string;
  /** Optional CTA rendered as a locale-aware Link. */
  action?: { label: string; href: string };
  /** Accent tone; affects icon/accent color only (default "success"). */
  tone?: StatusTone;
  className?: string;
  /** Section background -- uses siteConfig.theme tokens. */
  backgroundClass?: string;
}

export function StatusPage({
  icon,
  title,
  message,
  action,
  tone = "success",
  className,
  backgroundClass = "bg-background",
}: StatusPageProps) {
  const accent = toneClasses[tone];

  return (
    <SectionWrapper
      padding="loose"
      backgroundClass={backgroundClass}
      className={className}
    >
      <div className="mx-auto max-w-md">
        <FadeIn>
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            {icon ? (
              <div
                className={cn(
                  "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full",
                  accent.ring,
                )}
              >
                <span className={cn("flex h-8 w-8 items-center justify-center", accent.text)}>
                  {icon}
                </span>
              </div>
            ) : null}

            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-3 text-muted-foreground">{message}</p>

            {action ? (
              <div className="mt-6">
                <Link
                  href={action.href}
                  className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
                >
                  {action.label}
                </Link>
              </div>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
