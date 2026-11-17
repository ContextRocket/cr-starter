// Astro config for the chrome fragment build ONLY (run by
// scripts/build-chrome-fragment.mts). It compiles a single throwaway page that
// renders the real src/components/chrome/Navbar.astro so the pinned fragment
// is the component's own output, never a hand transcription. This config is
// not part of the site build; the site build uses the root astro.config.mjs.
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  srcDir: new URL("./src", import.meta.url).pathname,
  outDir: new URL("./dist", import.meta.url).pathname,
  build: {
    format: "directory",
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("../../src", import.meta.url).pathname,
      },
    },
  },
});
