"use client";

import { ErrorPage } from "@/components/shared/ui/error-widgets";

/**
 * Global Error Page
 *
 * Branded error page for root layout errors.
 * This catches errors that occur in the root layout itself.
 *
 * Note: This page is outside the locale layout, so it uses hardcoded text.
 * Keep copy generic and brand-neutral.
 */
export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ErrorPage
          title="Something went wrong"
          description="An unexpected error occurred. Please try again."
          action={{
            label: "Try again",
            onClick: reset,
          }}
        />
      </body>
    </html>
  );
}
