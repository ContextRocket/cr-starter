/**
 * Error Widgets -- Reusable error components for different contexts.
 *
 * These widgets provide consistent error styling across:
 * - Full-page error pages (404, 500, etc.)
 * - In-app error states (dashboard, chat, etc.)
 * - Inline error messages
 *
 * Usage:
 *   <ErrorPage code="404" title="Page not found" description="..." />
 *   <ErrorCard title="Failed to load" description="..." onRetry={handleRetry} />
 *   <InlineError message="Invalid email address" />
 */

import { cn } from "@/lib/utils";
import Link from "next/link";

// ============================================================================
// Error Page (full-page layout)
// ============================================================================

interface ErrorPageProps {
  /** Error code (displayed prominently) */
  code?: string;
  /** Error title */
  title: string;
  /** Error description */
  description: string;
  /** Primary action */
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Secondary action */
  secondaryAction?: {
    label: string;
    href: string;
  };
  /** Additional class names */
  className?: string;
}

export function ErrorPage({
  code,
  title,
  description,
  action,
  secondaryAction,
  className,
}: ErrorPageProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-background px-6",
        className
      )}
    >
      <div className="mx-auto max-w-md text-center">
        {/* Error code */}
        {code && (
          <p className="text-8xl font-bold text-primary">{code}</p>
        )}

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {action &&
              (action.href ? (
                <Link
                  href={action.href}
                  className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  onClick={action.onClick}
                  className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {action.label}
                </button>
              ))}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="text-sm font-semibold leading-6 text-foreground"
              >
                {secondaryAction.label}{" "}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Error Card (in-app error state)
// ============================================================================

interface ErrorCardProps {
  /** Error title */
  title: string;
  /** Error description */
  description: string;
  /** Retry action */
  onRetry?: () => void;
  /** Additional class names */
  className?: string;
}

export function ErrorCard({
  title,
  description,
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-6 text-center",
        className
      )}
    >
      {/* Error icon */}
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
        <svg
          className="h-6 w-6 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      {/* Description */}
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Inline Error (form validation, inline messages)
// ============================================================================

interface InlineErrorProps {
  /** Error message */
  message: string;
  /** Additional class names */
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-destructive", className)}>
      <svg
        className="h-4 w-4 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

// ============================================================================
// Error Boundary Fallback
// ============================================================================

interface ErrorBoundaryFallbackProps {
  /** The error that occurred */
  error: Error;
  /** Reset function */
  reset: () => void;
}

export function ErrorBoundaryFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center p-6">
      <ErrorCard
        title="Something went wrong"
        description={
          process.env.NODE_ENV === "development"
            ? error.message
            : "An unexpected error occurred."
        }
        onRetry={reset}
      />
    </div>
  );
}
