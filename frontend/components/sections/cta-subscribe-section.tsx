"use client";

import { useState, type ReactNode } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/sections/section-wrapper";
import { submitForm } from "@/lib/forms";
import type { FormKey } from "@/forms.config";

/**
 * CtaSubscribeSection — an email subscribe / waitlist CTA band.
 *
 * Props-driven (cr-starter convention): all copy is passed in (localize at the
 * call site). Submission is config-driven and optional:
 *   - pass `formKey` to submit via `forms.config.ts` (the endpoint lives in
 *     config, not here — e.g. a ContextRocket structured app);
 *   - or pass a custom `onSubmit`;
 *   - or neither → UI-only (validates + shows success locally, no network).
 * With `formKey` set but no endpoint configured, it stays UI-only. The band
 * animates in via AOS (initialized by <AosProvider/>).
 */
export interface CtaSubscribeSectionProps {
  title: string;
  subtitle?: string;
  emailPlaceholder: string;
  submitLabel: string;
  /** Consent line (may include a privacy-policy link). */
  consentLabel: ReactNode;
  /** Message shown after a successful submit. */
  successMessage: string;
  /** Validation + submit-failure messages. */
  errors: {
    emailRequired: string;
    emailInvalid: string;
    consentRequired: string;
    submitFailed: string;
  };
  /**
   * Which entry in `forms.config.ts` to submit to. When its endpoint is empty,
   * the form stays UI-only.
   */
  formKey?: FormKey;
  /**
   * Custom submit handler; overrides `formKey`. When both are omitted the form
   * is UI-only.
   */
  onSubmit?: (email: string) => Promise<void> | void;
  className?: string;
  /** Section background — uses siteConfig.theme tokens. */
  backgroundClass?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CtaSubscribeSection({
  title,
  subtitle,
  emailPlaceholder,
  submitLabel,
  consentLabel,
  successMessage,
  errors,
  formKey,
  onSubmit,
  className,
  backgroundClass = "bg-muted",
}: CtaSubscribeSectionProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    consent?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { email?: string; consent?: string } = {};
    if (!email.trim()) next.email = errors.emailRequired;
    else if (!EMAIL_RE.test(email.trim())) next.email = errors.emailInvalid;
    if (!consent) next.consent = errors.consentRequired;
    setFieldErrors(next);
    if (next.email || next.consent) return;

    try {
      setLoading(true);
      setSubmitError(undefined);
      if (onSubmit) await onSubmit(email.trim());
      else if (formKey) await submitForm(formKey, { email: email.trim() });
      setSubmitted(true);
    } catch {
      setSubmitError(errors.submitFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionWrapper backgroundClass={backgroundClass} className={className}>
      <div
        className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12 sm:py-16"
        data-aos="fade-up"
        suppressHydrationWarning
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircleIcon
              className="h-12 w-12 text-primary"
              aria-hidden
            />
            <p className="text-lg font-medium text-foreground">
              {successMessage}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
                {subtitle}
              </p>
            ) : null}

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 max-w-lg"
              noValidate
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailPlaceholder}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  className="h-12 flex-1 rounded-full px-5 text-base shadow-sm"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-full px-8 text-base font-semibold shadow-sm"
                >
                  {submitLabel}
                </Button>
              </div>
              {fieldErrors.email ? (
                <p className="mt-2 text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              ) : null}

              <label className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="size-4 shrink-0 rounded border-border accent-primary"
                />
                <span className={cn("max-w-md")}>{consentLabel}</span>
              </label>
              {fieldErrors.consent ? (
                <p className="mt-2 text-sm text-destructive">
                  {fieldErrors.consent}
                </p>
              ) : null}
              {submitError ? (
                <p className="mt-2 text-sm text-destructive">{submitError}</p>
              ) : null}
            </form>
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
