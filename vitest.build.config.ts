import { getViteConfig } from "astro/config";

// The full-build gate. Each case here runs a real Astro build, so it is the
// opposite of the default suite: slow, few, and only for what a component
// render cannot prove (archive bytes, schema validation, mount, receipt).
//
// Run with `pnpm test:build` at release. It is deliberately not part of
// `pnpm test` or `pnpm verify`.
export default getViteConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.build.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "scratchpad/**"],
    testTimeout: 600000,
    hookTimeout: 600000,
  },
});
