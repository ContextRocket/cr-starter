/**
 * modules/dev -- de (dev surface, carved from app/).
 */

export const devDe = {
  dev: {
    notice: {
      label: "Hinweis für Entwickler:",
      dismiss: "Entwicklerhinweis ausblenden",
    },
    siteConfigUrlWarning:
      "Das Feld siteUrl in site.config.ts verweist noch auf contextrocket.com. Ersetze es vor der Veröffentlichung durch deine Produktionsdomain.",
  },
} as const;
