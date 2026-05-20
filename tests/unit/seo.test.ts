import { describe, expect, it } from "vitest";
import { buildCanonicalUrl } from "@/src/lib/seo";

describe("buildCanonicalUrl", () => {
  it("concatenates site url and route safely", () => {
    expect(buildCanonicalUrl("https://www.tulumlivingweddings.com", "/faq")).toBe("https://www.tulumlivingweddings.com/faq");
  });
});
