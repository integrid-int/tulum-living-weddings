import { cache } from "react";
import type { Metadata } from "next";
import EditorialMotifPanel from "@/src/components/sections/EditorialMotifPanel";
import Hero from "@/src/components/sections/Hero";
import PricingCards from "@/src/components/sections/PricingCards";
import JsonLd from "@/src/components/seo/JsonLd";
import { fetchSanitySafe } from "@/sanity/lib/client";
import {
  PAGE_PRICING_QUERY,
  PRICING_PACKAGES_QUERY
} from "@/sanity/lib/queries";
import type {
  SanityCta,
  SanityPricingPackageDocument
} from "@/src/lib/content";
import { mapPricingPackages } from "@/src/lib/content";
import { resolveMarketingCopy } from "@/src/lib/copy";
import { buildRouteMetadata, type RouteSeoFields } from "@/src/lib/route-metadata";
import { buildPricingServiceJsonLd } from "@/src/lib/seo";
import { BRAND_IMAGE_SOURCES } from "@/src/lib/brand";

type PricingPageDocument = {
  title?: string | null;
  intro?: string | null;
  primaryCta?: SanityCta | null;
  seo?: RouteSeoFields | null;
  featuredPackages?: SanityPricingPackageDocument[] | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "Pricing",
  title: "Planning packages",
  description:
    "Flexible investment structures tailored to your celebration scope, from strategic advisory to full weekend production leadership.",
  ctaLabel: "Request private proposal",
  ctaHref: "/contact"
};

const FALLBACK_TIERS = [
  {
    name: "Planning Essentials",
    price: "From $2,500",
    features: ["Venue and vendor shortlist", "Budget mapping", "Monthly planning calls"]
  },
  {
    name: "Signature Planning",
    price: "From $5,500",
    features: ["Full vendor coordination", "Design direction", "Timeline and logistics management"]
  },
  {
    name: "Weekend Concierge",
    price: "Custom",
    features: ["Multi-day event support", "On-site coordination team", "Guest experience management"]
  }
];

const getPricingData = cache(async () => {
  const [page, packages] = await Promise.all([
    fetchSanitySafe<PricingPageDocument | null>(PAGE_PRICING_QUERY, null),
    fetchSanitySafe<SanityPricingPackageDocument[]>(PRICING_PACKAGES_QUERY, [])
  ]);

  return { page, packages };
});

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getPricingData();

  return buildRouteMetadata({
    routePath: "/pricing",
    fallbackTitle: FALLBACK_CONTENT.title,
    fallbackDescription: FALLBACK_CONTENT.description,
    seo: page?.seo
  });
}

export default async function PricingPage() {
  const { page, packages } = await getPricingData();
  const pricingTiers = mapPricingPackages(
    page?.featuredPackages && page.featuredPackages.length > 0
      ? page.featuredPackages
      : packages
  ).map((pkg) => ({
    name: pkg.packageName,
    price: pkg.priceLabel,
    features: pkg.inclusions
  }));

  const renderedTiers = pricingTiers.length > 0 ? pricingTiers : FALLBACK_TIERS;
  const pricingJsonLd = buildPricingServiceJsonLd(
    renderedTiers.map((tier) => ({
      packageName: tier.name,
      summary: tier.features.join(", "),
      priceLabel: tier.price
    }))
  );

  return (
    <main>
      <JsonLd data={pricingJsonLd} />
      <Hero
        eyebrow={FALLBACK_CONTENT.eyebrow}
        kicker="Investment options designed around scope, style, and execution standard."
        title={resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
        description={resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
        ctaLabel={page?.primaryCta?.label?.trim() || FALLBACK_CONTENT.ctaLabel}
        ctaHref={page?.primaryCta?.href?.trim() || FALLBACK_CONTENT.ctaHref}
        backgroundImageUrl={BRAND_IMAGE_SOURCES.pricingHero}
      />
      <EditorialMotifPanel
        label="Investment Philosophy"
        headline="Flexible scopes. Non-negotiable standards."
        detail="Every package protects creative quality, operational precision, and the guest experience your celebration deserves."
        tags={["Transparent Scope", "Luxury Standards", "Execution Control"]}
      />
      <PricingCards tiers={renderedTiers} />
    </main>
  );
}
