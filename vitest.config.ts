import { getViteConfig } from "astro/config";

// `getViteConfig` gives the test runner Astro's plugin chain, so a `.astro`
// component can be rendered in-process with `experimental_AstroContainer`
// instead of running a whole site build per assertion.
//
// Renderer behaviour belongs here, tested against the component. The one thing
// a component render cannot prove — archive bytes, schema validation, mount and
// receipt — lives in `*.build.test.ts` and runs through `pnpm test:build`, so
// the default suite stays seconds rather than minutes.
export default getViteConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "scratchpad/**",
      "**/*.build.test.ts",
    ],
  },
});
