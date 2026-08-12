"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";
import { ArrowDownIcon } from "lucide-react";
import { CheckCircle2Icon, CircleDashedIcon } from "lucide-react";
import { StreamStatusStack } from "@/components/chat/stream-status-stack";
import { CitationPills } from "@/components/chat/citation-pills";
import { SuggestionPills } from "@/components/chat/suggestion-pills";
import { PolicyClassCard } from "@/components/chat/policy-class-card";
import type { ChatMessage } from "@/hooks/use-a2a-stream";
import type { FaithfulnessVerdict } from "@/lib/a2a-client";

// Approximate line threshold before showing the "More detail" expander.
// ~6 lines at ~80 chars each.
const LEAD_MAX_CHARS = 480;

interface MessageListProps {
  messages: ChatMessage[];
  streamingText?: string;
  isWaitingForResponse?: boolean;
  isThinking?: boolean;
  isSlowResponse?: boolean;
  isVerySlowResponse?: boolean;
  /**
   * Called when the user taps a suggestion pill.
   * Passed down from ChatPanel so the panel can sendMessage.
   */
  onSuggestionSelect?: (text: string) => void;
  /**
   * Link-opening mode forwarded to CitationPills.
   */
  linkMode?: "new-tab" | "preview";
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Strip/downgrade markdown headings inside a bubble.
 *
 * Rules from the contract:
 *   - h1-h6 (## headings) -> bold paragraph lead-ins.
 *   - List nesting is capped at one level (no deeply nested bullets).
 *   - Tables become simple line rows.
 *
 * This is deterministic structural normalization only; it does not modify
 * prose content.
 */
function normalizeHeadings(text: string): string {
  // Replace ATX headings (# Heading) with bold equivalents.
  return text.replace(/^#{1,6}\s+(.+)$/gm, "**$1**");
}

/**
 * Split message content into lead and detail sections.
 *
 * The lead is the first ~480 characters (roughly 6 lines of prose).
 * If the full content is shorter, detail is empty and the expander is not shown.
 * Splitting is done at a sentence or paragraph boundary to avoid mid-word cuts.
 */
function splitLeadDetail(text: string): { lead: string; detail: string } {
  if (text.length <= LEAD_MAX_CHARS) {
    return { lead: text, detail: "" };
  }

  // Find the last paragraph break or sentence end before the threshold.
  const candidate = text.slice(0, LEAD_MAX_CHARS);

  // Try paragraph break first.
  const paraIdx = candidate.lastIndexOf("\n\n");
  if (paraIdx > LEAD_MAX_CHARS * 0.4) {
    return {
      lead: text.slice(0, paraIdx).trim(),
      detail: text.slice(paraIdx).trim(),
    };
  }

  // Fall back to sentence boundary (. or ! or ?).
  // Use [\s\S] instead of dotAll /s flag for broad tsconfig compatibility.
  const sentenceMatch = candidate.match(/([\s\S]*[.!?])\s/);
  if (sentenceMatch && sentenceMatch[0].length > LEAD_MAX_CHARS * 0.3) {
    const idx = sentenceMatch[0].length;
    return {
      lead: text.slice(0, idx).trim(),
      detail: text.slice(idx).trim(),
    };
  }

  // No good boundary found: split at whitespace.
  const spaceIdx = candidate.lastIndexOf(" ");
  if (spaceIdx > 0) {
    return {
      lead: text.slice(0, spaceIdx).trim(),
      detail: text.slice(spaceIdx).trim(),
    };
  }

  // Last resort: hard cut.
  return { lead: candidate.trim(), detail: text.slice(LEAD_MAX_CHARS).trim() };
}

/**
 * Message list with:
 * - Blur-to-sharp entrance animation via CSS transitions (no framer-motion dep)
 * - Streaming color-to-final text transition with inline cursor
 * - Three-tier latency stack (thinking / waiting / slow)
 * - Lead-first bubble typography with "More detail" expander
 * - Suggestion pills below assistant messages (from platform metadata)
 * - Policy-class card below the answer (from platform metadata)
 * - Citation pills below assistant messages (deduped by document)
 * - Scroll-to-bottom FAB
 */
export function MessageList({
  messages,
  streamingText,
  isWaitingForResponse = false,
  isThinking = false,
  isSlowResponse = false,
  isVerySlowResponse = false,
  onSuggestionSelect,
  linkMode = "new-tab",
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
              onSuggestionSelect={onSuggestionSelect}
              linkMode={linkMode}
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
          aria-label={t("chat.scroll.to.bottom")}
          data-testid="scroll-to-bottom"
        >
          <ArrowDownIcon className="size-3.5" />
          {t("chat.scroll.to.bottom")}
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
  onSuggestionSelect?: (text: string) => void;
  linkMode?: "new-tab" | "preview";
}

function MessageBubble({
  message,
  streamingText,
  onSuggestionSelect,
  linkMode = "new-tab",
}: MessageBubbleProps) {
  const [expanded, setExpanded] = useState(false);
  const isUser = message.role === "user";
  const isStreaming = message.pending && !isUser;
  const rawText =
    isStreaming && streamingText !== undefined
      ? streamingText
      : message.content;

  // Apply heading normalization and lead/detail split for assistant messages only.
  const displayText = isUser ? rawText : normalizeHeadings(rawText);
  const { lead, detail } = isUser
    ? { lead: displayText, detail: "" }
    : splitLeadDetail(displayText);

  const hasDetail = detail.length > 0;
  const textToShow = hasDetail && !expanded ? lead : displayText;

  return (
    <div
      data-testid={`message-${message.role}`}
      className={cn(
        "flex w-full transition-all duration-300",
        // Blur-to-sharp entrance (CSS only -- no framer-motion required).
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
        // Assistant message: left-aligned, no bubble, lead-first rendering
        <div className="flex max-w-full flex-col gap-2 sm:max-w-[420px] md:max-w-[760px]">
          <div
            className={cn(
              "text-sm leading-[1.35] transition-colors duration-300",
              isStreaming ? "text-[#8e8e8e]" : "text-foreground",
            )}
          >
            {/* Render lead text (or full text when not truncated / expanded). */}
            <BubbleContent text={textToShow} />

            {isStreaming && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-[3px] animate-pulse rounded-full bg-[#8e8e8e] align-middle"
                data-testid="streaming-cursor"
              />
            )}
          </div>

          {/* "More detail" / "Less detail" expander */}
          {hasDetail && !isStreaming && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              data-testid="more-detail-toggle"
              className="self-start rounded-md px-1.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              {expanded ? t("chat.less.detail") : t("chat.more.detail")}
            </button>
          )}

          {/* Faithfulness / grounded indicator: quiet chip below answer */}
          {!isStreaming && message.faithfulness && (
            <GroundedChip verdict={message.faithfulness} />
          )}

          {/* Policy-class card: renders only when present in metadata */}
          {!isStreaming && message.policyClass && (
            <PolicyClassCard policyClass={message.policyClass} animate />
          )}

          {/* Citation pills: deduped by document */}
          {!isStreaming &&
            message.sourceRefs &&
            message.sourceRefs.length > 0 && (
              <CitationPills
                sourceRefs={message.sourceRefs}
                linkMode={linkMode}
              />
            )}

          {/* Suggestion pills: from platform metadata only, never prose-parsed */}
          {!isStreaming &&
            message.suggestions &&
            message.suggestions.length > 0 && (
              <SuggestionPills
                suggestions={message.suggestions}
                onSelect={(text) => onSuggestionSelect?.(text)}
                animate
              />
            )}
        </div>
      )}
    </div>
  );
}

// ── Grounded indicator chip ───────────────────────────────────────────────────

/**
 * Small quiet chip indicating whether the platform grounded this answer against
 * the corpus (platform faithfulness verdict).
 *
 * Renders only when the verdict is present and its state is known.
 * Unknown state or absent metadata = render nothing (defensive default).
 *
 * Tooltip/title shows the checked_claims count when it is greater than zero.
 */
function GroundedChip({
  verdict,
}: {
  verdict: FaithfulnessVerdict;
}): React.ReactElement | null {
  const { state, checked_claims } = verdict;

  const claimsTitle =
    checked_claims > 0
      ? `${checked_claims} ${t("chat.groundedClaimsChecked")}`
      : undefined;

  if (state === "grounded") {
    return (
      <span
        data-testid="grounded-chip"
        title={claimsTitle}
        className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
      >
        <CheckCircle2Icon className="size-3" aria-hidden />
        {t("chat.grounded")}
      </span>
    );
  }

  if (state === "ungrounded") {
    return (
      <span
        data-testid="grounded-chip"
        title={claimsTitle}
        className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
      >
        <CircleDashedIcon className="size-3" aria-hidden />
        {t("chat.ungrounded")}
      </span>
    );
  }

  // error state or any unknown state: render nothing.
  // A failed faithfulness check must NOT display as a partial verdict --
  // the platform could not determine grounding, so no signal is honest.
  return null;
}

// ── Bubble content renderer ───────────────────────────────────────────────────

/**
 * Renders the text content of an assistant bubble.
 *
 * Intentionally minimal: displays whitespace-preserving text with no
 * full markdown rendering engine (avoids adding a dependency for the template).
 * The heading-to-bold normalization is applied upstream in normalizeHeadings().
 *
 * Fork owners who need full markdown can swap this for react-markdown or
 * similar while keeping the lead/detail split and heading normalization.
 */
function BubbleContent({ text }: { text: string }) {
  if (!text) return null;
  return <span className="whitespace-pre-wrap break-words">{text}</span>;
}
