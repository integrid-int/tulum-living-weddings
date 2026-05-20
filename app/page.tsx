import { cache } from "react";
import type { Metadata } from "next";
import FeatureGrid from "@/src/components/sections/FeatureGrid";
import Hero from "@/src/components/sections/Hero";
import PlanningProcess from "@/src/components/sections/PlanningProcess";
import TestimonialsGrid from "@/src/components/sections/TestimonialsGrid";
import TrustSignals from "@/src/components/sections/TrustSignals";
import { fetchSanitySafe } from "@/sanity/lib/client";
import {
  PAGE_HOME_QUERY,
  PRICING_PACKAGES_QUERY,
  TESTIMONIALS_QUERY
} from "@/sanity/lib/queries";
import { buildSanityImageUrl, type SanityImageWithAlt } from "@/sanity/lib/image";
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
import { BRAND_IMAGE_SOURCES, BRAND_TESTIMONIAL_IMAGE_SOURCES } from "@/src/lib/brand";

type HomePageDocument = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: SanityImageWithAlt | null;
  primaryCta?: SanityCta | null;
  seo?: RouteSeoFields | null;
  featuredTestimonials?: SanityTestimonialDocument[] | null;
  featuredPackages?: SanityPricingPackageDocument[] | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "Tulum Living Weddings",
  title: "Welcome to Tulum Living Weddings and Events!",
  description:
    "Congratulations on your engagement. We have been planning destination weddings in Tulum since 2009, from beach celebrations to cenote and jungle events.",
  ctaLabel: "Start planning your wedding",
  ctaHref: "/contact"
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
    role: item.location ?? item.eventType ?? undefined,
    imageUrl:
      (item.image ? buildSanityImageUrl(item.image, { width: 960, height: 640, fit: "crop" }) : null) ??
      BRAND_TESTIMONIAL_IMAGE_SOURCES[item.sortOrder % BRAND_TESTIMONIAL_IMAGE_SOURCES.length]
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
        backgroundImageUrl={
          (page?.heroImage ? buildSanityImageUrl(page.heroImage, { width: 1800, height: 1100, fit: "crop" }) : null) ??
          BRAND_IMAGE_SOURCES.homeHero
        }
      />
      <TrustSignals
        signals={[
          { value: "300+", label: "celebrations curated" },
          { value: "15+", label: "years of Riviera Maya expertise" },
          { value: "40+", label: "exclusive venues and trusted partners" },
          { value: "4.9/5", label: "average couple satisfaction" }
        ]}
      />
      <FeatureGrid heading="Signature planning experiences" features={featureItems.length > 0 ? featureItems : undefined} />
      <PlanningProcess />
      <TestimonialsGrid
        heading="Stories from recent celebrations"
        testimonials={testimonialItems.length > 0 ? testimonialItems : undefined}
      />
    </main>
  );
}
