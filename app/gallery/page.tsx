import { cache } from "react";
import type { Metadata } from "next";
import EditorialMotifPanel from "@/src/components/sections/EditorialMotifPanel";
import GalleryGrid from "@/src/components/sections/GalleryGrid";
import Hero from "@/src/components/sections/Hero";
import { fetchSanitySafe } from "@/sanity/lib/client";
import {
  GALLERY_ITEMS_QUERY,
  PAGE_GALLERY_QUERY
} from "@/sanity/lib/queries";
import type { SanityGalleryItemDocument } from "@/src/lib/content";
import { mapGalleryItems } from "@/src/lib/content";
import { resolveMarketingCopy } from "@/src/lib/copy";
import { buildRouteMetadata, type RouteSeoFields } from "@/src/lib/route-metadata";
import { BRAND_GALLERY_IMAGE_SOURCES, BRAND_IMAGE_SOURCES } from "@/src/lib/brand";
import { buildSanityImageUrl } from "@/sanity/lib/image";

type GalleryPageDocument = {
  title?: string | null;
  intro?: string | null;
  seo?: RouteSeoFields | null;
  featuredItems?: SanityGalleryItemDocument[] | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "Gallery",
  title: "Gallery of inspiration",
  description:
    "Explore a curated visual library of ceremonies, styling, entertainment, and atmosphere across Riviera Maya celebrations."
};

const getGalleryData = cache(async () => {
  const [page, galleryItems] = await Promise.all([
    fetchSanitySafe<GalleryPageDocument | null>(PAGE_GALLERY_QUERY, null),
    fetchSanitySafe<SanityGalleryItemDocument[]>(GALLERY_ITEMS_QUERY, [])
  ]);

  return { page, galleryItems };
});

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getGalleryData();

  return buildRouteMetadata({
    routePath: "/gallery",
    fallbackTitle: FALLBACK_CONTENT.title,
    fallbackDescription: FALLBACK_CONTENT.description,
    seo: page?.seo
  });
}

export default async function GalleryPage() {
  const { page, galleryItems } = await getGalleryData();
  const mappedItems = mapGalleryItems(
    page?.featuredItems && page.featuredItems.length > 0
      ? page.featuredItems
      : galleryItems
  ).map((item) => ({
    title: item.title,
    caption:
      item.category && item.category.trim().length > 0
        ? `${item.category} inspiration${item.source === "instagram" ? " from Instagram" : ""}`
        : "Destination wedding design inspiration",
    imageUrl:
      (item.images[0] ? buildSanityImageUrl(item.images[0], { width: 900, height: 600, fit: "crop" }) : null) ??
      BRAND_GALLERY_IMAGE_SOURCES[item.sortOrder % BRAND_GALLERY_IMAGE_SOURCES.length]
  }));

  return (
    <main>
      <Hero
        eyebrow={FALLBACK_CONTENT.eyebrow}
        kicker="A visual moodbook of Riviera Maya light, texture, and celebration."
        title={resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
        description={resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
        backgroundImageUrl={BRAND_IMAGE_SOURCES.galleryHero}
      />
      <EditorialMotifPanel
        label="Visual Direction"
        headline="Curated imagery that informs design, styling, and emotional tone."
        detail="Use this collection as a refined reference for ceremony architecture, reception atmosphere, and guest experience moments."
        tags={["Ceremony Styling", "Reception Atmosphere", "Editorial Photography"]}
      />
      <GalleryGrid items={mappedItems.length > 0 ? mappedItems : undefined} />
    </main>
  );
}
