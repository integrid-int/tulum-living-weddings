import { describe, expect, it } from "vitest";
import {
  mapFaqItems,
  mapGalleryItems,
  mapPricingPackages,
  mapTestimonials
} from "@/src/lib/content";

describe("mapFaqItems", () => {
  it("maps sanity faq docs into ui shape", () => {
    const mapped = mapFaqItems([{ _id: "1", question: "Q?", answer: [{ _type: "block", children: [] }] }]);
    expect(mapped[0].id).toBe("1");
    expect(mapped[0].question).toBe("Q?");
  });
});

describe("mapGalleryItems", () => {
  it("applies defaults for optional gallery fields", () => {
    const mapped = mapGalleryItems([
      {
        _id: "g1",
        title: "Beach Ceremony",
        category: "ceremony",
        source: "manual"
      }
    ]);

    expect(mapped[0]).toMatchObject({
      id: "g1",
      title: "Beach Ceremony",
      category: "ceremony",
      source: "manual",
      images: [],
      instagramPermalink: null,
      isFeatured: false,
      sortOrder: 0
    });
  });
});

describe("mapTestimonials", () => {
  it("applies defaults for nullable testimonial fields", () => {
    const mapped = mapTestimonials([
      {
        _id: "t1",
        coupleName: "Ana & Luis",
        quote: "Great wedding planning support."
      }
    ]);

    expect(mapped[0]).toMatchObject({
      id: "t1",
      coupleName: "Ana & Luis",
      quote: "Great wedding planning support.",
      eventType: null,
      eventDate: null,
      location: null,
      image: null,
      isFeatured: false,
      sortOrder: 0
    });
  });
});

describe("mapPricingPackages", () => {
  it("applies defaults for optional pricing fields", () => {
    const mapped = mapPricingPackages([
      {
        _id: "p1",
        packageName: "Essential",
        priceLabel: "$1500"
      }
    ]);

    expect(mapped[0]).toMatchObject({
      id: "p1",
      packageName: "Essential",
      summary: null,
      priceLabel: "$1500",
      inclusions: [],
      addOns: [],
      cta: null,
      isFeatured: false,
      sortOrder: 0
    });
  });
});
