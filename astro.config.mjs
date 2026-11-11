import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import siteData from "./config/site.json" with { type: "json" };
import { blogPathAlias } from "./scripts/blog-path-alias.mjs";

const containerBase = process.env.CONTAINER_BASE?.trim() || undefined;

export default defineConfig({
  devToolbar: { enabled: false },
  base: containerBase,
  output: "static",
  trailingSlash: siteData.trailingSlash ?? "always",
  build: {
    format: "directory",
  },
  integrations: [react(), blogPathAlias()],
  server: {
    host: true,
    port: 3100,
    strictPort: true,
  },
  preview: {
    port: 3100,
    strictPort: true,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
