"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";
import { MessageList } from "@/components/chat/message-list";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { ConversionNudge } from "@/components/chat/conversion-nudge";
import { useA2AStream, type UseA2AStreamResult } from "@/hooks/use-a2a-stream";
import { siteConfig } from "@/site.config";
import type { A2AClientOptions } from "@/lib/a2a-client";

interface ChatPanelProps {
  /** Optional override for the chat state; pass your own useA2AStream result
   *  to share state with a parent. When omitted the panel manages its own state. */
  chat?: UseA2AStreamResult;
  /** A2AClientOptions forwarded to useA2AStream when the panel manages its own state. */
  clientOpts?: Partial<A2AClientOptions>;
  /** Agent URL from env; when falsy the panel shows the "connect" prompt. */
  agentUrl?: string;
  /** Welcome title for the empty state. */
  welcomeTitle?: string;
  /** Welcome subtitle for the empty state. */
  welcomeSubtitle?: string;
  /**
   * Whether the current user is a guest (unauthenticated).
   * Drives the conversion-moment nudge visibility.
   * Defaults to false (no nudge shown) when not provided.
   */
  isGuest?: boolean;
  /**
   * Called when the guest->registered CTA is tapped.
   * Typically routes to /register or opens the auth flow.
   */
  onConversionAction?: () => void;
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
 * - Conversion-moment nudge after turnThreshold substantive turns (guests only)
 *
 * Auth: the panel renders in "connect" mode when no agentUrl is configured.
 * This is the honest empty state for template consumers who haven't wired a CR
 * backend yet. No fake data is shown.
 */
export function ChatPanel({
  chat: externalChat,
  clientOpts,
  agentUrl,
  welcomeTitle,
  welcomeSubtitle,
  isGuest = false,
  onConversionAction,
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
  // Let the offline mock work even without a real backend URL (useful for showcase/demo)
  const backendConnected = true;

  // Effective link mode: fall back to site config default.
  const effectiveLinkMode = linkMode ?? siteConfig.chat.linkMode;

  // Count substantive turns: completed assistant messages (non-pending, non-empty).
  const substantiveTurns = chat.messages.filter(
    (m) => m.role === "assistant" && !m.pending && m.content.length > 0,
  ).length;

  const nudgeConfig = siteConfig.chat.conversionMoments;
  const showNudge =
    isGuest && substantiveTurns >= nudgeConfig.turnThreshold && hasMessages;

  const handleSend = useCallback(
    (text: string) => {
      if (!backendConnected) return;
      chat.sendMessage(text);
    },
    [backendConnected, chat],
  );

  const handleIcebreakerSelect = useCallback(
    (message: string) => {
      if (!backendConnected) return;
      chat.sendMessage(message);
    },
    [backendConnected, chat],
  );

  const handleSuggestionSelect = useCallback(
    (text: string) => {
      if (!backendConnected) return;
      chat.sendMessage(text);
    },
    [backendConnected, chat],
  );

  const handleConversionAction = useCallback(() => {
    onConversionAction?.();
  }, [onConversionAction]);

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
            showConnectPrompt={!backendConnected}
            onIcebreakerSelect={
              backendConnected ? handleIcebreakerSelect : undefined
            }
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

      {/* Conversion-moment nudge (guests only, after threshold turns) */}
      {showNudge && (
        <div className="pb-2">
          <ConversionNudge
            isGuest={isGuest}
            onAction={handleConversionAction}
          />
        </div>
      )}

      {/* Composer */}
      {backendConnected && (
        <ChatComposer
          onSend={handleSend}
          onStop={chat.abort}
          isStreaming={isStreaming}
          placeholder={t("chat.placeholder")}
        />
      )}
    </div>
  );
}
