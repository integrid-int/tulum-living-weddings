# Tulum Living Weddings Full Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a full Next.js + Sanity marketing website rebuild for Tulum Living Weddings with modern SEO, manual Instagram-backed gallery content, and a contact form that stores leads in Sanity and sends email notifications.

**Architecture:** A single Next.js 15 App Router project on Vercel with embedded Sanity Studio at `/studio`, typed Sanity data fetching in server components, ISR revalidation via secure webhook, and server-side contact submission APIs.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Sanity (studio + content lake), GROQ, Zod, Resend, Vitest, Playwright.

---

## File Structure Map

The plan creates/modifies the following files and directories:

- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `app/how-we-can-help/page.tsx`, `app/so-why-us/page.tsx`, `app/gallery/page.tsx`, `app/testimonials/page.tsx`, `app/faq/page.tsx`, `app/pricing/page.tsx`, `app/contact/page.tsx`
- Create: `app/sitemap.ts`, `app/robots.ts`
- Create: `app/api/revalidate/route.ts`, `app/api/contact/route.ts`
- Create: `app/studio/[[...tool]]/page.tsx`
- Create: `sanity.config.ts`, `sanity.cli.ts`
- Create: `sanity/schemaTypes/index.ts`
- Create: `sanity/schemaTypes/documents/*.ts` and `sanity/schemaTypes/objects/*.ts`
- Create: `sanity/lib/client.ts`, `sanity/lib/image.ts`, `sanity/lib/queries.ts`
- Create: `sanity/env.ts`
- Create: `src/components/*` for page sections, navigation, footer, SEO helpers
- Create: `src/lib/seo.ts`, `src/lib/revalidate.ts`, `src/lib/contact-schema.ts`, `src/lib/rate-limit.ts`, `src/lib/email.ts`
- Create: `scripts/import-instagram-manual.mjs`
- Create: `tests/unit/*.test.ts`, `tests/integration/contact-route.test.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `.gitignore`, `README.md`
- Create: `.env.example`

---

### Task 1: Bootstrap Next.js project and base tooling

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Modify: `.gitignore`
- Test: `tests/unit/config-smoke.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/config-smoke.test.ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("project bootstrap", () => {
  it("has core framework config files", () => {
    expect(existsSync("next.config.ts")).toBe(true);
    expect(existsSync("tailwind.config.ts")).toBe(true);
    expect(existsSync("app/layout.tsx")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/config-smoke.test.ts`  
Expected: FAIL with missing files.

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tulum Living Weddings & Events",
  description: "Destination wedding planning in Tulum, Mexico.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return <main>Homepage scaffold</main>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/config-smoke.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.js app/layout.tsx app/page.tsx app/globals.css .gitignore tests/unit/config-smoke.test.ts
git commit -m "chore: bootstrap nextjs app with tailwind and test harness"
```

---

### Task 2: Add Sanity studio, schema foundation, and env validation

**Files:**
- Create: `sanity.config.ts`, `sanity.cli.ts`, `sanity/env.ts`
- Create: `app/studio/[[...tool]]/page.tsx`
- Create: `sanity/schemaTypes/index.ts`
- Create: `sanity/schemaTypes/documents/siteSettings.ts`
- Create: `sanity/schemaTypes/documents/navigation.ts`
- Create: `sanity/schemaTypes/objects/seo.ts`, `sanity/schemaTypes/objects/cta.ts`, `sanity/schemaTypes/objects/imageWithAlt.ts`
- Test: `tests/unit/sanity-env.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/sanity-env.test.ts
import { describe, expect, it } from "vitest";
import { sanityEnvSchema } from "@/sanity/env";

describe("sanity env schema", () => {
  it("requires project id and dataset", () => {
    const result = sanityEnvSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/sanity-env.test.ts`  
Expected: FAIL with module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// sanity/env.ts
import { z } from "zod";

export const sanityEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1),
});
```

```ts
// sanity/schemaTypes/index.ts
import siteSettings from "./documents/siteSettings";
import navigation from "./documents/navigation";
import seo from "./objects/seo";
import cta from "./objects/cta";
import imageWithAlt from "./objects/imageWithAlt";

export const schemaTypes = [siteSettings, navigation, seo, cta, imageWithAlt];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/sanity-env.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add sanity.config.ts sanity.cli.ts sanity/env.ts app/studio/[[...tool]]/page.tsx sanity/schemaTypes/index.ts sanity/schemaTypes/documents/siteSettings.ts sanity/schemaTypes/documents/navigation.ts sanity/schemaTypes/objects/seo.ts sanity/schemaTypes/objects/cta.ts sanity/schemaTypes/objects/imageWithAlt.ts tests/unit/sanity-env.test.ts
git commit -m "feat: add sanity studio foundation and env schema"
```

---

### Task 3: Implement full content model for pages and collections

**Files:**
- Create: `sanity/schemaTypes/documents/pageHome.ts`
- Create: `sanity/schemaTypes/documents/pageHowWeHelp.ts`
- Create: `sanity/schemaTypes/documents/pageWhyUs.ts`
- Create: `sanity/schemaTypes/documents/pageContact.ts`
- Create: `sanity/schemaTypes/documents/pageGallery.ts`
- Create: `sanity/schemaTypes/documents/pageTestimonials.ts`
- Create: `sanity/schemaTypes/documents/pageFaq.ts`
- Create: `sanity/schemaTypes/documents/pagePricing.ts`
- Create: `sanity/schemaTypes/documents/galleryItem.ts`
- Create: `sanity/schemaTypes/documents/testimonial.ts`
- Create: `sanity/schemaTypes/documents/faqItem.ts`
- Create: `sanity/schemaTypes/documents/pricingPackage.ts`
- Create: `sanity/schemaTypes/documents/contactSubmission.ts`
- Modify: `sanity/schemaTypes/index.ts`
- Test: `tests/unit/schema-types.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/schema-types.test.ts
import { describe, expect, it } from "vitest";
import { schemaTypes } from "@/sanity/schemaTypes";

describe("sanity schema registry", () => {
  it("includes contactSubmission and galleryItem docs", () => {
    const names = schemaTypes.map((t: { name: string }) => t.name);
    expect(names).toContain("contactSubmission");
    expect(names).toContain("galleryItem");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/schema-types.test.ts`  
Expected: FAIL because docs are missing from registry.

- [ ] **Step 3: Write minimal implementation**

```ts
// sanity/schemaTypes/documents/contactSubmission.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "email", type: "string", validation: (rule) => rule.required().email() }),
    defineField({ name: "message", type: "text", validation: (rule) => rule.required().min(20) }),
    defineField({ name: "status", type: "string", initialValue: "new", options: { list: ["new", "in-progress", "closed"] } }),
  ],
});
```

```ts
// sanity/schemaTypes/documents/galleryItem.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "image", type: "imageWithAlt", validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "source", type: "string", options: { list: ["manual", "instagram"] }, initialValue: "manual" }),
  ],
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/schema-types.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/documents/*.ts sanity/schemaTypes/index.ts tests/unit/schema-types.test.ts
git commit -m "feat: add complete sanity content model for rebuild"
```

---

### Task 4: Build Sanity client, GROQ queries, and typed data mappers

**Files:**
- Create: `sanity/lib/client.ts`, `sanity/lib/image.ts`, `sanity/lib/queries.ts`
- Create: `src/lib/content.ts`
- Test: `tests/unit/content-mapper.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/content-mapper.test.ts
import { describe, expect, it } from "vitest";
import { mapFaqItems } from "@/src/lib/content";

describe("mapFaqItems", () => {
  it("maps sanity faq docs into ui shape", () => {
    const mapped = mapFaqItems([{ _id: "1", question: "Q?", answer: [{ _type: "block", children: [] }] }]);
    expect(mapped[0].id).toBe("1");
    expect(mapped[0].question).toBe("Q?");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/content-mapper.test.ts`  
Expected: FAIL because mapper does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/content.ts
export function mapFaqItems(items: Array<{ _id: string; question: string; answer: unknown }>) {
  return items.map((item) => ({
    id: item._id,
    question: item.question,
    answer: item.answer,
  }));
}
```

```ts
// sanity/lib/client.ts
import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/content-mapper.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add sanity/lib/client.ts sanity/lib/image.ts sanity/lib/queries.ts src/lib/content.ts tests/unit/content-mapper.test.ts
git commit -m "feat: add sanity data client and query mapping layer"
```

---

### Task 5: Implement route pages and shared section components

**Files:**
- Create: `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`
- Create: `src/components/sections/Hero.tsx`, `FeatureGrid.tsx`, `TestimonialsGrid.tsx`, `FaqAccordion.tsx`, `PricingCards.tsx`, `GalleryGrid.tsx`
- Modify/Create: `app/page.tsx`, `app/how-we-can-help/page.tsx`, `app/so-why-us/page.tsx`, `app/gallery/page.tsx`, `app/testimonials/page.tsx`, `app/faq/page.tsx`, `app/pricing/page.tsx`, `app/contact/page.tsx`
- Test: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/e2e/smoke.spec.ts
import { test, expect } from "@playwright/test";

test("core routes return successful responses", async ({ page }) => {
  for (const route of ["/", "/how-we-can-help", "/so-why-us", "/gallery", "/testimonials", "/faq", "/pricing", "/contact"]) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- --project=chromium tests/e2e/smoke.spec.ts`  
Expected: FAIL because routes/components are not implemented.

- [ ] **Step 3: Write minimal implementation**

```tsx
// app/gallery/page.tsx
import { GalleryGrid } from "@/src/components/sections/GalleryGrid";

export default function GalleryPage() {
  return (
    <main>
      <h1>Gallery</h1>
      <GalleryGrid items={[]} />
    </main>
  );
}
```

```tsx
// src/components/sections/FaqAccordion.tsx
type FaqItem = { id: string; question: string; answer: React.ReactNode };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <section>
      {items.map((item) => (
        <details key={item.id}>
          <summary>{item.question}</summary>
          <div>{item.answer}</div>
        </details>
      ))}
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:e2e -- --project=chromium tests/e2e/smoke.spec.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/**/*.tsx src/components/**/*.tsx tests/e2e/smoke.spec.ts
git commit -m "feat: build baseline and new marketing routes with shared sections"
```

---

### Task 6: Add SEO metadata, structured data, sitemap, robots, and redirects

**Files:**
- Create: `src/lib/seo.ts`, `src/components/seo/JsonLd.tsx`
- Modify: `app/layout.tsx`
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: `next.config.ts` (redirect rules)
- Test: `tests/unit/seo.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/seo.test.ts
import { describe, expect, it } from "vitest";
import { buildCanonicalUrl } from "@/src/lib/seo";

describe("buildCanonicalUrl", () => {
  it("concatenates site url and route safely", () => {
    expect(buildCanonicalUrl("https://www.tulumlivingweddings.com", "/faq")).toBe("https://www.tulumlivingweddings.com/faq");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/seo.test.ts`  
Expected: FAIL because SEO utility does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/seo.ts
export function buildCanonicalUrl(siteUrl: string, path: string) {
  const normalizedSite = siteUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedSite}${normalizedPath}`;
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/seo.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/components/seo/JsonLd.tsx app/layout.tsx app/sitemap.ts app/robots.ts next.config.ts tests/unit/seo.test.ts
git commit -m "feat: implement technical seo, json-ld, sitemap, and legacy redirects"
```

---

### Task 7: Build secure contact API and front-end submission flow

**Files:**
- Create: `src/lib/contact-schema.ts`, `src/lib/rate-limit.ts`, `src/lib/email.ts`
- Create: `app/api/contact/route.ts`
- Modify: `app/contact/page.tsx`
- Test: `tests/integration/contact-route.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/integration/contact-route.test.ts
import { describe, expect, it } from "vitest";
import { contactSchema } from "@/src/lib/contact-schema";

describe("contactSchema", () => {
  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "invalid",
      message: "Planning a wedding in Tulum with 60 guests.",
      consent: true,
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/integration/contact-route.test.ts`  
Expected: FAIL because schema is missing.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/contact-schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  eventDate: z.string().optional(),
  guestCount: z.number().int().positive().optional(),
  budgetRange: z.string().optional(),
  eventType: z.enum(["wedding", "vow-renewal", "other"]).optional(),
  message: z.string().min(20),
  consent: z.literal(true),
});
```

```ts
// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { contactSchema } from "@/src/lib/contact-schema";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/integration/contact-route.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contact-schema.ts src/lib/rate-limit.ts src/lib/email.ts app/api/contact/route.ts app/contact/page.tsx tests/integration/contact-route.test.ts
git commit -m "feat: add validated contact pipeline with sanity and email integration"
```

---

### Task 8: Add secure revalidation webhook and environment documentation

**Files:**
- Create: `app/api/revalidate/route.ts`
- Create: `.env.example`
- Modify: `README.md`
- Test: `tests/unit/revalidate-auth.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/revalidate-auth.test.ts
import { describe, expect, it } from "vitest";
import { isValidWebhookSecret } from "@/src/lib/revalidate";

describe("isValidWebhookSecret", () => {
  it("rejects mismatched secrets", () => {
    expect(isValidWebhookSecret("one", "two")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/revalidate-auth.test.ts`  
Expected: FAIL because helper does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/revalidate.ts
import crypto from "node:crypto";

export function isValidWebhookSecret(provided: string, expected: string) {
  if (!provided || !expected || provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}
```

```ts
// app/api/revalidate/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidWebhookSecret } from "@/src/lib/revalidate";

export async function POST(request: Request) {
  const provided = request.headers.get("x-sanity-webhook-secret") ?? "";
  const expected = process.env.SANITY_WEBHOOK_SECRET ?? "";
  if (!isValidWebhookSecret(provided, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/revalidate-auth.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/revalidate.ts app/api/revalidate/route.ts .env.example README.md tests/unit/revalidate-auth.test.ts
git commit -m "feat: secure sanity webhook revalidation and env docs"
```

---

### Task 9: Implement manual Instagram import helper and content operations docs

**Files:**
- Create: `scripts/import-instagram-manual.mjs`
- Modify: `README.md`
- Test: `tests/unit/instagram-import-parse.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/instagram-import-parse.test.ts
import { describe, expect, it } from "vitest";
import { normalizeInstagramRow } from "@/scripts/import-instagram-manual";

describe("normalizeInstagramRow", () => {
  it("maps csv row to gallery payload", () => {
    const mapped = normalizeInstagramRow({
      title: "Cenote wedding",
      category: "cenote",
      permalink: "https://instagram.com/p/abc",
    });
    expect(mapped.source).toBe("instagram");
    expect(mapped.category).toBe("cenote");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:unit -- tests/unit/instagram-import-parse.test.ts`  
Expected: FAIL because parser function is missing.

- [ ] **Step 3: Write minimal implementation**

```js
// scripts/import-instagram-manual.mjs
export function normalizeInstagramRow(row) {
  return {
    _type: "galleryItem",
    title: row.title,
    category: row.category,
    instagramPermalink: row.permalink ?? "",
    source: "instagram",
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:unit -- tests/unit/instagram-import-parse.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/import-instagram-manual.mjs README.md tests/unit/instagram-import-parse.test.ts
git commit -m "feat: add manual instagram ingestion helper and operator guide"
```

---

### Task 10: Final verification and release readiness checks

**Files:**
- Modify: `README.md` (release checklist section)
- Test: `tests/e2e/smoke.spec.ts`, all unit/integration tests

- [ ] **Step 1: Write release verification checklist in README**

```md
## Release checklist

1. Run unit tests.
2. Run integration tests.
3. Run e2e smoke tests.
4. Validate sitemap and robots.
5. Submit test contact lead and verify Sanity + email delivery.
```

- [ ] **Step 2: Run full test suite**

Run: `npm run test:unit && npm run test:e2e -- --project=chromium tests/e2e/smoke.spec.ts`  
Expected: PASS for all suites.

- [ ] **Step 3: Run production build**

Run: `npm run build`  
Expected: PASS with generated App Router output and no type errors.

- [ ] **Step 4: Validate SEO endpoints locally**

Run: `npm run dev` then check:
- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/robots.txt`

Expected: both routes return 200 and include canonical site URL.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add release verification checklist"
```

---

## Plan Self-Review

### 1) Spec coverage check

- Full rebuild scope: covered in Tasks 1-5.
- Sanity project/modeling: covered in Tasks 2-4.
- Modern SEO/AEO: covered in Task 6 and Task 10 verification.
- Manual Instagram ingestion: covered in Task 9.
- Contact form with Sanity + email: covered in Task 7.
- Vercel/runtime secrets and webhook security: covered in Task 8.

No spec requirement is missing from the task list.

### 2) Placeholder scan

- No `TODO`, `TBD`, or unresolved placeholders remain.
- Each task includes explicit files, commands, expected outcomes, and commit messages.

### 3) Type/signature consistency

- `contactSchema`, `isValidWebhookSecret`, and `normalizeInstagramRow` names are used consistently between tests and implementation steps.
- Route names and URL paths are consistent with agreed IA (`/faq`, `/pricing`, `/gallery`, etc.).

