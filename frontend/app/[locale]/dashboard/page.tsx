import { GuestPrompt } from "@/components/dashboard/dashboard-home";

export const dynamic = "force-static";

/**
 * Dashboard home page — locale-prefixed.
 *
 * In the standard SSR build, this resolves the current user from the JWT
 * cookie and delegates to DashboardHome or GuestPrompt. For static export,
 * cookies() is not available at build time — always render GuestPrompt.
 */
export default function DashboardPage() {
  return <GuestPrompt />;
}
