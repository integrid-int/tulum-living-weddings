import { cache } from "react";
import type { Metadata } from "next";
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

type TestimonialsPageDocument = {
  title?: string | null;
  intro?: string | null;
  seo?: RouteSeoFields | null;
  featuredTestimonials?: SanityTestimonialDocument[] | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "Testimonials",
  title: "Feedback from teams we have supported",
  description:
    "Hear from couples and families who trusted us to coordinate and design their destination weddings."
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
    role: item.location ?? item.eventType ?? undefined
  }));

  return (
    <main>
      <Hero
        eyebrow={FALLBACK_CONTENT.eyebrow}
        title={resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
        description={resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
      />
      <TestimonialsGrid testimonials={mappedTestimonials.length > 0 ? mappedTestimonials : undefined} />
    </main>
  );
}
