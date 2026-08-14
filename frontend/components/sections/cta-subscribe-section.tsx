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
        className="mx-auto max-w-2xl text-center"
        data-aos="fade-up"
        suppressHydrationWarning
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircleIcon
              className="h-10 w-10 text-primary"
              aria-hidden
            />
            <p className="text-lg font-medium text-foreground">
              {successMessage}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-3 text-muted-foreground">{subtitle}</p>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-8" noValidate>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailPlaceholder}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  className="sm:max-w-xs"
                />
                <Button type="submit" disabled={loading}>
                  {submitLabel}
                </Button>
              </div>
              {fieldErrors.email ? (
                <p className="mt-2 text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              ) : null}

              <label className="mt-4 flex items-start justify-center gap-2 text-left text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 size-4 shrink-0 rounded border-border"
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
