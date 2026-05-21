#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "next-sanity";

const GOOGLE_FIND_PLACE_ENDPOINT = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const GOOGLE_PLACE_DETAILS_ENDPOINT = "https://maps.googleapis.com/maps/api/place/details/json";
const GOOGLE_PLACE_PHOTO_ENDPOINT = "https://maps.googleapis.com/maps/api/place/photo";
const DEFAULT_API_VERSION = "2026-01-01";
const DEFAULT_PLACE_QUERY = "Tulum Living Weddings Riviera Maya";

function toSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parsePositiveNumber(value, fallback) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function buildGooglePlacePhotoUrl({ apiKey, photoReference, maxWidth = 1600 }) {
  const params = new URLSearchParams({
    maxwidth: String(maxWidth),
    photo_reference: photoReference,
    key: apiKey
  });

  return `${GOOGLE_PLACE_PHOTO_ENDPOINT}?${params.toString()}`;
}

export function normalizeGoogleReview(review, { placeSlug, index }) {
  const quote = String(review?.text ?? "").trim();
  const author = String(review?.author_name ?? "").trim() || `Google Reviewer ${index + 1}`;
  const rating = Number(review?.rating ?? 0);
  if (quote.length < 20) {
    return null;
  }

  const time = Number.parseInt(String(review?.time ?? 0), 10);
  const date = Number.isFinite(time) && time > 0
    ? new Date(time * 1000).toISOString().slice(0, 10)
    : null;

  return {
    _id: `google-review-${placeSlug}-${index + 1}`,
    _type: "testimonial",
    coupleName: author,
    eventType: rating > 0 ? `Google Review • ${rating}★` : "Google Review",
    eventDate: date,
    location: "Riviera Maya",
    quote,
    isFeatured: index < 3,
    sortOrder: index + 1
  };
}

function normalizeGooglePhoto({ photo, placeSlug, placeName, index }) {
  return {
    _id: `google-gallery-${placeSlug}-${index + 1}`,
    _type: "galleryItem",
    title: `${placeName} guest moment ${index + 1}`,
    category: "google-reviews",
    images: [
      {
        _type: "imageWithAlt",
        alt: `${placeName} Google photo ${index + 1}`,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: `google-photo-${placeSlug}-${index + 1}`
          }
        }
      }
    ],
    source: "manual",
    isFeatured: index < 6,
    sortOrder: index + 1,
    _googlePhotoReference: String(photo.photo_reference ?? "").trim()
  };
}

export function normalizeGoogleBusinessPayload({
  place,
  details,
  apiKey,
  maxReviews = 12,
  maxPhotos = 12
}) {
  const placeName = String(place?.name ?? details?.name ?? "Google Business Listing").trim();
  const placeSlug = toSlug(placeName) || "google-business";

  const testimonials = (Array.isArray(details?.reviews) ? details.reviews : [])
    .slice(0, maxReviews)
    .map((review, index) => normalizeGoogleReview(review, { placeSlug, index }))
    .filter(Boolean);

  const galleryItems = (Array.isArray(details?.photos) ? details.photos : [])
    .slice(0, maxPhotos)
    .map((photo, index) => normalizeGooglePhoto({ photo, placeSlug, placeName, index }))
    .filter((item) => item._googlePhotoReference.length > 0)
    .map((item) => ({
      ...item,
      _googlePhotoUrl: buildGooglePlacePhotoUrl({
        apiKey,
        photoReference: item._googlePhotoReference,
        maxWidth: 1600
      })
    }));

  return { placeName, placeSlug, testimonials, galleryItems };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0"
    }
  });
  if (!response.ok) {
    throw new Error(`Google API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function findGooglePlaceByQuery({ apiKey, query }) {
  const params = new URLSearchParams({
    input: query,
    inputtype: "textquery",
    fields: "place_id,name",
    key: apiKey
  });

  const json = await fetchJson(`${GOOGLE_FIND_PLACE_ENDPOINT}?${params.toString()}`);
  if (json.status !== "OK" || !Array.isArray(json.candidates) || json.candidates.length === 0) {
    throw new Error(`Could not find a place for query "${query}". Google status: ${json.status}`);
  }

  return json.candidates[0];
}

async function fetchGooglePlaceDetails({ apiKey, placeId }) {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: "name,rating,user_ratings_total,reviews,photos,url",
    reviews_sort: "newest",
    key: apiKey
  });

  const json = await fetchJson(`${GOOGLE_PLACE_DETAILS_ENDPOINT}?${params.toString()}`);
  if (json.status !== "OK" || !json.result) {
    throw new Error(`Could not fetch place details for place_id=${placeId}. Google status: ${json.status}`);
  }

  return json.result;
}

async function uploadGooglePhotoToSanity({ sanityClient, photoUrl, fallbackFilename }) {
  const response = await fetch(photoUrl, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) {
    throw new Error(`Failed to download Google photo: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const fileBuffer = Buffer.from(await response.arrayBuffer());

  const asset = await sanityClient.assets.upload("image", fileBuffer, {
    filename: fallbackFilename,
    contentType
  });

  return asset._id;
}

function toReferenceArray(ids) {
  return ids.map((id) => ({ _type: "reference", _ref: id }));
}

function mergeUniqueReferences(newIds, existingIds = [], limit = 12) {
  const merged = [];
  const seen = new Set();
  for (const id of [...newIds, ...existingIds]) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    merged.push(id);
    if (merged.length >= limit) break;
  }
  return merged;
}

async function patchFeaturedCollections({ sanityClient, galleryIds, testimonialIds }) {
  const galleryPage = await sanityClient.fetch(
    `*[_id == "page.gallery"][0]{ "ids": featuredItems[]._ref }`
  );
  const testimonialsPage = await sanityClient.fetch(
    `*[_id == "page.testimonials"][0]{ "ids": featuredTestimonials[]._ref }`
  );
  const homePage = await sanityClient.fetch(
    `*[_id == "page.home"][0]{ "galleryIds": featuredGalleryItems[]._ref, "testimonialIds": featuredTestimonials[]._ref }`
  );

  const nextGalleryPageIds = mergeUniqueReferences(galleryIds, galleryPage?.ids, 12);
  const nextTestimonialsPageIds = mergeUniqueReferences(testimonialIds, testimonialsPage?.ids, 12);
  const nextHomeGalleryIds = mergeUniqueReferences(galleryIds, homePage?.galleryIds, 8);
  const nextHomeTestimonialIds = mergeUniqueReferences(testimonialIds, homePage?.testimonialIds, 8);

  await Promise.all([
    sanityClient.patch("page.gallery").set({ featuredItems: toReferenceArray(nextGalleryPageIds) }).commit(),
    sanityClient.patch("page.testimonials").set({ featuredTestimonials: toReferenceArray(nextTestimonialsPageIds) }).commit(),
    sanityClient.patch("page.home").set({
      featuredGalleryItems: toReferenceArray(nextHomeGalleryIds),
      featuredTestimonials: toReferenceArray(nextHomeTestimonialIds)
    }).commit()
  ]);
}

function parseCliArgs(argv) {
  const args = {
    dryRun: false,
    apply: false,
    maxReviews: 12,
    maxPhotos: 12
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    const next = argv[i + 1];

    if (current === "--api-key" && next) {
      args.apiKey = next;
      i += 1;
      continue;
    }
    if (current === "--place-id" && next) {
      args.placeId = next;
      i += 1;
      continue;
    }
    if (current === "--place-query" && next) {
      args.placeQuery = next;
      i += 1;
      continue;
    }
    if (current === "--share-url" && next) {
      args.shareUrl = next;
      i += 1;
      continue;
    }
    if (current === "--output" && next) {
      args.output = next;
      i += 1;
      continue;
    }
    if (current === "--max-reviews" && next) {
      args.maxReviews = parsePositiveNumber(next, 12);
      i += 1;
      continue;
    }
    if (current === "--max-photos" && next) {
      args.maxPhotos = parsePositiveNumber(next, 12);
      i += 1;
      continue;
    }
    if (current === "--sanity-project-id" && next) {
      args.sanityProjectId = next;
      i += 1;
      continue;
    }
    if (current === "--sanity-dataset" && next) {
      args.sanityDataset = next;
      i += 1;
      continue;
    }
    if (current === "--sanity-token" && next) {
      args.sanityToken = next;
      i += 1;
      continue;
    }
    if (current === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (current === "--apply") {
      args.apply = true;
      continue;
    }
    if (current === "--help" || current === "-h") {
      args.help = true;
      continue;
    }

    throw new Error(`Unknown argument: ${current}`);
  }

  return args;
}

function printUsage() {
  console.log(`Google Business importer (reviews + photos)

Usage:
  node scripts/import-google-business.mjs --api-key <google_places_api_key> --place-query "Tulum Living Weddings" --dry-run
  node scripts/import-google-business.mjs --api-key <google_places_api_key> --place-id <google_place_id> --apply --sanity-token <token>

Options:
  --api-key <key>               Google Places API key (required)
  --place-query "<query>"       Query for Find Place API lookup
  --place-id <id>               Google place_id (skips query lookup)
  --share-url <url>             Optional reference for your records (not auto-resolved here)
  --max-reviews <n>             Maximum reviews to import (default: 12)
  --max-photos <n>              Maximum photos to import (default: 12)
  --dry-run                     Print summary and optionally output payload JSON
  --output <file.json>          Write normalized payload to disk
  --apply                       Upload photos and upsert docs into Sanity
  --sanity-project-id <id>      Override NEXT_PUBLIC_SANITY_PROJECT_ID
  --sanity-dataset <dataset>    Override NEXT_PUBLIC_SANITY_DATASET
  --sanity-token <token>        Override SANITY_API_WRITE_TOKEN
`);
}

function getSanityConfig(args) {
  const projectId = args.sanityProjectId ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = args.sanityDataset ?? process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = args.sanityToken ?? process.env.SANITY_API_WRITE_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || DEFAULT_API_VERSION;

  if (!projectId || !dataset || !token) {
    throw new Error("Missing Sanity config. Provide project id, dataset, and token.");
  }

  return { projectId, dataset, token, apiVersion };
}

export async function runGoogleBusinessImport(argv = process.argv.slice(2)) {
  const args = parseCliArgs(argv);
  if (args.help || !args.apiKey) {
    printUsage();
    return args.help ? 0 : 1;
  }

  const place = args.placeId
    ? { place_id: args.placeId, name: args.placeQuery ?? DEFAULT_PLACE_QUERY }
    : await findGooglePlaceByQuery({
      apiKey: args.apiKey,
      query: args.placeQuery ?? DEFAULT_PLACE_QUERY
    });

  const details = await fetchGooglePlaceDetails({
    apiKey: args.apiKey,
    placeId: place.place_id
  });

  const normalized = normalizeGoogleBusinessPayload({
    place,
    details,
    apiKey: args.apiKey,
    maxReviews: args.maxReviews,
    maxPhotos: args.maxPhotos
  });

  if (args.dryRun || !args.apply) {
    const summary = {
      dryRun: true,
      shareUrl: args.shareUrl ?? null,
      placeId: place.place_id,
      placeName: normalized.placeName,
      testimonials: normalized.testimonials.length,
      galleryItems: normalized.galleryItems.length,
      previewTestimonials: normalized.testimonials.slice(0, 2).map((review) => ({
        coupleName: review.coupleName,
        eventType: review.eventType
      }))
    };

    console.log(JSON.stringify(summary, null, 2));

    if (args.output) {
      const outputPath = resolve(args.output);
      await writeFile(outputPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
      console.log(`Wrote payload to ${outputPath}`);
    }

    if (!args.apply) {
      return 0;
    }
  }

  const sanityConfig = getSanityConfig(args);
  const sanityClient = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    token: sanityConfig.token,
    apiVersion: sanityConfig.apiVersion,
    useCdn: false
  });

  const uploadedPhotoRefs = new Map();
  for (const [index, item] of normalized.galleryItems.entries()) {
    const assetRef = await uploadGooglePhotoToSanity({
      sanityClient,
      photoUrl: item._googlePhotoUrl,
      fallbackFilename: `${toSlug(normalized.placeName)}-google-photo-${index + 1}.jpg`
    });
    uploadedPhotoRefs.set(item._id, assetRef);
  }

  const galleryDocs = normalized.galleryItems.map((item) => ({
    ...item,
    images: [
      {
        _type: "imageWithAlt",
        alt: item.images[0].alt,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: uploadedPhotoRefs.get(item._id)
          }
        }
      }
    ]
  })).map((item) => {
    delete item._googlePhotoReference;
    delete item._googlePhotoUrl;
    return item;
  });

  const testimonialDocs = normalized.testimonials;

  let transaction = sanityClient.transaction();
  for (const document of [...testimonialDocs, ...galleryDocs]) {
    transaction = transaction.createOrReplace(document);
  }
  await transaction.commit();

  await patchFeaturedCollections({
    sanityClient,
    galleryIds: galleryDocs.map((item) => item._id),
    testimonialIds: testimonialDocs.map((item) => item._id)
  });

  console.log(
    JSON.stringify(
      {
        applied: true,
        placeId: place.place_id,
        placeName: normalized.placeName,
        testimonialsUpserted: testimonialDocs.length,
        galleryItemsUpserted: galleryDocs.length,
        pagesPatched: ["page.gallery", "page.testimonials", "page.home"]
      },
      null,
      2
    )
  );

  return 0;
}

function isMainModule() {
  if (!process.argv[1]) {
    return false;
  }
  return import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
}

if (isMainModule()) {
  runGoogleBusinessImport().then((code) => {
    if (code !== 0) {
      process.exit(code);
    }
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
