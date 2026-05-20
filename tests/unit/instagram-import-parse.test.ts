import { describe, expect, it } from "vitest";
import { normalizeInstagramRow } from "@/scripts/import-instagram-manual.mjs";

describe("normalizeInstagramRow", () => {
  it("normalizes an instagram row into gallery payload fields", () => {
    const mapped = normalizeInstagramRow({
      title: "Cenote Wedding",
      category: "Beach Ceremony",
      permalink: "https://instagram.com/p/abc123"
    });

    expect(mapped.source).toBe("instagram");
    expect(mapped.category).toBe("ceremony");
  });
});
