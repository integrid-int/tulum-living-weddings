# tulum-living-weddings

## Security Notes

- `npm audit` currently reports `GHSA-qx2v-qp2m-jg93` (PostCSS XSS) through Next.js' bundled dependency chain.
- At bootstrap time, installed `next@16.2.6` is the latest published version (`npm view next version`), so there is no upstream patched stable Next.js release available to adopt yet.
