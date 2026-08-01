"use client";

import { t } from "@/i18n/keys";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { ThinkingPill } from "@/components/chat/thinking-pill";

interface StreamStatusStackProps {
  isThinking: boolean;
  isWaitingForResponse: boolean;
  isSlowResponse: boolean;
  isVerySlowResponse: boolean;
  hasStreamingText: boolean;
}

export function StreamStatusStack({
  isThinking,
  isWaitingForResponse,
  isSlowResponse,
  isVerySlowResponse,
  hasStreamingText,
}: StreamStatusStackProps) {
  const showWaitingState =
    isWaitingForResponse && !hasStreamingText && !isThinking;

  return (
    <div className="flex flex-col items-start gap-2">
      {isThinking && <ThinkingPill />}

      {showWaitingState && (
        <div
          className="flex flex-col items-start gap-3"
          data-testid="stream-status-waiting"
        >
          <div className="rounded-[20px] border border-border/60 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <TypingIndicator />
              <p className="text-xs font-semibold text-foreground">
                {t("CHAT_PLACEHOLDER_STREAMING")}
              </p>
            </div>
          </div>

          {isSlowResponse && (
            <div
              data-testid="slow-response-hint"
              className="max-w-xs rounded-xl border border-border/80 bg-muted/60 p-3"
            >
              <p className="text-xs font-semibold text-foreground">
                {t("CHAT_SLOW_RESPONSE_TITLE")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isVerySlowResponse
                  ? t("CHAT_VERY_SLOW_RESPONSE_HINT")
                  : t("CHAT_SLOW_RESPONSE_HINT")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
