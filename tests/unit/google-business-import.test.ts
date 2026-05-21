import { describe, expect, it } from "vitest";
import {
  buildGooglePlacePhotoUrl,
  normalizeGoogleBusinessPayload,
  normalizeGoogleReview
} from "@/scripts/import-google-business.mjs";

describe("buildGooglePlacePhotoUrl", () => {
  it("builds Google Places photo URL with encoded key and reference", () => {
    const url = buildGooglePlacePhotoUrl({
      apiKey: "my-key",
      photoReference: "abc123",
      maxWidth: 1200
    });

    expect(url).toContain("https://maps.googleapis.com/maps/api/place/photo");
    expect(url).toContain("photo_reference=abc123");
    expect(url).toContain("maxwidth=1200");
    expect(url).toContain("key=my-key");
  });
});

describe("normalizeGoogleReview", () => {
  it("maps valid review objects into testimonial documents", () => {
    const testimonial = normalizeGoogleReview(
      {
        author_name: "Sophia & Daniel",
        text: "From the first call to wedding day, the team managed every detail with elegance and calm precision.",
        time: 1715644800,
        rating: 5
      },
      { placeSlug: "tulum-living-weddings", index: 0 }
    );

    expect(testimonial).toMatchObject({
      _type: "testimonial",
      coupleName: "Sophia & Daniel",
      eventType: "Google Review • 5★",
      isFeatured: true
    });
  });

  it("returns null for reviews that are too short", () => {
    const testimonial = normalizeGoogleReview(
      {
        author_name: "A Reviewer",
        text: "Great!",
        time: 1715644800,
        rating: 5
      },
      { placeSlug: "tulum-living-weddings", index: 0 }
    );

    expect(testimonial).toBeNull();
  });
});

describe("normalizeGoogleBusinessPayload", () => {
  it("maps place details into review and photo import records", () => {
    const payload = normalizeGoogleBusinessPayload({
      place: {
        name: "Tulum Living Weddings"
      },
      details: {
        reviews: [
          {
            author_name: "Reviewer One",
            text: "Absolutely incredible planning support with world-class communication and execution throughout our wedding weekend.",
            time: 1715644800,
            rating: 5
          }
        ],
        photos: [
          { photo_reference: "ref-1" },
          { photo_reference: "ref-2" }
        ]
      },
      apiKey: "key123",
      maxReviews: 5,
      maxPhotos: 2
    });

    expect(payload.placeName).toBe("Tulum Living Weddings");
    expect(payload.testimonials).toHaveLength(1);
    expect(payload.galleryItems).toHaveLength(2);
    expect(payload.galleryItems[0]?.images?.[0]?.image?.asset?._ref).toContain("google-photo");
  });
});
