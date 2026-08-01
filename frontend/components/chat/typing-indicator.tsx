"use client";

import { t } from "@/i18n/keys";

export function TypingIndicator() {
  return (
    <div
      data-testid="typing-indicator"
      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2.5 py-1.5 shadow-sm backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={t("ACCESSIBILITY_TYPING")}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          data-testid="typing-dot"
          className="mx-0.5 inline-block size-1.5 rounded-full bg-[#8e8e8e] animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
