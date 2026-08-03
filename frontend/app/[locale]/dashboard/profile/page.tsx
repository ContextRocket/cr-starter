import { t } from "@/i18n/keys";

/**
 * Profile & settings placeholder page.
 *
 * User profile editing (email, password, locale) is surfaced here.
 * The fastapi-users PATCH /users/me endpoint handles updates.
 *
 * This is a stub page; a full profile form is a follow-up lane.
 */
export default function ProfilePage() {
  return (
    <div data-testid="dashboard-profile-page">
      <h1 className="text-2xl font-bold mb-2">
        {t("DASHBOARD_PROFILE_TITLE")}
      </h1>
      <p className="text-muted-foreground">{t("DASHBOARD_SUBTITLE")}</p>
    </div>
  );
}
