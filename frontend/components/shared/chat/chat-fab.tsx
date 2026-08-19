"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircleIcon,
  XIcon,
  Maximize2Icon,
  Minimize2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n/keys";

import { ChatPanel } from "@/components/shared/chat/chat-panel";
import { BrandLogo } from "@/components/shared/sections/brand-logo";
import { useA2AStream } from "@/hooks/use-a2a-stream";
import { siteConfig } from "@/config/site.config";
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
  /** Override the site default and show the chat fullscreen as soon as it mounts. */
  fullscreenOnLoad?: boolean;
}

/**
 * Fixed-position FAB that opens a slide-over chat drawer.
 *
 * Gated by NEXT_PUBLIC_CHAT_FAB_ENABLED at the injection site (app/layout.tsx).
 * The FAB itself is always rendered when the component mounts -- the env gate
 * lives in the layout so server rendering can strip it entirely.
 *
 * Conversation state is hoisted HERE: one useA2AStream instance owns the
 * messages/thread/stream for both layouts (drawer and fullscreen), so the
 * expand/collapse toggle re-parents the SAME conversation instead of mounting
 * a fresh panel. Toggling never loses messages, the thread id, or an
 * in-flight stream.
 *
 * A11y:
 * - The closed drawer is `inert` and renders no panel content, so nothing
 *   inside it is focusable behind aria-hidden and the composer cannot steal
 *   focus on page load.
 * - Escape collapses fullscreen back to the drawer, or closes the drawer and
 *   returns focus to the FAB button. Escape events already handled by an
 *   inner dialog (e.g. the source sheet) are ignored via defaultPrevented.
 *
 * Link policy: defaults to siteConfig.chat.linkMode; in embed/iframe contexts
 * the consumer forces "new-tab" (see app/embed/page.tsx).
 *
 * Demo mode shows a small badge so static/canned behavior is clear to visitors.
 *
 * Shadow spec from the design reference (--lds-shadow-fab):
 *   0 4px 12px rgba(11,11,15,0.15), 0 8px 24px rgba(11,11,15,0.10)
 */
export function ChatFab({
  agentUrl,
  clientOpts,
  welcomeTitle,
  welcomeSubtitle,
  fullscreenOnLoad,
}: ChatFabProps) {
  const initialFullscreen =
    fullscreenOnLoad ?? siteConfig.chat.fullscreenOnLoad;
  const [open, setOpen] = useState(initialFullscreen);
  const [fullscreen, setFullscreen] = useState(initialFullscreen);
  const fabButtonRef = useRef<HTMLButtonElement>(null);

  const isDemoMode = siteConfig.chat.mode === "demo";
  const effectiveClientOpts = clientOpts;

  // Hoisted conversation state: shared by the drawer and fullscreen panels.
  const chat = useA2AStream({
    ...effectiveClientOpts,
    baseUrl: agentUrl ?? clientOpts?.baseUrl ?? "",
  });

  // Escape: collapse fullscreen first, then close the drawer (with focus
  // return to the FAB button). Inner dialogs (source sheet) preventDefault
  // on the Escape they consume, so we skip those.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (fullscreen) {
        setFullscreen(false);
      } else {
        setOpen(false);
        fabButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, fullscreen]);

  return (
    <>
      {/* FAB button */}
      <button
        ref={fabButtonRef}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? t("chat.close") : t("chat.open")}
        aria-expanded={open}
        data-testid="chat-fab-button"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground",
          "shadow-[0_4px_12px_rgba(11,11,15,0.15),0_8px_24px_rgba(11,11,15,0.10)]",
          "transition-all duration-200 hover:scale-105 hover:opacity-90",
          // Hide the FAB button itself when fullscreen is active -- the collapse
          // button inside the fullscreen panel replaces it.
          fullscreen && open && "pointer-events-none opacity-0",
        )}
      >
        {open ? (
          <XIcon className="size-6" aria-hidden />
        ) : (
          <MessageCircleIcon className="size-6" aria-hidden />
        )}
      </button>

      {/* Fullscreen overlay */}
      {fullscreen && open && (
        <div
          data-testid="chat-fab-fullscreen"
          role="dialog"
          aria-modal="true"
          aria-label={siteConfig.companyName}
          className="fixed inset-0 z-[60] flex flex-col bg-background"
        >
          {/* Fullscreen header with collapse button */}
          <div className="flex min-h-12 items-center justify-between border-b border-border/60 px-4 py-2.5">
            <span data-testid="chat-fab-fullscreen-brand">
              <BrandLogo
                logo={{
                  src: siteConfig.assets.logo,
                  srcDark: siteConfig.assets.logoDark,
                  alt: siteConfig.companyName,
                  variant: "icon",
                  width: 20,
                  height: 20,
                }}
                brandName={siteConfig.companyName}
                className="size-5"
              />
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFullscreen(false)}
                aria-label={t("chat.collapse")}
                data-testid="chat-fab-collapse"
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Minimize2Icon className="size-4" aria-hidden />
              </button>
              <button
                onClick={() => {
                  setFullscreen(false);
                  setOpen(false);
                  fabButtonRef.current?.focus();
                }}
                aria-label={t("chat.close")}
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                data-testid="chat-fab-fullscreen-close"
              >
                <XIcon className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          <ChatPanel
            chat={chat}
            agentUrl={agentUrl}
            clientOpts={effectiveClientOpts}
            welcomeTitle={welcomeTitle}
            welcomeSubtitle={welcomeSubtitle}
            className="flex-1"
            data-testid="chat-fab-fullscreen-panel"
          />
        </div>
      )}

      {/* Slide-over drawer (non-fullscreen) */}
      {!fullscreen && (
        <div
          data-testid="chat-fab-drawer"
          aria-hidden={!open}
          inert={!open}
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
          {/* Drawer content renders only while open: the closed drawer keeps
              no focusable content and the composer cannot autofocus on page
              load. Conversation state lives in the hoisted hook above, so
              closing and reopening the drawer preserves the thread. */}
          {open && (
            <>
              {/* Drawer header keeps the brand visible next to its controls. */}
              <div className="flex min-h-12 items-center justify-between border-b border-border/40 px-4 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <BrandLogo
                    logo={{
                      src: siteConfig.assets.logo,
                      srcDark: siteConfig.assets.logoDark,
                      alt: siteConfig.companyName,
                      variant: "icon",
                      width: 20,
                      height: 20,
                    }}
                    brandName={siteConfig.companyName}
                    className="size-5"
                  />
                  {isDemoMode && (
                    <span
                      data-testid="chat-fab-demo-badge"
                      className="inline-flex shrink-0 items-center rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary/70"
                    >
                      {t("chat.demo.badge")}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setFullscreen(true)}
                  aria-label={t("chat.expand")}
                  data-testid="chat-fab-expand"
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Maximize2Icon className="size-3.5" aria-hidden />
                </button>
              </div>

              <ChatPanel
                chat={chat}
                agentUrl={agentUrl}
                clientOpts={effectiveClientOpts}
                welcomeTitle={welcomeTitle}
                welcomeSubtitle={welcomeSubtitle}
                className="flex-1"
                data-testid="chat-fab-panel"
              />
            </>
          )}
        </div>
      )}

      {/* Backdrop (mobile) */}
      {open && !fullscreen && (
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
