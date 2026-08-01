/**
 * Full-page chat route.
 *
 * Gated by NEXT_PUBLIC_CHAT_FAB_ENABLED (reusing the same flag family as the FAB).
 * When the flag is absent or false, renders an honest "not enabled" message.
 */
import { ChatPanel } from "@/components/chat/chat-panel";
import { t } from "@/i18n/keys";

export default function ChatPage() {
  const agentUrl = process.env.NEXT_PUBLIC_CR_AGENT_URL;
  const enabled = process.env.NEXT_PUBLIC_CHAT_FAB_ENABLED === "true";

  if (!enabled) {
    return (
      <main
        className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center"
        data-testid="chat-page-disabled"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          {t("CHAT_CONNECT_REQUIRED_TITLE")}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t("CHAT_CONNECT_REQUIRED_BODY")}
        </p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh flex-col bg-background" data-testid="chat-page">
      <ChatPanel
        agentUrl={agentUrl}
        className="flex-1"
        data-testid="chat-page-panel"
      />
    </main>
  );
}
