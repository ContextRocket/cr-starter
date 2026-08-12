import { t } from "@/i18n/keys";

export const dynamic = "force-static";

/**
 * Operator-only users list page.
 *
 * In the standard SSR build, this checks the JWT cookie, verifies superuser
 * status, and lists users from the API. For static export, there is no auth
 * and no API — always show the forbidden message.
 */
export default function UsersPage() {
  return <Forbidden />;
}

function Forbidden() {
  return (
    <div
      className="flex items-center justify-center min-h-[40vh]"
      data-testid="dashboard-users-forbidden"
    >
      <p className="text-muted-foreground">{t("dashboard.users.forbidden")}</p>
    </div>
  );
}
