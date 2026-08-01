import { cookies } from "next/headers";

import { usersCurrentUser } from "@/app/clientService";
import {
  DashboardHome,
  GuestPrompt,
} from "@/components/dashboard/dashboard-home";

/**
 * Dashboard home page (server component).
 *
 * Resolves the current user from the cookie-stored JWT, then delegates
 * rendering to pure client-friendly components (DashboardHome / GuestPrompt)
 * so those components are testable without mocking next/headers or fetch.
 *
 * - No token, API error, or guest user -> GuestPrompt
 * - Registered non-superuser -> two cards (chat + profile)
 * - Superuser (is_superuser=true) -> three cards (chat + profile + users)
 */
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return <GuestPrompt />;
  }

  const { data: me, error } = await usersCurrentUser({
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error || !me || me.is_guest) {
    return <GuestPrompt />;
  }

  return <DashboardHome isOperator={Boolean(me.is_superuser)} />;
}
