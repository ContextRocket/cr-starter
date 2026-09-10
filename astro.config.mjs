import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { blogPathAlias } from "./scripts/blog-path-alias.mjs";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
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
