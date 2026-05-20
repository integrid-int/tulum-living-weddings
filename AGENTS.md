# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a Next.js 16 (App Router) + Sanity CMS website for Tulum Living Weddings. The codebase lives on branch `cursor/full-rebuild-implementation-f2bc` (main branch is empty).

### Environment Variables

All required secrets are injected as system environment variables. Next.js picks them up directly — **no `.env.local` file is needed** in cloud agent environments.

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` — required for build and runtime
- `SANITY_API_WRITE_TOKEN` — required for the contact form API route
- `SANITY_WEBHOOK_SECRET` (injected) maps to `SANITY_REVALIDATE_WEBHOOK_SECRET` (used by `app/api/revalidate/route.ts`) — only relevant when testing the revalidation webhook manually

### Running the application

```bash
npm run dev           # starts Next.js dev server on port 3000
```

### Testing

```bash
npm run test:unit                                                  # vitest - unit tests, no external deps
npm run test:e2e -- --project=chromium tests/e2e/smoke.spec.ts     # playwright E2E smoke test
npm run test:e2e                                                   # full playwright suite
```

### Build / Type checking

```bash
npm run build         # Next.js optimized build (includes TypeScript checking)
npx tsc --noEmit     # standalone type check (expect TS5101 deprecation warning for baseUrl - non-blocking)
```

### Caveats

- No ESLint/Biome/Prettier configured — TypeScript via `next build` is the lint gate.
- The Sanity Studio at `/studio` requires the remote Sanity project to have `localhost:3000` in its CORS origins for full functionality.
- The contact form API writes directly to Sanity; test submissions create real documents in the configured dataset.
- E2E tests start their own dev server (port 3000) via Playwright config; don't have another instance on the same port.
- `npx tsc --noEmit` produces a TS5101 deprecation warning about `baseUrl`; this does not affect builds or runtime.
