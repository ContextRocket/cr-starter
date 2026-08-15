import type { NavLinkConfig } from "@/company.config";
import { siteConfig } from "@/site.config";

/**
 * Pure visibility predicate for a site-chrome nav/footer link.
 *
 * Two gates, evaluated together:
 *
 *  1. `featureFlag` — the link is dropped when its named siteConfig.features
 *     flag is off (e.g. the Blog link when the blog surface is disabled).
 *
 *  2. `appOnly` — a link into the app/auth surface (e.g. Dashboard). App links
 *     are AUTH-GATED: they render ONLY for an authenticated viewer. A guest (or
 *     the static/public render, where auth cannot be determined) NEVER sees an
 *     app link — so no fork's default/public nav ever shows "Dashboard". This
 *     fails CLOSED: if `isGuest` is unknown, the caller passes `isGuest: true`
 *     and app links are hidden. `showAppLinks` is an additional fork-level
 *     opt-out (a content/personal fork sets it false to drop app links for
 *     everyone), but auth-gating is the PRIMARY rule: `appOnly && isGuest` ⇒
 *     hidden.
 *
 *  3. `guestOnly` — a link shown ONLY to unauthenticated viewers (e.g. Login,
 *     Sign Up), and hidden for authenticated users. Like `appOnly`, it is
 *     dropped entirely if `showAppLinks` is false.
 *
 * @param link          the config entry under test
 * @param isGuest       true when the viewer is a guest / unauthenticated (or
 *                      auth is unknown → fail closed to guest). App links are
 *                      hidden in this case.
 * @param showAppLinks  fork-level opt-out for app links (default true). When
 *                      false, app links are hidden even for authenticated users.
 */
export function isChromeLinkVisible(
  link: NavLinkConfig,
  isGuest: boolean,
  showAppLinks: boolean = true,
): boolean {
  if (link.featureFlag && !siteConfig.features[link.featureFlag]) return false;
  if (link.appOnly) {
    // Auth-gate first (primary rule): guests / unknown-auth never see app links.
    if (isGuest) return false;
    // Fork-level opt-out: a content/personal fork drops app links for everyone.
    if (!showAppLinks) return false;
  }
  if (link.guestOnly) {
    if (!isGuest) return false;
    if (!showAppLinks) return false;
  }
  return true;
}
