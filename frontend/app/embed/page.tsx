/**
 * /embed -- chromeless chat page for the embeddable widget iframe.
 *
 * Rendered inside the widget.js iframe. No site navigation, no footer,
 * no cookie banner -- just the chat panel, sized to fill the iframe.
 *
 * Config arrives via URL search params (agent-url, site-key, title).
 * The param names and parsing logic match lib/widget-config.ts.
 *
 * UNCONFIGURED STATE: when no agent-url param is present, the chat panel
 * shows the existing CHAT_CONNECT_REQUIRED prompt (reuses the same empty
 * state the full-page /chat route and the FAB show). This is the honest
 * "not yet wired up" state for developers iterating on the widget before
 * they have a ContextRocket agent URL configured.
 *
 * SECURITY: search params are user-controlled and may be set by the host
 * page embedding the widget. The agent-url value is passed to the A2A
 * client -- no further server-side use. site-key is forwarded to
 * ContextRocket as a public credential (never secret). Do not store or
 * log search param values server-side.
 *
 * LAYOUT: this page intentionally has no layout wrapping (no layout.tsx
 * in this directory), so the root layout's ChatFab and CookieConsentBanner
 * are not rendered inside the iframe. The embed page IS wrapped by the
 * root layout, but the FAB is guarded by NEXT_PUBLIC_CHAT_FAB_ENABLED
 * (which should be unset or false for embed deployments where the FAB is
 * replaced by the widget itself). The cookie consent banner is suppressed
 * here via a data attribute checked at the root layout level -- see note
 * below if that becomes necessary for your deployment.
 */

import { parseWidgetConfig } from "@/lib/widget-config";
import { ChatPanel } from "@/components/chat/chat-panel";
import { t } from "@/i18n/keys";

interface EmbedPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Chromeless chat page served inside the widget iframe.
 *
 * This is a Server Component. It reads config from searchParams and
 * passes the typed values to the client ChatPanel.
 */
export default async function EmbedPage({ searchParams }: EmbedPageProps) {
  const params = await searchParams;

  // Adapt the plain record to the .get() interface parseWidgetConfig expects.
  const adaptor = {
    get(key: string): string | null {
      const val = params[key];
      if (Array.isArray(val)) return val[0] ?? null;
      return val ?? null;
    },
  };

  const config = parseWidgetConfig(adaptor);

  if (!config.agentUrl) {
    // Honest unconfigured state -- mirrors /chat when NEXT_PUBLIC_CR_AGENT_URL
    // is not set. Reuses the CHAT_CONNECT_REQUIRED_* i18n keys.
    return (
      <main
        className="flex h-dvh flex-col items-center justify-center bg-background px-4 text-center"
        data-testid="embed-page-unconfigured"
      >
        <h1 className="text-xl font-semibold text-foreground">
          {t("CHAT_CONNECT_REQUIRED_TITLE")}
        </h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          {t("CHAT_CONNECT_REQUIRED_BODY")}
        </p>
      </main>
    );
  }

  return (
    <main
      className="flex h-dvh flex-col bg-background"
      data-testid="embed-page"
    >
      <ChatPanel
        agentUrl={config.agentUrl}
        welcomeTitle={config.title ?? undefined}
        className="flex-1"
        data-testid="embed-chat-panel"
      />
    </main>
  );
}
