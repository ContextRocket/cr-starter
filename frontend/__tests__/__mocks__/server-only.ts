// Test double for the `server-only` package (provided at runtime by Next.js,
// not installed as a node module). Imported by i18n/redirect.ts and
// i18n/server.ts to mark server-only modules; the jsdom test environment
// resolves it to this no-op via the vitest.config.ts alias.
export {};
