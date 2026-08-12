import { Link } from "@/i18n/navigation";
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
        title={t("dashboard.card.chat.title")}
        description={t("dashboard.card.chat.description")}
        action={
          <Link
            href="/chat"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("dashboard.card.chat.action")}
          </Link>
        }
      />

      <DashboardCard
        data-testid="dashboard-card-profile"
        icon={<User className="h-6 w-6" />}
        title={t("dashboard.card.profile.title")}
        description={t("dashboard.card.profile.description")}
        action={
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("dashboard.card.profile.action")}
          </Link>
        }
      />

      {isOperator && (
        <DashboardCard
          data-testid="dashboard-card-users"
          icon={<Users className="h-6 w-6" />}
          title={t("dashboard.card.users.title")}
          description={t("dashboard.card.users.description")}
          action={
            <Link
              href="/dashboard/users"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("dashboard.card.users.action")}
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
          {t("dashboard.guest.prompt.title")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("dashboard.guest.prompt.description")}
        </p>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("dashboard.guest.prompt.action")}
        </Link>
      </div>
    </div>
  );
}
