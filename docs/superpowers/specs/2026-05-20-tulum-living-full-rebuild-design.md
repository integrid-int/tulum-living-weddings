# Tulum Living Weddings Full Rebuild Design

## Summary

Rebuild the entire `tulumlivingweddings.com` website on a modern stack using **Next.js 15 + TypeScript + Tailwind + Sanity + Vercel**. Keep the current site structure and messaging as the baseline, then add high-conversion pages for **Gallery**, **Testimonials**, **FAQ**, and **Pricing/Packages**.

The system must prioritize modern SEO/AEO, editor-friendly content management, and a reliable lead pipeline via **Contact Form -> Sanity lead record + email notification**.

## Goals

1. Ship a full website rebuild that is performant, mobile-friendly, and easy to update.
2. Preserve existing core page structure while modernizing UX and information architecture.
3. Store content in a new Sanity project/dataset with clean editorial workflows.
4. Implement strong technical SEO and structured data from day one.
5. Ingest Instagram images/content manually into Sanity (no live API dependency).
6. Capture leads through a secure contact form that stores data in Sanity and sends email alerts.
7. Deploy as a single Vercel project.

## Non-Goals (v1)

- Automated Instagram Graph API sync.
- Multilingual localization (English only).
- Full CRM integration beyond Sanity lead records + email.
- Marketplace booking/payment flows.

## Page Scope

### Baseline pages from current site

- `/` (Home)
- `/how-we-can-help`
- `/so-why-us`
- `/contact`

### New pages for v1

- `/gallery`
- `/testimonials`
- `/faq`
- `/pricing`

### Redirect strategy

Legacy `/home/...` paths will be redirected (301) to canonical modern routes.

## Architecture

## Runtime and deployment

- Framework: Next.js 15 App Router (TypeScript).
- Styling: Tailwind CSS with reusable design tokens/components.
- CMS: New Sanity project with production dataset.
- Studio: Embedded at `/studio` and access-restricted.
- Hosting: Vercel (single project for site + API routes + Studio).

## Data flow

1. Editors publish content in Sanity Studio.
2. Sanity webhook calls Next.js revalidation endpoint.
3. Next.js regenerates affected routes/tags.
4. Visitors receive cached/static responses with fresh content.

## Operational boundaries

- Website rendering must not depend on Instagram runtime APIs.
- Contact writes to Sanity happen server-side only.
- Email delivery happens through a Vercel-compatible transactional provider.

## Sanity Content Model

## Singleton/global documents

- `siteSettings`: brand identity, default SEO fields, contact channels, social links.
- `navigation`: header/footer menus and utility links.

## Page singletons

- `pageHome`
- `pageHowWeHelp`
- `pageWhyUs`
- `pageContact`
- `pageGallery`
- `pageTestimonials`
- `pageFaq`
- `pagePricing`

## Reusable collection documents

- `galleryItem`
  - Title, category, images, alt text, optional Instagram permalink, source (`manual` | `instagram`), feature toggle, sort order.
- `testimonial`
  - Couple/event data, quote, optional imagery, featured flag.
- `faqItem`
  - Question, answer, category, sort order.
- `pricingPackage`
  - Package name, summary, price label, inclusions, add-ons, CTA.

## Operational documents

- `contactSubmission`
  - Name, email, phone/WhatsApp, event date, guest count, budget range, event type, message, source page, status, timestamps.

## Reusable object schemas

- `seo`: title, meta description, canonical override, OG image, noindex.
- `cta`: label, target, style variant.
- `imageWithAlt`: image + required alt + optional caption.
- Portable Text blocks for rich content sections.

## Editorial guardrails

- Required alt text on images.
- Required SEO fields on core pages.
- Desk grouping: Pages, Collections, Leads, Global Settings.
- Preview configuration for major page docs.

## SEO & AEO Design

## Metadata and crawlability

- Per-page metadata from Sanity with global fallbacks.
- Canonical URLs generated from site base URL and route.
- Open Graph/Twitter card support with page-level overrides.
- `robots.txt` generated/configured to disallow `/studio` and internal APIs.
- Dynamic `sitemap.xml` that includes canonical page routes and selected indexable collections.

## Structured data (JSON-LD)

- Sitewide: `Organization` or `LocalBusiness`.
- Page-level:
  - Home: `WebSite` + business context.
  - Pricing: `Service` and offer metadata.
  - FAQ: `FAQPage` generated from Sanity items.
  - Internal pages: `BreadcrumbList`.

## AEO readiness

- Clear heading hierarchy and semantic sectioning.
- Concise, factual FAQ answers suited for answer-engine extraction.
- Strong trust/contact signals (business identity, channels, consistency).

## Performance requirements

- Optimized hero imagery (LCP-conscious).
- Stable layout dimensions to avoid CLS.
- Minimal client-side JS for content-first pages.

## Instagram Manual Ingestion Strategy

Instagram media and captions are managed as imported content in Sanity:

1. Collect approved assets/copy from Instagram profile.
2. Import manually through Studio or a one-off helper import script.
3. Store images in Sanity assets for stable rendering and optimization.
4. Preserve optional Instagram permalink attribution per item.
5. Curate featured sets for Home and Gallery page sections.

This approach avoids API token lifecycle issues while enabling frequent content refreshes.

## Contact Form Design

## UX fields

- Name (required)
- Email (required)
- Phone/WhatsApp (optional)
- Event date (optional)
- Guest count (optional)
- Budget range (optional)
- Event type (optional select)
- Message (required)
- Consent checkbox (required)

## Submission pipeline

1. Browser submits to `POST /api/contact`.
2. Server validates and sanitizes payload.
3. Server creates `contactSubmission` in Sanity.
4. Server sends notification email to configured inbox.
5. Client receives success/failure status with user-friendly feedback.

## Security and resilience

- Honeypot field.
- Rate limiting on API route.
- Optional Turnstile/reCAPTCHA toggle.
- Environment variable-backed secrets.

## Vercel Environment Model

Required environment variables include:

- Public runtime:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SANITY_API_VERSION`
- Server secrets:
  - `SANITY_API_WRITE_TOKEN`
  - `SANITY_WEBHOOK_SECRET`
  - `REVALIDATE_SECRET`
  - `RESEND_API_KEY`
  - `CONTACT_NOTIFICATION_TO`
  - `CONTACT_FROM_EMAIL`

Optional anti-spam/rate-limit variables can be added as needed.

## Testing and Validation

## Functional tests

- Route rendering and basic navigation smoke tests.
- Contact API success/error/validation paths.
- Sanity-driven page rendering with missing-content fallback behavior.

## SEO validation

- Metadata presence per page.
- Canonical correctness.
- Structured data schema validation.
- Sitemap and robots reachability.
- Redirect coverage for legacy routes.

## Performance validation

- Lighthouse checks for homepage and key landing pages.
- LCP/CLS sanity checks on mobile and desktop.

## Migration and Launch Sequence

1. Scaffold app + Sanity integration.
2. Model schemas and desk structure.
3. Build page components and route templates.
4. Migrate baseline copy/content from current site.
5. Add new pages and collection content.
6. Implement contact backend + email.
7. Finalize SEO stack and redirects.
8. Populate gallery/testimonials/faq/pricing content.
9. Run QA and pre-launch checks.
10. Cut over domain to Vercel and monitor.

## Risks and Mitigations

- **Content migration quality risk:** define migration checklist and editorial QA pass.
- **Spam on contact form:** start with honeypot + rate limiting; add captcha if needed.
- **Schema drift between code and content:** keep schema and frontend query contracts typed and versioned.
- **Indexing regression during cutover:** enforce redirects and verify Search Console + sitemap after launch.

## Accepted Decisions

- Full rebuild (not homepage-only).
- Next.js 15 + TypeScript + Tailwind + Sanity + Vercel.
- New Sanity project from scratch.
- English-only v1.
- Manual Instagram ingestion.
- Contact form writes to Sanity and sends email.
- Baseline current site structure + add Gallery/Testimonials/FAQ/Pricing.
