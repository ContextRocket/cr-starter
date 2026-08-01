import { type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  "data-testid"?: string;
}

/**
 * Reusable card for the dashboard home grid.
 *
 * Keeps the three-card layout (chat, profile, users) thin and consistent.
 * The icon, title, description, and action are injected by the page so this
 * component has no routing or i18n dependencies of its own.
 */
export function DashboardCard({
  icon,
  title,
  description,
  action,
  "data-testid": testId,
}: DashboardCardProps) {
  return (
    <Card data-testid={testId}>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="text-primary">{icon}</div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
