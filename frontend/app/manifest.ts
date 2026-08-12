/**
 * Next.js web app manifest route.
 * Served at /manifest.webmanifest (Next.js App Router convention).
 *
 * All identity fields read from site.config -- replace the placeholder
 * values there to brand the installed PWA experience.
 *
 * Adapted from context-rocket/frontend/app/manifest.ts.
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.companyName,
    short_name: siteConfig.companyName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#000000",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: siteConfig.assets.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: siteConfig.assets.icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: siteConfig.assets.icon192Maskable,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: siteConfig.assets.icon512Maskable,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
