/**
 * Whether a local navigation href represents the current route or one of its
 * nested pages. Fragment links are in-page actions and are never page-current.
 */
export function isCurrentNavigationLink(
  currentPath: string,
  href: string,
): boolean {
  if (!href.startsWith("/") || href.includes("#")) return false;

  const normalizePath = (value: string) => {
    const pathname = value.split(/[?#]/, 1)[0];
    return pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
  };

  const current = normalizePath(currentPath);
  const target = normalizePath(href);
  return current === target || (target !== "/" && current.startsWith(`${target}/`));
}
