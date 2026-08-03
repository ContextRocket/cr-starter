"use client";

import { Link, usePathname } from "@/i18n/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  usePageTitle,
  type BreadcrumbSegment,
} from "@/components/dashboard/breadcrumb-context";
import { t } from "@/i18n/keys";

interface DashboardBreadcrumbProps {
  pageTitle?: string;
}

/**
 * Build breadcrumb trail based on the current pathname.
 *
 * Examples:
 *   /dashboard   → Dashboard
 *   (other)      → Dashboard / <page title from context>
 */
export function DashboardBreadcrumb({ pageTitle }: DashboardBreadcrumbProps) {
  const pathname = usePathname();
  const { pageTitle: contextTitle, extraSegments } = usePageTitle();

  const crumbs = buildCrumbs(
    pathname,
    pageTitle ?? contextTitle,
    extraSegments,
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <span key={`${crumb.href}-${crumb.label}`} className="contents">
            {i > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
            <BreadcrumbItem>
              {i < crumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

interface Crumb {
  label: string;
  href: string;
}

function buildCrumbs(
  pathname: string,
  pageTitle?: string,
  extraSegments: BreadcrumbSegment[] = [],
): Crumb[] {
  const crumbs: Crumb[] = [{ label: t("NAV_DASHBOARD"), href: "/dashboard" }];

  if (pathname === "/dashboard") {
    return crumbs;
  }

  // Additional segments from page context
  if (pageTitle) {
    crumbs.push({ label: pageTitle, href: pathname });
  }

  for (const seg of extraSegments) {
    crumbs.push({ label: seg.label, href: seg.href ?? pathname });
  }

  return crumbs;
}
