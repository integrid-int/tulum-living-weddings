import { describe, expect, it } from "vitest";

import { BRAND_COLORS, BRAND_IMAGE_SOURCES } from "@/src/lib/brand";
import {
  ORIGINAL_SEED_DATA,
  collectSeedImageUrls,
  createSeedDocuments
} from "@/scripts/seed-original-site-content.mjs";

describe("brand tokens", () => {
  it("matches original site palette and image sources", () => {
    expect(BRAND_COLORS.primary).toBe("#c34d5f");
    expect(BRAND_COLORS.sand).toBe("#dacbb2");
    expect(BRAND_COLORS.accent).toBe("#f8ba50");
    expect(BRAND_IMAGE_SOURCES.logo).toContain("tulumlivingweddings.com");
    expect(BRAND_IMAGE_SOURCES.homeHero).toContain("tulumlivingweddings.com");
  });
});

describe("createSeedDocuments", () => {
  it("builds singleton pages and collections from original content", () => {
    const imageRefs = new Map(
      collectSeedImageUrls(ORIGINAL_SEED_DATA).map((url, index) => [
        url,
        `image-seed-${index}-1600x1067-jpg`
      ])
    );

    const documents = createSeedDocuments(ORIGINAL_SEED_DATA, imageRefs);
    const ids = documents.map((doc) => doc._id);

    expect(ids).toContain("navigation.main");
    expect(ids).toContain("siteSettings.main");
    expect(ids).toContain("page.home");
    expect(ids).toContain("page.contact");
    expect(ids).toContain("pricing.signature-planning");
    expect(ids).toContain("faq.start-planning-timeline");
    expect(ids).toContain("testimonial.kelly");
    expect(ids).toContain("gallery.beach-ceremony-hero");

    const homePage = documents.find((doc) => doc._id === "page.home");
    expect(homePage?.heroTitle).toContain("Welcome to Tulum Living Weddings and Events!");

    const galleryDoc = documents.find((doc) => doc._id === "gallery.beach-ceremony-hero");
    expect(galleryDoc?.images?.[0]?.image?.asset?._ref).toContain("image-seed");
  });
});
