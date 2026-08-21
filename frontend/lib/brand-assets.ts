/**
 * Resolve the small brand mark used in the ChatFab header.
 *
 * A fork's main logo is often a wordmark (or a responsive light/dark pair),
 * while the ChatFab needs a square mark that remains legible at 20px. The
 * optional `chatFabIcon` fields keep those concerns separate without forcing
 * every fork to add another component. When omitted, the starter falls back
 * to the normal logo for backwards compatibility.
 */

export interface ChatFabLogoAssets {
  src: string;
  srcDark?: string;
}

interface BrandAssets {
  logo: string;
  logoDark?: string;
  chatFabIcon?: string;
  chatFabIconDark?: string;
}

export function getChatFabLogoAssets(assets: BrandAssets): ChatFabLogoAssets {
  const src = assets.chatFabIcon ?? assets.logo;

  return {
    src,
    // A single square icon is intentionally valid for both themes. A fork
    // can provide a dark-specific variant when its brand needs one.
    srcDark: assets.chatFabIconDark ?? assets.chatFabIcon ?? assets.logoDark,
  };
}
