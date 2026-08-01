"use client";

import { useState } from "react";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";
import { ChatPanel } from "@/components/chat/chat-panel";
import type { A2AClientOptions } from "@/lib/a2a-client";

interface ChatFabProps {
  /** A2A agent base URL. When absent the panel shows the connect prompt. */
  agentUrl?: string;
  /** A2AClientOptions forwarded to the chat panel. */
  clientOpts?: Partial<A2AClientOptions>;
  /** Welcome title inside the drawer. */
  welcomeTitle?: string;
  /** Welcome subtitle inside the drawer. */
  welcomeSubtitle?: string;
}

/**
 * Fixed-position FAB that opens a slide-over chat drawer.
 *
 * Gated by NEXT_PUBLIC_CHAT_FAB_ENABLED at the injection site (app/layout.tsx).
 * The FAB itself is always rendered when the component mounts — the env gate
 * lives in the layout so server rendering can strip it entirely.
 *
 * Shadow spec from the design reference (--lds-shadow-fab):
 *   0 4px 12px rgba(11,11,15,0.15), 0 8px 24px rgba(11,11,15,0.10)
 */
export function ChatFab({
  agentUrl,
  clientOpts,
  welcomeTitle,
  welcomeSubtitle,
}: ChatFabProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? t("CHAT_CLOSE") : t("CHAT_OPEN")}
        aria-expanded={open}
        data-testid="chat-fab-button"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-[0_4px_12px_rgba(11,11,15,0.15),0_8px_24px_rgba(11,11,15,0.10)]",
          "transition-all duration-200 hover:scale-105 hover:opacity-90",
        )}
      >
        {open ? (
          <XIcon className="size-6" aria-hidden />
        ) : (
          <MessageCircleIcon className="size-6" aria-hidden />
        )}
      </button>

      {/* Slide-over drawer */}
      <div
        data-testid="chat-fab-drawer"
        aria-hidden={!open}
        className={cn(
          "fixed bottom-24 right-6 z-40 flex flex-col",
          "w-[calc(100vw-48px)] max-w-md overflow-hidden",
          "rounded-2xl border border-border/60 bg-background",
          "shadow-[0_32px_80px_rgba(15,23,42,0.28)]",
          "transition-all duration-300",
          open
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-4 opacity-0 pointer-events-none",
        )}
        style={{ height: "min(600px, calc(100dvh - 160px))" }}
      >
        <ChatPanel
          agentUrl={agentUrl}
          clientOpts={clientOpts}
          welcomeTitle={welcomeTitle}
          welcomeSubtitle={welcomeSubtitle}
          className="h-full"
          data-testid="chat-fab-panel"
        />
      </div>

      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
          data-testid="chat-fab-backdrop"
        />
      )}
    </>
  );
}
