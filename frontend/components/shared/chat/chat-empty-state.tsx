"use client";

import { useLocale, useTranslations } from "@/i18n/locale-provider";
import Image from "next/image";
import { siteConfig } from "@/config/site.config";

interface ChatEmptyStateProps {
  title?: string;
  subtitle?: string;
  /** When true, show the "connect ContextRocket" prompt instead of the empty state. */
  showConnectPrompt?: boolean;
  /**
   * Called when the user taps an icebreaker chip.
   * The parent (ChatPanel) should call chat.sendMessage with this text.
   */
  onIcebreakerSelect?: (message: string) => void;
}

/**
 * Welcome/empty state for the chat surface.
 * Hero variant: centered column with radial gradient backdrop.
 *
 * Renders icebreaker chips from siteConfig.chat.icebreakers[currentLocale].
 * Falls back to "en" when the current locale has no icebreaker entries.
 * Renders no chip row when the config has no icebreakers for any locale.
 */
export function ChatEmptyState({
  title,
  subtitle,
  showConnectPrompt = false,
  onIcebreakerSelect,
}: ChatEmptyStateProps) {
  const { locale } = useLocale();
  const t = useTranslations();

  if (showConnectPrompt) {
    return (
      <div
        data-testid="chat-connect-prompt"
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(66,100,252,0.08),transparent_50%)]" />
        <div className="relative max-w-md rounded-2xl border border-border/60 bg-card/85 px-6 py-8 shadow-md backdrop-blur-sm">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t("chat.connect.required.title")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("chat.connect.required.body")}
          </p>
        </div>
      </div>
    );
  }

  // Resolve icebreakers for the current locale, falling back to "en".
  const icebreakers =
    siteConfig.chat.icebreakers[locale] ??
    siteConfig.chat.icebreakers["en"] ??
    [];

  return (
    <div
      data-testid="chat-empty-state"
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8 text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(66,100,252,0.10),transparent_44%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.04),transparent_38%)]" />
      <div className="relative flex w-full max-w-2xl flex-col items-center gap-5 px-2 py-4 md:px-6">
        {/* Site logo */}
        <div className="relative">
          <div className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,rgba(66,100,252,0.15),transparent_68%)] blur-xl" />
          <div className="relative flex size-20 items-center justify-center rounded-full border border-border/60 bg-card/85 shadow-md overflow-hidden">
            <Image
              src={siteConfig.assets.logo}
              alt={siteConfig.companyName}
              width={48}
              height={48}
              className="size-12 object-contain"
            />
          </div>
        </div>

        <div className="flex max-w-xl flex-col items-center gap-3 text-center">
          <h1
            data-testid="chat-empty-title"
            className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            {title ?? t("chat.empty.title")}
          </h1>
          <p
            data-testid="chat-empty-subtitle"
            className="text-sm leading-6 text-muted-foreground"
          >
            {subtitle ?? t("chat.empty.subtitle")}
          </p>
        </div>

        {/* Icebreaker chips */}
        {icebreakers.length > 0 && onIcebreakerSelect && (
          <div
            className="flex flex-wrap justify-center gap-2"
            aria-label="Suggested questions"
            data-testid="icebreaker-chips"
          >
            {icebreakers.map((entry, i) => (
              <button
                key={i}
                onClick={() => onIcebreakerSelect(entry.message)}
                data-testid={`icebreaker-chip-${i + 1}`}
                className="rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-sm text-foreground shadow-sm backdrop-blur-sm transition-all duration-150 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              >
                {entry.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
