import { describe, expect, it } from "vitest";
import { buildRouteMetadata } from "@/src/lib/route-metadata";

describe("buildRouteMetadata", () => {
  it("uses route path as canonical when no override is set", () => {
    const metadata = buildRouteMetadata({
      routePath: "/faq",
      fallbackTitle: "FAQ",
      fallbackDescription: "Answers to common questions"
    });

    expect(metadata.alternates?.canonical).toBe("/faq");
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("supports canonical override and noindex controls from seo fields", () => {
    const metadata = buildRouteMetadata({
      routePath: "/pricing",
      fallbackTitle: "Pricing",
      fallbackDescription: "Wedding planning package options",
      seo: {
        title: "Luxury Wedding Pricing",
        description: "Explore destination wedding planning packages.",
        canonicalUrl: "https://www.tulumlivingweddings.com/custom-pricing",
        noIndex: true
      }
    });

    expect(metadata.title).toBe("Luxury Wedding Pricing");
    expect(metadata.description).toBe("Explore destination wedding planning packages.");
    expect(metadata.alternates?.canonical).toBe("https://www.tulumlivingweddings.com/custom-pricing");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
