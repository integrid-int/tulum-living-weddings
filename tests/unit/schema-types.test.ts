import { describe, expect, it } from "vitest";

import { schemaTypes } from "@/sanity/schemaTypes";

describe("sanity schema registry", () => {
  it("includes contactSubmission and galleryItem docs", () => {
    const names = schemaTypes.map((t: { name: string }) => t.name);

    expect(names).toContain("contactSubmission");
    expect(names).toContain("galleryItem");
  });
});
