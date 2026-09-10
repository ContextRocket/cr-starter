/**
 * modules/dev -- en (dev surface, carved from app/).
 */

export const devEn = {
  dev: {
    notice: {
      label: "Developer notice:",
      dismiss: "Dismiss developer notice",
    },
    siteConfigUrlWarning:
      "siteUrl in site.config.ts still points at contextrocket.com. Replace it with your production domain before going live.",
  },
} as const;
