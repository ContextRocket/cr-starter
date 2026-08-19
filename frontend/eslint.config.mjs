import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".next-*/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "lib/openapi-client/**",
      "scripts/**",
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
      "scratchpad/**",
      "../scratchpad/**",
      "public/embed/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-empty-object-type": "off",
      // Underscore-prefixed args/vars are a deliberate "intentionally unused"
      // signal (e.g. server-action stubs that must keep the React signature).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // CommonJS config files (root-level *.js and *.cjs)
  {
    files: ["*.js", "*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "commonjs",
    },
    rules: {
      // CommonJS scripts legitimately use require(); the no-require-imports
      // rule targets TS/ESM modules.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // ESM config files (e.g. next.config.mjs) execute in Node at build time —
  // give them Node globals so `process`, `__dirname` shims, etc. resolve.
  {
    files: ["*.config.mjs", "next.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettier,
];

export default eslintConfig;
