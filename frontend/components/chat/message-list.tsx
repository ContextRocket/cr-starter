"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";
import { ArrowDownIcon } from "lucide-react";
import { StreamStatusStack } from "@/components/chat/stream-status-stack";
import { CitationPills } from "@/components/chat/citation-pills";
import type { ChatMessage } from "@/hooks/use-a2a-stream";

interface MessageListProps {
  messages: ChatMessage[];
  streamingText?: string;
  isWaitingForResponse?: boolean;
  isThinking?: boolean;
  isSlowResponse?: boolean;
  isVerySlowResponse?: boolean;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Message list with:
 * - Blur-to-sharp entrance animation via CSS transitions (no framer-motion dep)
 * - Streaming color-to-final text transition with inline cursor
 * - Three-tier latency stack (thinking / waiting / slow)
 * - Citation pills below assistant messages
 * - Scroll-to-bottom FAB
 */
export function MessageList({
  messages,
  streamingText,
  isWaitingForResponse = false,
  isThinking = false,
  isSlowResponse = false,
  isVerySlowResponse = false,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  // Auto-scroll when new content arrives and we are already at bottom.
  useEffect(() => {
    if (isAtBottom) {
      // scrollIntoView is not available in jsdom; guard defensively.
      if (
        bottomRef.current &&
        typeof bottomRef.current.scrollIntoView === "function"
      ) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setHasUnread(true);
    }
  }, [messages, streamingText, isAtBottom]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom);
    if (atBottom) setHasUnread(false);
  }

  function scrollToBottom() {
    if (
      bottomRef.current &&
      typeof bottomRef.current.scrollIntoView === "function"
    ) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setHasUnread(false);
  }

  const showStreamStatus =
    (isThinking || isWaitingForResponse) && messages.some((m) => m.pending);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        className="absolute inset-0 overflow-y-auto"
        data-testid="message-list"
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-2 pt-6 pb-8 md:gap-4 md:px-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              streamingText={message.pending ? streamingText : undefined}
            />
          ))}

          {showStreamStatus && (
            <div className="pl-0">
              <StreamStatusStack
                isThinking={isThinking}
                isWaitingForResponse={isWaitingForResponse}
                isSlowResponse={isSlowResponse}
                isVerySlowResponse={isVerySlowResponse}
                hasStreamingText={!!streamingText}
              />
            </div>
          )}

          <div ref={bottomRef} className="h-1" />
        </div>
      </div>

      {!isAtBottom && hasUnread && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-md transition-opacity hover:opacity-80"
          aria-label={t("CHAT_SCROLL_TO_BOTTOM")}
          data-testid="scroll-to-bottom"
        >
          <ArrowDownIcon className="size-3.5" />
          {t("CHAT_SCROLL_TO_BOTTOM")}
        </button>
      )}
    </div>
  );
}

// ── Individual message bubble ─────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage;
  /** Provided only for the pending assistant message during streaming. */
  streamingText?: string;
}

function MessageBubble({ message, streamingText }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isStreaming = message.pending && !isUser;
  const displayText =
    isStreaming && streamingText !== undefined
      ? streamingText
      : message.content;

  return (
    <div
      data-testid={`message-${message.role}`}
      className={cn(
        "flex w-full transition-all duration-300",
        // Blur-to-sharp entrance (CSS only — no framer-motion required).
        "animate-in fade-in slide-in-from-bottom-2",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {isUser ? (
        // User bubble: right-aligned, brand tint, tail on bottom-right
        <div className="flex max-w-[75%] flex-col items-end gap-1">
          <div className="rounded-[12px_12px_0_12px] bg-[#e7f2ff] px-3 py-2 text-sm leading-[1.35] whitespace-pre-wrap text-foreground">
            {displayText}
          </div>
          <span className="pr-0.5 text-[12px] font-semibold text-[#666666]">
            {formatTimestamp(message.createdAt)}
          </span>
        </div>
      ) : (
        // Assistant message: left-aligned, no bubble, markdown-rendered
        <div className="flex max-w-full flex-col gap-2 sm:max-w-[420px] md:max-w-[760px]">
          <div
            className={cn(
              "text-sm leading-[1.35] transition-colors duration-300",
              isStreaming ? "text-[#8e8e8e]" : "text-foreground",
            )}
          >
            {displayText || null}
            {isStreaming && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-[3px] animate-pulse rounded-full bg-[#8e8e8e] align-middle"
                data-testid="streaming-cursor"
              />
            )}
          </div>

          {!isStreaming &&
            message.sourceRefs &&
            message.sourceRefs.length > 0 && (
              <CitationPills sourceRefs={message.sourceRefs} />
            )}
        </div>
      )}
    </div>
  );
}
