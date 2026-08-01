"use client";

import { t } from "@/i18n/keys";

interface ChatEmptyStateProps {
  title?: string;
  subtitle?: string;
  /** When true, show the "connect ContextRocket" prompt instead of the empty state. */
  showConnectPrompt?: boolean;
}

/**
 * Welcome/empty state for the chat surface.
 * Hero variant: centered column with radial gradient backdrop.
 */
export function ChatEmptyState({
  title,
  subtitle,
  showConnectPrompt = false,
}: ChatEmptyStateProps) {
  if (showConnectPrompt) {
    return (
      <div
        data-testid="chat-connect-prompt"
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(66,100,252,0.08),transparent_50%)]" />
        <div className="relative max-w-md rounded-2xl border border-border/60 bg-card/85 px-6 py-8 shadow-md backdrop-blur-sm">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t("CHAT_CONNECT_REQUIRED_TITLE")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("CHAT_CONNECT_REQUIRED_BODY")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="chat-empty-state"
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8 text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(66,100,252,0.10),transparent_44%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.04),transparent_38%)]" />
      <div className="relative flex w-full max-w-2xl flex-col items-center gap-5 px-2 py-4 md:px-6">
        {/* Avatar / logo placeholder */}
        <div className="relative">
          <div className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,rgba(66,100,252,0.15),transparent_68%)] blur-xl" />
          <div className="relative flex size-20 items-center justify-center rounded-full border border-border/60 bg-card/85 shadow-md">
            <span className="text-3xl" role="img" aria-label="rocket">
              🚀
            </span>
          </div>
        </div>

        <div className="flex max-w-xl flex-col items-center gap-3 text-center">
          <h1
            data-testid="chat-empty-title"
            className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            {title ?? t("CHAT_EMPTY_TITLE")}
          </h1>
          <p
            data-testid="chat-empty-subtitle"
            className="text-sm leading-6 text-muted-foreground"
          >
            {subtitle ?? t("CHAT_EMPTY_SUBTITLE")}
          </p>
        </div>
      </div>
    </div>
  );
}
