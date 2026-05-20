import { cache } from "react";
import type { Metadata } from "next";
import FeatureGrid from "@/src/components/sections/FeatureGrid";
import Hero from "@/src/components/sections/Hero";
import TestimonialsGrid from "@/src/components/sections/TestimonialsGrid";
import { fetchSanitySafe } from "@/sanity/lib/client";
import {
  PAGE_HOME_QUERY,
  PRICING_PACKAGES_QUERY,
  TESTIMONIALS_QUERY
} from "@/sanity/lib/queries";
import type {
  SanityCta,
  SanityPricingPackageDocument,
  SanityTestimonialDocument
} from "@/src/lib/content";
import {
  mapPricingPackages,
  mapTestimonials
} from "@/src/lib/content";
import { resolveMarketingCopy } from "@/src/lib/copy";
import { buildRouteMetadata, type RouteSeoFields } from "@/src/lib/route-metadata";

type HomePageDocument = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  primaryCta?: SanityCta | null;
  seo?: RouteSeoFields | null;
  featuredTestimonials?: SanityTestimonialDocument[] | null;
  featuredPackages?: SanityPricingPackageDocument[] | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "Tulum Living Weddings",
  title: "Destination wedding planning rooted in Tulum expertise",
  description:
    "From concept to celebration day, we design and coordinate destination weddings across Tulum and the Riviera Maya.",
  ctaLabel: "View pricing",
  ctaHref: "/pricing"
};

const getHomePageData = cache(async () => {
  const [page, testimonials, pricingPackages] = await Promise.all([
    fetchSanitySafe<HomePageDocument | null>(PAGE_HOME_QUERY, null),
    fetchSanitySafe<SanityTestimonialDocument[]>(TESTIMONIALS_QUERY, []),
    fetchSanitySafe<SanityPricingPackageDocument[]>(PRICING_PACKAGES_QUERY, [])
  ]);

  return { page, testimonials, pricingPackages };
});

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getHomePageData();

  return buildRouteMetadata({
    routePath: "/",
    fallbackTitle: FALLBACK_CONTENT.title,
    fallbackDescription: FALLBACK_CONTENT.description,
    seo: page?.seo
  });
}

export default async function HomePage() {
  const { page, testimonials, pricingPackages } = await getHomePageData();
  const testimonialItems = mapTestimonials(
    (page?.featuredTestimonials && page.featuredTestimonials.length > 0)
      ? page.featuredTestimonials
      : testimonials
  ).map((item) => ({
    quote: item.quote,
    author: item.coupleName,
    role: item.location ?? item.eventType ?? undefined
  }));

  const featureItems = mapPricingPackages(
    (page?.featuredPackages && page.featuredPackages.length > 0)
      ? page.featuredPackages
      : pricingPackages
  ).map((pkg) => ({
    title: pkg.packageName,
    description: pkg.summary ?? pkg.priceLabel
  }));

  return (
    <main>
      <Hero
        eyebrow={FALLBACK_CONTENT.eyebrow}
        title={resolveMarketingCopy(page?.heroTitle, FALLBACK_CONTENT.title)}
        description={resolveMarketingCopy(page?.heroSubtitle, FALLBACK_CONTENT.description)}
        ctaLabel={page?.primaryCta?.label?.trim() || FALLBACK_CONTENT.ctaLabel}
        ctaHref={page?.primaryCta?.href?.trim() || FALLBACK_CONTENT.ctaHref}
      />
      <FeatureGrid heading="Popular planning packages" features={featureItems.length > 0 ? featureItems : undefined} />
      <TestimonialsGrid
        heading="Stories from recent celebrations"
        testimonials={testimonialItems.length > 0 ? testimonialItems : undefined}
      />
    </main>
  );
}
