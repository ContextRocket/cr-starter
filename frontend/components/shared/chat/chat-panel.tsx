"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";

import { MessageList } from "@/components/shared/chat/message-list";
import { ChatComposer } from "@/components/shared/chat/chat-composer";
import { ChatEmptyState } from "@/components/shared/chat/chat-empty-state";
import { useA2AStream, type UseA2AStreamResult } from "@/hooks/use-a2a-stream";
import { siteConfig } from "@/config/site.config";
import type { A2AClientOptions } from "@/lib/a2a-client";

interface ChatPanelProps {
  /** Optional override for the chat state; pass your own useA2AStream result
   *  to share state with a parent. When omitted the panel manages its own state. */
  chat?: UseA2AStreamResult;
  /** A2AClientOptions forwarded to useA2AStream when the panel manages its own state. */
  clientOpts?: Partial<A2AClientOptions>;
  /** Agent URL from env; live mode uses it as the direct A2A base. */
  agentUrl?: string;
  /** Welcome title for the empty state. */
  welcomeTitle?: string;
  /** Welcome subtitle for the empty state. */
  welcomeSubtitle?: string;
  /**
   * Link-opening mode from the site config.
   * Forwarded to citation pills and source sheet.
   */
  linkMode?: "new-tab" | "preview";
  className?: string;
  "data-testid"?: string;
}

/**
 * Self-contained chat panel.
 *
 * Renders:
 * - Empty state with icebreaker chips when no messages exist
 * - MessageList (streaming-aware) when messages exist
 * - ChatComposer at the bottom
 * - An honest demo/live empty state with localized icebreakers
 */
export function ChatPanel({
  chat: externalChat,
  clientOpts,
  agentUrl,
  welcomeTitle,
  welcomeSubtitle,
  linkMode,
  className,
  "data-testid": testId = "chat-panel",
}: ChatPanelProps) {

  const internalChat = useA2AStream({
    ...clientOpts,
    baseUrl: agentUrl ?? clientOpts?.baseUrl ?? "",
  });

  const chat = externalChat ?? internalChat;
  const isStreaming =
    chat.phase === "streaming" ||
    chat.phase === "submitted" ||
    chat.phase === "thinking" ||
    chat.phase === "working";
  const hasMessages = chat.messages.length > 0;
  // Effective link mode: fall back to site config default.
  const effectiveLinkMode = linkMode ?? siteConfig.chat.linkMode;

  const handleSend = useCallback(
    (text: string) => {
      chat.sendMessage(text);
    },
    [chat],
  );

  const handleIcebreakerSelect = useCallback(
    (message: string) => {
      chat.sendMessage(message);
    },
    [chat],
  );

  const handleSuggestionSelect = useCallback(
    (text: string) => {
      chat.sendMessage(text);
    },
    [chat],
  );

  return (
    <div
      data-testid={testId}
      className={cn("flex flex-col overflow-hidden bg-background", className)}
    >
      {/* Message area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!hasMessages ? (
          <ChatEmptyState
            title={welcomeTitle}
            subtitle={welcomeSubtitle}
            onIcebreakerSelect={handleIcebreakerSelect}
          />
        ) : (
          <MessageList
            messages={chat.messages}
            streamingText={chat.streamingText}
            isWaitingForResponse={chat.isWaitingForResponse}
            isThinking={chat.isThinking}
            isSlowResponse={chat.isSlowResponse}
            isVerySlowResponse={chat.isVerySlowResponse}
            onSuggestionSelect={handleSuggestionSelect}
            linkMode={effectiveLinkMode}
          />
        )}

        {chat.error && (
          <div
            data-testid="chat-error"
            className="mx-auto w-full max-w-4xl px-4 pb-2"
          >
            <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {chat.error.message}
            </p>
          </div>
        )}
      </div>

      {/* Composer */}
      <ChatComposer
        onSend={handleSend}
        onStop={chat.abort}
        isStreaming={isStreaming}
        placeholder={t("chat.placeholder")}
      />
    </div>
  );
}
