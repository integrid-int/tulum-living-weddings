import { cache } from "react";
import type { Metadata } from "next";
import EditorialMotifPanel from "@/src/components/sections/EditorialMotifPanel";
import Hero from "@/src/components/sections/Hero";
import TestimonialsGrid from "@/src/components/sections/TestimonialsGrid";
import { fetchSanitySafe } from "@/sanity/lib/client";
import {
  PAGE_TESTIMONIALS_QUERY,
  TESTIMONIALS_QUERY
} from "@/sanity/lib/queries";
import type { SanityTestimonialDocument } from "@/src/lib/content";
import { mapTestimonials } from "@/src/lib/content";
import { resolveMarketingCopy } from "@/src/lib/copy";
import { buildRouteMetadata, type RouteSeoFields } from "@/src/lib/route-metadata";
import { BRAND_IMAGE_SOURCES, BRAND_TESTIMONIAL_IMAGE_SOURCES } from "@/src/lib/brand";
import { buildSanityImageUrl } from "@/sanity/lib/image";

type TestimonialsPageDocument = {
  title?: string | null;
  intro?: string | null;
  seo?: RouteSeoFields | null;
  featuredTestimonials?: SanityTestimonialDocument[] | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "Testimonials",
  title: "Testimonials",
  description:
    "Read reflections from couples and families who entrusted us with deeply personal, impeccably produced destination celebrations."
};

const getTestimonialsData = cache(async () => {
  const [page, testimonials] = await Promise.all([
    fetchSanitySafe<TestimonialsPageDocument | null>(PAGE_TESTIMONIALS_QUERY, null),
    fetchSanitySafe<SanityTestimonialDocument[]>(TESTIMONIALS_QUERY, [])
  ]);

  return { page, testimonials };
});

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getTestimonialsData();

  return buildRouteMetadata({
    routePath: "/testimonials",
    fallbackTitle: FALLBACK_CONTENT.title,
    fallbackDescription: FALLBACK_CONTENT.description,
    seo: page?.seo
  });
}

export default async function TestimonialsPage() {
  const { page, testimonials } = await getTestimonialsData();
  const mappedTestimonials = mapTestimonials(
    page?.featuredTestimonials && page.featuredTestimonials.length > 0
      ? page.featuredTestimonials
      : testimonials
  ).map((item) => ({
    quote: item.quote,
    author: item.coupleName,
    role: item.location ?? item.eventType ?? undefined,
    imageUrl:
      (item.image ? buildSanityImageUrl(item.image, { width: 960, height: 640, fit: "crop" }) : null) ??
      BRAND_TESTIMONIAL_IMAGE_SOURCES[item.sortOrder % BRAND_TESTIMONIAL_IMAGE_SOURCES.length]
  }));

  return (
    <main>
      <Hero
        eyebrow={FALLBACK_CONTENT.eyebrow}
        kicker="The most meaningful metric is how your people felt in the room."
        title={resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
        description={resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
        backgroundImageUrl={BRAND_IMAGE_SOURCES.testimonialsHero}
      />
      <EditorialMotifPanel
        label="Client Narratives"
        headline="Trust is built before the wedding day and remembered long after."
        detail="These stories reflect how intentional planning and refined production translate into genuine guest impact."
        tags={["Client Experience", "International Couples", "Weekend Memories"]}
      />
      <TestimonialsGrid testimonials={mappedTestimonials.length > 0 ? mappedTestimonials : undefined} />
    </main>
  );
}
