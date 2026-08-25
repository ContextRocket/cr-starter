/**
 * Full-page chat route.
 *
 * Gated by NEXT_PUBLIC_CHAT_FAB_ENABLED (reusing the same flag family as the FAB).
 * When the flag is absent or false, renders an honest "not enabled" message.
 *
 * Chrome: the standard site brand header (the same one the navbar uses
 * across the site, LocaleSwitcher included) sits above the chat panel, so
 * the full-page chat surface carries the site's shared language control.
 */
import Image from "next/image";
import { ChatPanel } from "@/components/shared/chat/chat-panel";
import { LocaleSwitcher } from "@/i18n/locale-switcher";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";
import { siteConfig } from "@/config/site.config";

interface ChatPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);
  const agentUrl =
    siteConfig.chat.mode === "live" ? siteConfig.chat.agentUrl : "";
  const enabled = siteConfig.features.chatFab;

  if (!enabled) {
    return (
      <main
        className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center"
        data-testid="chat-page-disabled"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          {t("chat.connect.required.title")}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t("chat.connect.required.body")}
        </p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh flex-col bg-background" data-testid="chat-page">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 pt-6">
        <header className="flex items-center justify-between gap-4">
          <Image
            src={siteConfig.assets.logo}
            alt={siteConfig.companyName}
            width={200}
            height={77}
            className="h-12 w-auto rounded-sm"
            data-testid="chat-page-logo"
          />
          <LocaleSwitcher />
        </header>
      </div>
      <ChatPanel
        agentUrl={agentUrl}
        className="flex-1"
        data-testid="chat-page-panel"
      />
    </main>
  );
}
