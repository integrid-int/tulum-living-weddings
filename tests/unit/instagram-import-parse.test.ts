import { describe, expect, it } from "vitest";
import {
  normalizeInstagramRow,
  parseInstagramCsv
} from "@/scripts/import-instagram-manual.mjs";

describe("parseInstagramCsv", () => {
  it("parses multiline quoted caption rows without splitting records", () => {
    const csv = `title,category,permalink,caption
,"Beach Ceremony",https://instagram.com/p/abc123,"Line one
Line two, with comma"`;

    const rows = parseInstagramCsv(csv);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      category: "Beach Ceremony",
      permalink: "https://instagram.com/p/abc123",
      caption: "Line one\nLine two, with comma"
    });
  });
});

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

  it("uses title fallback chain and defaults sort order to zero", () => {
    const fromCaption = normalizeInstagramRow({
      title: " ",
      caption: "Caption fallback",
      headline: "Headline fallback",
      category: "event details",
      sortOrder: "not-a-number"
    });

    const fromHeadline = normalizeInstagramRow({
      title: "",
      caption: " ",
      headline: "Headline fallback",
      category: "event details"
    });

    expect(fromCaption.title).toBe("Caption fallback");
    expect(fromCaption.sortOrder).toBe(0);
    expect(fromHeadline.title).toBe("Headline fallback");
    expect(fromHeadline.sortOrder).toBe(0);
  });
});
