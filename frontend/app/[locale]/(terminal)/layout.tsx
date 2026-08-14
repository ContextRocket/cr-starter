/**
 * Terminal route-group layout — flips the surface split (Layer 2).
 *
 * Route groups in parentheses do NOT change the URL, so pages under
 * app/[locale]/(terminal)/ keep their normal path (e.g. /terminal-demo)
 * while rendering inside the inner/terminal surface: mono face + square
 * corners, driven by `data-surface="terminal"` overriding the marketing
 * default set on <body> in app/[locale]/layout.tsx.
 *
 * A derived product (e.g. ContextRocket) moves its app/auth/probe route
 * groups under a wrapper like this so those surfaces read terminal while
 * the marketing pages stay on the default surface — one token foundation,
 * switched per route-group.
 */
export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-surface="terminal">{children}</div>;
}
