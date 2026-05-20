# tulum-living-weddings

## Security Notes

- `npm audit` currently reports `GHSA-qx2v-qp2m-jg93` (PostCSS XSS) through Next.js' bundled dependency chain.
- At bootstrap time, installed `next@16.2.6` is the latest published version (`npm view next version`), so there is no upstream patched stable Next.js release available to adopt yet.

## Environment setup

1. Copy `.env.example` to `.env.local`.
2. Fill in all values with your project-specific credentials/secrets.
3. Keep `.env.local` private and never commit it.

### Required variables

- `NEXT_PUBLIC_SITE_URL`: Canonical site URL used for SEO metadata.
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Sanity project id.
- `NEXT_PUBLIC_SANITY_DATASET`: Sanity dataset (usually `production`).
- `NEXT_PUBLIC_SANITY_API_VERSION`: API version used by Sanity clients.
- `SANITY_API_WRITE_TOKEN`: Server-side token used to store contact submissions.
- `SANITY_REVALIDATE_WEBHOOK_SECRET`: Shared secret checked by `/api/revalidate`.
- `CONTACT_NOTIFICATION_TO`: Destination email for contact form alerts.
- `CONTACT_FROM_EMAIL`: Sender email used in contact notifications.
- `CONTACT_EMAIL_WEBHOOK_URL`: Webhook endpoint for your email delivery provider.

### Optional variables

- `CONTACT_EMAIL_WEBHOOK_TOKEN`: Optional bearer token for the contact email webhook.

## Secure Sanity webhook revalidation

The app exposes `POST /api/revalidate` for on-demand cache invalidation after content updates.

### How authentication works

- Sanity sends the header `x-sanity-webhook-secret`.
- The API route compares that value to `SANITY_REVALIDATE_WEBHOOK_SECRET` using timing-safe comparison.
- Requests with missing/invalid secrets return `401 Unauthorized`.

### Paths revalidated by default

- `/`
- `/how-we-can-help`
- `/so-why-us`
- `/gallery`
- `/testimonials`
- `/faq`
- `/pricing`
- `/contact`

### Sanity webhook setup checklist

1. Generate a long random secret and set it as `SANITY_REVALIDATE_WEBHOOK_SECRET` in your app environment.
2. In Sanity Manage, create a webhook pointing to `https://<your-domain>/api/revalidate`.
3. Configure webhook trigger events to include create/update/delete for the document types that power site pages.
4. Add header:
   - Key: `x-sanity-webhook-secret`
   - Value: the same secret as `SANITY_REVALIDATE_WEBHOOK_SECRET`
5. Save webhook and publish a Sanity content change to verify the route returns `200` with an `ok: true` response.

## Manual Instagram import (operator guide)

Use `scripts/import-instagram-manual.mjs` to normalize exported Instagram rows into gallery-item payloads.

### Input format

- Supported input files: `.csv` or `.json` array.
- Preferred columns/fields:
  - `title` (optional; falls back to `caption` or `headline`)
  - `category` (mapped to normalized gallery category values)
  - `permalink` (stored as `instagramPermalink`)
  - `sortOrder` (optional; defaults to `0`)

### Dry-run first

```bash
node scripts/import-instagram-manual.mjs --input ./data/instagram.csv --dry-run
```

This prints a row count and a preview of normalized gallery payload objects without writing files.

### Generate import payload

```bash
node scripts/import-instagram-manual.mjs --input ./data/instagram.csv --output ./data/gallery-import.json
```

If `--output` is omitted, the script writes `<input>.gallery-import.json`.
