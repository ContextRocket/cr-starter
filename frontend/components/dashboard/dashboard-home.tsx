import Link from "next/link";
import { MessageSquare, User, Users } from "lucide-react";

import { t } from "@/i18n/keys";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

/**
 * Props describing what to render on the dashboard home.
 *
 * Extracted from the page so this component is pure/testable without
 * needing to mock cookies() or the OpenAPI client.
 */
export interface DashboardHomeProps {
  isOperator: boolean;
}

/**
 * Dashboard home content — the three-card grid (or two-card for non-operators).
 *
 * Rendered by the page server component after resolving the current user.
 */
export function DashboardHome({ isOperator }: DashboardHomeProps) {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="dashboard-cards"
    >
      <DashboardCard
        data-testid="dashboard-card-chat"
        icon={<MessageSquare className="h-6 w-6" />}
        title={t("DASHBOARD_CARD_CHAT_TITLE")}
        description={t("DASHBOARD_CARD_CHAT_DESCRIPTION")}
        action={
          <Link
            href="/chat"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("DASHBOARD_CARD_CHAT_ACTION")}
          </Link>
        }
      />

      <DashboardCard
        data-testid="dashboard-card-profile"
        icon={<User className="h-6 w-6" />}
        title={t("DASHBOARD_CARD_PROFILE_TITLE")}
        description={t("DASHBOARD_CARD_PROFILE_DESCRIPTION")}
        action={
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("DASHBOARD_CARD_PROFILE_ACTION")}
          </Link>
        }
      />

      {isOperator && (
        <DashboardCard
          data-testid="dashboard-card-users"
          icon={<Users className="h-6 w-6" />}
          title={t("DASHBOARD_CARD_USERS_TITLE")}
          description={t("DASHBOARD_CARD_USERS_DESCRIPTION")}
          action={
            <Link
              href="/dashboard/users"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("DASHBOARD_CARD_USERS_ACTION")}
            </Link>
          }
        />
      )}
    </div>
  );
}

/**
 * Guest prompt shown when there is no valid session or the user is a guest.
 */
export function GuestPrompt() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] p-8"
      data-testid="dashboard-guest-prompt"
    >
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("DASHBOARD_GUEST_PROMPT_TITLE")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("DASHBOARD_GUEST_PROMPT_DESCRIPTION")}
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("DASHBOARD_GUEST_PROMPT_ACTION")}
        </Link>
      </div>
    </div>
  );
}
