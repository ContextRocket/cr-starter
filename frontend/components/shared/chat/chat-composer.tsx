"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/i18n/locale-provider";


interface ChatComposerProps {
  onSend: (text: string) => void;
  onStop?: () => void;
  /** When true, a streaming turn is in progress. */
  isStreaming: boolean;
  placeholder?: string;
}

/**
 * Two-row chat composer:
 * - Row 1: auto-resizing textarea (min 44px, max 200px)
 * - Row 2: send/stop button (right-aligned)
 *
 * Enter sends; Shift+Enter inserts newline. Auto-focuses on mount.
 */
export function ChatComposer({
  onSend,
  onStop,
  isStreaming,
  placeholder,
}: ChatComposerProps) {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "44px";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
  }, [input]);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  }, [input, isStreaming, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isStreaming && onStop) {
        onStop();
      } else {
        handleSend();
      }
    }
  };

  const canSend = input.trim().length > 0 && !isStreaming;

  return (
    <div className="mx-auto w-full max-w-4xl px-2 pb-3 pt-2 md:px-4 md:pb-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isStreaming && onStop) {
            onStop();
          } else {
            handleSend();
          }
        }}
        className="rounded-[12px] bg-muted shadow-sm"
        data-testid="chat-composer"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? t("chat.placeholder")}
          disabled={false}
          rows={1}
          className={cn(
            "w-full resize-none overflow-hidden rounded-t-[12px] border-0 bg-transparent px-3 pt-3 pb-1",
            "text-sm leading-[1.35] text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-0",
          )}
          style={{ minHeight: "44px", maxHeight: "200px" }}
          aria-label={placeholder ?? t("chat.placeholder")}
          data-testid="chat-composer-input"
        />
        <div className="flex items-center justify-end px-2 pb-2">
          <button
            type="submit"
            disabled={!isStreaming && !canSend}
            aria-label={isStreaming ? t("chat.stop") : t("chat.send")}
            data-testid="chat-send-button"
            className={cn(
              "flex size-11 items-center justify-center rounded-full transition-colors",
              isStreaming
                ? "bg-foreground text-background hover:opacity-80"
                : canSend
                  ? "bg-foreground text-background hover:opacity-80"
                  : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed",
            )}
          >
            {isStreaming ? (
              <SquareIcon className="size-4 fill-current" aria-hidden />
            ) : (
              <ArrowUpIcon className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
