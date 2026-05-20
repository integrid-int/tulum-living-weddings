import { cache } from "react";
import type { Metadata } from "next";
import FeatureGrid from "@/src/components/sections/FeatureGrid";
import Hero from "@/src/components/sections/Hero";
import PricingCards from "@/src/components/sections/PricingCards";
import { fetchSanitySafe } from "@/sanity/lib/client";
import {
  PAGE_HOW_WE_HELP_QUERY,
  PRICING_PACKAGES_QUERY
} from "@/sanity/lib/queries";
import type { SanityCta, SanityPricingPackageDocument } from "@/src/lib/content";
import { mapPricingPackages } from "@/src/lib/content";
import { resolveMarketingCopy } from "@/src/lib/copy";
import { buildRouteMetadata, type RouteSeoFields } from "@/src/lib/route-metadata";
import { BRAND_IMAGE_SOURCES } from "@/src/lib/brand";

type HowWeHelpPageDocument = {
  title?: string | null;
  intro?: string | null;
  serviceBlocks?: Array<{ heading?: string | null; description?: string | null }> | null;
  primaryCta?: SanityCta | null;
  seo?: RouteSeoFields | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "How We Can Help",
  title: "How we can help",
  description:
    "From flowers and decor to entertainment and logistics, we coordinate trusted local experts to bring your destination wedding vision to life.",
  ctaLabel: "Contact us",
  ctaHref: "/contact"
};

const getHowWeHelpData = cache(async () => {
  const [page, pricingPackages] = await Promise.all([
    fetchSanitySafe<HowWeHelpPageDocument | null>(PAGE_HOW_WE_HELP_QUERY, null),
    fetchSanitySafe<SanityPricingPackageDocument[]>(PRICING_PACKAGES_QUERY, [])
  ]);

  return { page, pricingPackages };
});

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getHowWeHelpData();

  return buildRouteMetadata({
    routePath: "/how-we-can-help",
    fallbackTitle: FALLBACK_CONTENT.title,
    fallbackDescription: FALLBACK_CONTENT.description,
    seo: page?.seo
  });
}

export default async function HowWeCanHelpPage() {
  const { page, pricingPackages } = await getHowWeHelpData();
  const packageCards = mapPricingPackages(pricingPackages).map((pkg) => ({
    name: pkg.packageName,
    price: pkg.priceLabel,
    features: pkg.inclusions
  }));
  const supportTracks =
    page?.serviceBlocks
      ?.filter((block) => block.heading?.trim())
      .map((block) => ({
        title: block.heading?.trim() ?? "",
        description: block.description?.trim() || "Tailored support for this planning phase."
      })) ?? [];

  return (
    <main>
      <Hero
        eyebrow={FALLBACK_CONTENT.eyebrow}
        title={resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
        description={resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
        ctaLabel={page?.primaryCta?.label?.trim() || FALLBACK_CONTENT.ctaLabel}
        ctaHref={page?.primaryCta?.href?.trim() || FALLBACK_CONTENT.ctaHref}
        backgroundImageUrl={BRAND_IMAGE_SOURCES.howWeHelpHero}
      />
      <FeatureGrid heading="Support tracks" features={supportTracks.length > 0 ? supportTracks : undefined} />
      <PricingCards
        heading="Packages aligned to support level"
        tiers={packageCards.length > 0 ? packageCards : undefined}
      />
    </main>
  );
}
