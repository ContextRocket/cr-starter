import { siteConfig } from "@/config/site.config";

/** PWA web app manifest at /manifest.webmanifest. */
export async function GET() {
  const manifest = {
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
    ].filter((icon) => Boolean(icon.src)),
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
