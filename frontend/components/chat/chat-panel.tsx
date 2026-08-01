"use client";

import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";
import { MessageList } from "@/components/chat/message-list";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { useA2AStream, type UseA2AStreamResult } from "@/hooks/use-a2a-stream";
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
  className?: string;
  "data-testid"?: string;
}

/**
 * Self-contained chat panel.
 *
 * Renders:
 * - Empty state when no messages exist
 * - MessageList (streaming-aware) when messages exist
 * - ChatComposer at the bottom
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
  const backendConnected = Boolean(agentUrl ?? clientOpts?.baseUrl);

  function handleSend(text: string) {
    if (!backendConnected) return;
    chat.sendMessage(text);
  }

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
          />
        ) : (
          <MessageList
            messages={chat.messages}
            streamingText={chat.streamingText}
            isWaitingForResponse={chat.isWaitingForResponse}
            isThinking={chat.isThinking}
            isSlowResponse={chat.isSlowResponse}
            isVerySlowResponse={chat.isVerySlowResponse}
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
      {backendConnected && (
        <ChatComposer
          onSend={handleSend}
          onStop={chat.abort}
          isStreaming={isStreaming}
          placeholder={t("CHAT_PLACEHOLDER")}
        />
      )}
    </div>
  );
}
