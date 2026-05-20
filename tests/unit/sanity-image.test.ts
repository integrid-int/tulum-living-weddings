import { createImageUrlBuilder } from "@sanity/image-url";
import { afterEach, describe, expect, it } from "vitest";

import { readSanityEnv } from "@/sanity/env";
import { buildSanityImageUrl } from "@/sanity/lib/image";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("buildSanityImageUrl", () => {
  it("matches official Sanity builder output for cropped/hotspot images", () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "project123";
    process.env.NEXT_PUBLIC_SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
    process.env.NEXT_PUBLIC_SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01";

    const source = {
      image: {
        asset: { _ref: "image-abc123-1200x800-jpg" },
        crop: { _type: "sanity.imageCrop", top: 0.1, bottom: 0.2, left: 0.05, right: 0.05 },
        hotspot: { _type: "sanity.imageHotspot", x: 0.5, y: 0.4, height: 0.5, width: 0.5 }
      },
      alt: "Wedding ceremony"
    };

    const env = readSanityEnv();
    const expected = createImageUrlBuilder({
      projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: env.NEXT_PUBLIC_SANITY_DATASET
    })
      .image(source.image)
      .width(600)
      .height(400)
      .fit("crop")
      .auto("format")
      .url();

    const actual = buildSanityImageUrl(source, {
      width: 600,
      height: 400,
      fit: "crop"
    });

    expect(actual).toBe(expected);
  });
});
