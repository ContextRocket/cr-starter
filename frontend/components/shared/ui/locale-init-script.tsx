/**
 * Locale init script -- the no-flash locale bootstrap string.
 *
 * Rendered by the app/page.tsx static export redirect page. When a returning
 * visitor lands on "/" with a NEXT_LOCALE cookie set to a non-English locale,
 * this script redirects to "/{locale}/" before React hydrates -- eliminating
 * the double-redirect flash that would otherwise occur (static export always
 * defaults to "/en/").
 *
 * First-time visitors (no cookie) fall through to the <meta http-equiv="refresh">
 * tag which redirects to the default locale. The JS redirect fires faster than
 * the meta refresh when a cookie exists, so the cookie wins.
 *
 * The script is defensive (try/catch) and only fires on the root path ("/" or
 * "/index.html") so it does not interfere with locale-prefixed routes.
 */

export const LOCALE_NO_FLASH_SCRIPT = `(function(){try{var c=document.cookie.match(/NEXT_LOCALE=([^;]+)/);if(c&&c[1]!=="en"){var p=window.location.pathname;if(p==="/"||p==="/index.html"){window.location.replace("/"+c[1]+"/")}}}catch(e){}})();`;
