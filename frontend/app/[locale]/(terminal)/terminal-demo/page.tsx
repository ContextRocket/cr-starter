/**
 * /terminal-demo — proof that the inner/terminal surface renders.
 *
 * Lives under the (terminal) route group, so the wrapper layout sets
 * data-surface="terminal": the heading, card, and button below pick up the
 * mono face and 0-radius overrides from app/globals.css. This is a build /
 * review witness that both surfaces compile and render from one token
 * foundation — it is not part of the public site (noindex).
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { setLocale, t } from "@/i18n/keys";
import { resolveLocale } from "@/i18n/messages";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function TerminalDemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setLocale(locale);

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">
        {t("preview.surface.terminal.heading")}
      </h1>
      <p className="mt-3 text-text-secondary">
        {t("preview.surface.terminal.body")}
      </p>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>{t("preview.surface.terminal.cardTitle")}</CardTitle>
          <CardDescription>
            {t("preview.surface.terminal.cardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>{t("preview.surface.terminal.action")}</Button>
        </CardContent>
      </Card>
    </main>
  );
}
