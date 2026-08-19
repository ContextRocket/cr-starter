"use client";

import { t } from "@/i18n/keys";

import { TypingIndicator } from "@/components/shared/chat/typing-indicator";
import { ThinkingPill } from "@/components/shared/chat/thinking-pill";

interface StreamStatusStackProps {
  isThinking: boolean;
  isWaitingForResponse: boolean;
  isSlowResponse: boolean;
  isVerySlowResponse: boolean;
  hasStreamingText: boolean;
}

/**
 * Three-tier latency stack shown while waiting for the first token:
 *
 *   Tier 1 (immediate): thinking pill (or the typing indicator when the
 *           agent reports a waiting-but-not-thinking state).
 *   Tier 2 (slow, 8s):  "still working" hint alongside tier 1.
 *   Tier 3 (very slow, 20s): the hint copy escalates.
 *
 * The slow/very-slow hints render ALONGSIDE the thinking pill: the hook
 * sets isThinking and isWaitingForResponse together, so gating the hints
 * on !isThinking would make them unreachable.
 */
export function StreamStatusStack({
  isThinking,
  isWaitingForResponse,
  isSlowResponse,
  isVerySlowResponse,
  hasStreamingText,
}: StreamStatusStackProps) {

  const waitingForFirstToken = isWaitingForResponse && !hasStreamingText;

  return (
    <div className="flex flex-col items-start gap-2">
      {isThinking && <ThinkingPill />}

      {waitingForFirstToken && !isThinking && (
        <div
          className="rounded-[20px] border border-border/60 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-sm"
          data-testid="stream-status-waiting"
        >
          <div className="flex items-center gap-2.5">
            <TypingIndicator />
            <p className="text-xs font-semibold text-foreground">
              {t("chat.placeholderStreaming")}
            </p>
          </div>
        </div>
      )}

      {waitingForFirstToken && isSlowResponse && (
        <div
          data-testid="slow-response-hint"
          className="max-w-xs rounded-xl border border-border/80 bg-muted/60 p-3"
        >
          <p className="text-xs font-semibold text-foreground">
            {t("chat.slow.response.title")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isVerySlowResponse
              ? t("chat.very.slow.response.hint")
              : t("chat.slow.response.hint")}
          </p>
        </div>
      )}
    </div>
  );
}
