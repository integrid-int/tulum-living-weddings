import { describe, expect, it } from "vitest";
import { buildCanonicalUrl, resolveSiteUrl } from "@/src/lib/seo";

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
