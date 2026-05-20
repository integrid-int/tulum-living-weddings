import { describe, expect, it } from "vitest";
import {
  buildCanonicalUrl,
  buildFaqPageJsonLd,
  buildPricingServiceJsonLd,
  resolveSiteUrl
} from "@/src/lib/seo";

describe("resolveSiteUrl", () => {
  it("falls back to default site url when empty", () => {
    expect(resolveSiteUrl("")).toBe("https://www.tulumlivingweddings.com");
  });

  it("falls back to default site url when value is whitespace", () => {
    expect(resolveSiteUrl("   ")).toBe("https://www.tulumlivingweddings.com");
  });
});

describe("buildCanonicalUrl", () => {
  it("returns canonical root for root paths", () => {
    expect(buildCanonicalUrl("https://www.tulumlivingweddings.com", "/")).toBe("https://www.tulumlivingweddings.com");
  });

  it("concatenates site url and route safely", () => {
    expect(buildCanonicalUrl("https://www.tulumlivingweddings.com", "/faq")).toBe("https://www.tulumlivingweddings.com/faq");
  });

  it("uses fallback site url when site url is empty", () => {
    expect(buildCanonicalUrl("", "/faq")).toBe("https://www.tulumlivingweddings.com/faq");
  });
});

describe("buildFaqPageJsonLd", () => {
  it("builds FAQPage schema from FAQ items", () => {
    const faqJsonLd = buildFaqPageJsonLd([
      {
        question: "Do you coordinate venue walkthroughs?",
        answer: "Yes, we coordinate venue walkthroughs before final vendor booking."
      }
    ]);

    expect(faqJsonLd).toMatchObject({
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you coordinate venue walkthroughs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we coordinate venue walkthroughs before final vendor booking."
          }
        }
      ]
    });
  });
});

describe("buildPricingServiceJsonLd", () => {
  it("builds Service schema with Offer entries from pricing packages", () => {
    const pricingJsonLd = buildPricingServiceJsonLd([
      {
        packageName: "Signature Planning",
        summary: "End-to-end planning and design support.",
        priceLabel: "From $6,500"
      }
    ]);

    expect(pricingJsonLd).toMatchObject({
      "@type": "Service",
      offers: [
        {
          "@type": "Offer",
          name: "Signature Planning",
          description: "End-to-end planning and design support.",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "USD",
            price: "From $6,500"
          }
        }
      ]
    });
  });
});
