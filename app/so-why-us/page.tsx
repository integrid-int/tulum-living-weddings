import { cache } from "react";
import type { Metadata } from "next";
import EditorialMotifPanel from "@/src/components/sections/EditorialMotifPanel";
import FaqAccordion from "@/src/components/sections/FaqAccordion";
import Hero from "@/src/components/sections/Hero";
import TestimonialsGrid from "@/src/components/sections/TestimonialsGrid";
import { fetchSanitySafe } from "@/sanity/lib/client";
import {
  FAQ_ITEMS_QUERY,
  PAGE_WHY_US_QUERY,
  TESTIMONIALS_QUERY
} from "@/sanity/lib/queries";
import type {
  SanityCta,
  SanityFaqItemDocument,
  SanityTestimonialDocument
} from "@/src/lib/content";
import {
  mapFaqItems,
  mapTestimonials,
  portableTextToPlainText
} from "@/src/lib/content";
import { resolveMarketingCopy } from "@/src/lib/copy";
import { buildRouteMetadata, type RouteSeoFields } from "@/src/lib/route-metadata";
import { BRAND_IMAGE_SOURCES, BRAND_TESTIMONIAL_IMAGE_SOURCES } from "@/src/lib/brand";
import { buildSanityImageUrl } from "@/sanity/lib/image";

type WhyUsPageDocument = {
  title?: string | null;
  intro?: string | null;
  reasons?: Array<{ title?: string | null; description?: string | null }> | null;
  primaryCta?: SanityCta | null;
  seo?: RouteSeoFields | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "So, Why Us?",
  title: "So- why us?",
  description:
    "We focus on communication, budget transparency, and trusted local relationships so planning stays clear, calm, and joyful.",
  ctaLabel: "Read testimonials",
  ctaHref: "/testimonials"
};

const FALLBACK_FAQ_ITEMS = [
  {
    question: "What makes your planning process different?",
    answer: "We run a milestone-based process with clear owners, budget visibility, and proactive communication."
  },
  {
    question: "Can you coordinate local vendors for us?",
    answer:
      "Yes. We curate trusted Riviera Maya vendors, manage outreach, and keep all negotiations aligned with your priorities."
  },
  {
    question: "Do you offer support close to wedding day?",
    answer:
      "Absolutely. We lead final confirmations, timeline checks, and day-of coordination so your team can stay present."
  }
];

const getWhyUsData = cache(async () => {
  const [page, testimonials, faqItems] = await Promise.all([
    fetchSanitySafe<WhyUsPageDocument | null>(PAGE_WHY_US_QUERY, null),
    fetchSanitySafe<SanityTestimonialDocument[]>(TESTIMONIALS_QUERY, []),
    fetchSanitySafe<SanityFaqItemDocument[]>(FAQ_ITEMS_QUERY, [])
  ]);

  return { page, testimonials, faqItems };
});

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getWhyUsData();

  return buildRouteMetadata({
    routePath: "/so-why-us",
    fallbackTitle: FALLBACK_CONTENT.title,
    fallbackDescription: FALLBACK_CONTENT.description,
    seo: page?.seo
  });
}

export default async function SoWhyUsPage() {
  const { page, testimonials, faqItems } = await getWhyUsData();
  const testimonialCards = mapTestimonials(testimonials).map((item) => ({
    quote: item.quote,
    author: item.coupleName,
    role: item.location ?? item.eventType ?? undefined,
    imageUrl:
      (item.image ? buildSanityImageUrl(item.image, { width: 960, height: 640, fit: "crop" }) : null) ??
      BRAND_TESTIMONIAL_IMAGE_SOURCES[item.sortOrder % BRAND_TESTIMONIAL_IMAGE_SOURCES.length]
  }));
  const faqCards = mapFaqItems(faqItems).map((item) => ({
    question: item.question,
    answer: portableTextToPlainText(item.answer) || "Our team can walk you through this in a discovery call."
  }));
  const renderedFaqItems = faqCards.length > 0 ? faqCards : FALLBACK_FAQ_ITEMS;

  return (
    <main>
      <Hero
        eyebrow={FALLBACK_CONTENT.eyebrow}
        kicker="A calm, high-touch process for high-stakes wedding weekends."
        title={resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
        description={resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
        ctaLabel={page?.primaryCta?.label?.trim() || FALLBACK_CONTENT.ctaLabel}
        ctaHref={page?.primaryCta?.href?.trim() || FALLBACK_CONTENT.ctaHref}
        backgroundImageUrl={BRAND_IMAGE_SOURCES.whyUsHero}
      />
      <EditorialMotifPanel
        label="Our Signature"
        headline="Calm communication. Exacting execution. Elevated guest memory."
        detail="We prioritize transparent decisions, proactive vendor leadership, and polished event flow at every stage."
        tags={["Transparent Planning", "Luxury Logistics", "Execution Excellence"]}
      />
      <TestimonialsGrid
        heading="Proof from recent celebrations"
        testimonials={testimonialCards.length > 0 ? testimonialCards : undefined}
      />
      <FaqAccordion heading="How we work" items={renderedFaqItems} />
    </main>
  );
}
