/**
 * Map crawled font stacks to the closest Google Font we can load in Brand Lab.
 */
export const GOOGLE_FONT_MATCHES = {
  // exact / common webfonts
  Lato: "Lato",
  Inter: "Inter",
  Roboto: "Roboto",
  "Open Sans": "Open Sans",
  Montserrat: "Montserrat",
  Poppins: "Poppins",
  Nunito: "Nunito",
  "Nunito Sans": "Nunito Sans",
  Raleway: "Raleway",
  "Work Sans": "Work Sans",
  "DM Sans": "DM Sans",
  Manrope: "Manrope",
  Outfit: "Outfit",
  Quicksand: "Quicksand",
  "Source Sans Pro": "Source Sans 3",
  "Source Sans 3": "Source Sans 3",
  // system / licensed → closest Google stand-in
  "Avenir Next": "Nunito Sans",
  Avenir: "Nunito Sans",
  "Proxima Nova": "Montserrat",
  "Proxima Nova Soft": "Nunito Sans",
  Bryant: "Quicksand",
  "Segoe UI": "Inter",
  "Helvetica Neue": "Inter",
  Helvetica: "Inter",
  Arial: "Inter",
  Geist: "Inter",
  GeistSans: "Inter",
  "Inter Variable": "Inter",
  "sohne-var": "Inter",
  NotionInter: "Inter",
  Sohne: "Inter",
  "SF Pro": "Inter",
  "SF Pro Text": "Inter",
};

export function primaryFamilyFromStack(stack) {
  if (!stack) return null;
  const first = String(stack)
    .split(",")[0]
    .replace(/["']/g, "")
    .trim();
  return first || null;
}

export function matchGoogleFont(stackOrFamily) {
  const family = primaryFamilyFromStack(stackOrFamily);
  if (!family) return { requested: null, google: "Inter", fallback: true };
  if (GOOGLE_FONT_MATCHES[family]) {
    return {
      requested: family,
      google: GOOGLE_FONT_MATCHES[family],
      fallback: GOOGLE_FONT_MATCHES[family] !== family,
    };
  }
  // case-insensitive
  const hit = Object.keys(GOOGLE_FONT_MATCHES).find(
    (k) => k.toLowerCase() === family.toLowerCase(),
  );
  if (hit) {
    return {
      requested: family,
      google: GOOGLE_FONT_MATCHES[hit],
      fallback: GOOGLE_FONT_MATCHES[hit].toLowerCase() !== family.toLowerCase(),
    };
  }
  return { requested: family, google: "Inter", fallback: true };
}
