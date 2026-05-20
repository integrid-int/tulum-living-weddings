import { describe, expect, it } from "vitest";

import { schemaTypes } from "@/sanity/schemaTypes";

describe("sanity schema registry", () => {
  it("includes all required Task 3 document schemas", () => {
    const names = schemaTypes.map((t: { name: string }) => t.name);
    const requiredTask3DocumentNames = [
      "pageHome",
      "pageHowWeHelp",
      "pageWhyUs",
      "pageContact",
      "pageGallery",
      "pageTestimonials",
      "pageFaq",
      "pagePricing",
      "galleryItem",
      "testimonial",
      "faqItem",
      "pricingPackage",
      "contactSubmission"
    ];

    for (const requiredName of requiredTask3DocumentNames) {
      expect(names).toContain(requiredName);
    }
  });
});
