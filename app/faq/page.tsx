import { cache } from "react";
import type { Metadata } from "next";
import FaqAccordion from "@/src/components/sections/FaqAccordion";
import Hero from "@/src/components/sections/Hero";
import JsonLd from "@/src/components/seo/JsonLd";
import { fetchSanitySafe } from "@/sanity/lib/client";
import { FAQ_ITEMS_QUERY, PAGE_FAQ_QUERY } from "@/sanity/lib/queries";
import type { SanityFaqItemDocument } from "@/src/lib/content";
import { mapFaqItems, portableTextToPlainText } from "@/src/lib/content";
import { resolveMarketingCopy } from "@/src/lib/copy";
import { buildRouteMetadata, type RouteSeoFields } from "@/src/lib/route-metadata";
import { buildFaqPageJsonLd } from "@/src/lib/seo";

type FaqPageDocument = {
  title?: string | null;
  intro?: string | null;
  seo?: RouteSeoFields | null;
  featuredFaqItems?: SanityFaqItemDocument[] | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "FAQ",
  title: "Answers to common planning questions",
  description:
    "Review timelines, vendor coordination, and travel planning details for destination weddings in Tulum."
};

const FALLBACK_FAQ_ITEMS = [
  {
    question: "How far in advance should we start planning?",
    answer:
      "Most couples begin 9 to 14 months ahead. We can also support shorter timelines with a focused planning sprint."
  },
  {
    question: "Can you help with remote planning if we are not in Mexico?",
    answer:
      "Yes. We run the process remotely through curated proposals, video walkthroughs, and clear milestone check-ins."
  },
  {
    question: "Do you coordinate vendors and timeline logistics on wedding day?",
    answer:
      "Absolutely. We manage final confirmations, vendor arrivals, ceremony flow, and guest-facing coordination."
  }
];

const getFaqData = cache(async () => {
  const [page, faqItems] = await Promise.all([
    fetchSanitySafe<FaqPageDocument | null>(PAGE_FAQ_QUERY, null),
    fetchSanitySafe<SanityFaqItemDocument[]>(FAQ_ITEMS_QUERY, [])
  ]);

  return { page, faqItems };
});

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getFaqData();

  return buildRouteMetadata({
    routePath: "/faq",
    fallbackTitle: FALLBACK_CONTENT.title,
    fallbackDescription: FALLBACK_CONTENT.description,
    seo: page?.seo
  });
}

export default async function FaqPage() {
  const { page, faqItems } = await getFaqData();
  const mappedFaqItems = mapFaqItems(
    page?.featuredFaqItems && page.featuredFaqItems.length > 0
      ? page.featuredFaqItems
      : faqItems
  )
    .map((item) => ({
      question: item.question,
      answer: portableTextToPlainText(item.answer)
    }))
    .filter((item) => item.question.trim().length > 0 && item.answer.trim().length > 0);

  const renderedFaqItems = mappedFaqItems.length > 0 ? mappedFaqItems : FALLBACK_FAQ_ITEMS;
  const faqJsonLd = buildFaqPageJsonLd(renderedFaqItems);

  return (
    <main>
      <JsonLd data={faqJsonLd} />
      <Hero
        eyebrow={FALLBACK_CONTENT.eyebrow}
        title={resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
        description={resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
      />
      <FaqAccordion items={renderedFaqItems} />
    </main>
  );
}
