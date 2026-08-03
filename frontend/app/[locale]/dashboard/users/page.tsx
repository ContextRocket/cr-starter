import { cookies } from "next/headers";

import { usersCurrentUser, listUsers } from "@/app/clientService";
import { t } from "@/i18n/keys";

/**
 * Operator-only users list page.
 *
 * Shows a simple table: email, type (guest/registered), status (active/inactive).
 * No bulk actions. Redirects non-superusers to an honest "forbidden" message.
 */
export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return <Forbidden />;
  }

  const { data: me, error: meError } = await usersCurrentUser({
    headers: { Authorization: `Bearer ${token}` },
  });

  if (meError || !me || !me.is_superuser) {
    return <Forbidden />;
  }

  const { data, error } = await listUsers({
    query: { limit: 200 },
    headers: { Authorization: `Bearer ${token}` },
  });

  return (
    <div data-testid="dashboard-users-page">
      <h1 className="text-2xl font-bold mb-2">{t("DASHBOARD_USERS_TITLE")}</h1>
      <p className="text-muted-foreground mb-6">
        {t("DASHBOARD_USERS_DESCRIPTION")}
      </p>

      {error || !data ? (
        <p className="text-destructive">{t("ERROR_GENERIC")}</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">
                  {t("DASHBOARD_USERS_COL_EMAIL")}
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  {t("DASHBOARD_USERS_COL_TYPE")}
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  {t("DASHBOARD_USERS_COL_STATUS")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.is_guest
                      ? t("DASHBOARD_USERS_TYPE_GUEST")
                      : t("DASHBOARD_USERS_TYPE_REGISTERED")}
                  </td>
                  <td className="px-4 py-3">
                    {user.is_active
                      ? t("DASHBOARD_USERS_STATUS_ACTIVE")
                      : t("DASHBOARD_USERS_STATUS_INACTIVE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Forbidden() {
  return (
    <div
      className="flex items-center justify-center min-h-[40vh]"
      data-testid="dashboard-users-forbidden"
    >
      <p className="text-muted-foreground">{t("DASHBOARD_USERS_FORBIDDEN")}</p>
    </div>
  );
}
