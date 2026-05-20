import { readSanityEnv } from "@/sanity/env";

export type SanityImageAssetReference = {
  _ref: string;
  _type?: "reference";
};

export type SanityImageField = {
  asset?: SanityImageAssetReference | null;
  crop?: Record<string, unknown> | null;
  hotspot?: Record<string, unknown> | null;
};

export type SanityImageWithAlt = {
  image?: SanityImageField | null;
  alt?: string | null;
};

export type SanityImageUrlOptions = {
  width?: number;
  height?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  autoFormat?: boolean;
};

function parseAssetRef(assetRef: string): { assetId: string; dimensions: string; format: string } | null {
  const [assetType, assetId, dimensions, format] = assetRef.split("-");

  if (assetType !== "image" || !assetId || !dimensions || !format) {
    return null;
  }

  return { assetId, dimensions, format };
}

export function getSanityImageAssetRef(image: SanityImageWithAlt | null | undefined): string | null {
  return image?.image?.asset?._ref ?? null;
}

export function buildSanityImageUrl(
  image: SanityImageWithAlt | null | undefined,
  options: SanityImageUrlOptions = {}
): string | null {
  const assetRef = getSanityImageAssetRef(image);

  if (!assetRef) {
    return null;
  }

  const parsedAsset = parseAssetRef(assetRef);

  if (!parsedAsset) {
    return null;
  }

  const env = readSanityEnv();
  const url = new URL(
    `https://cdn.sanity.io/images/${env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${env.NEXT_PUBLIC_SANITY_DATASET}/${parsedAsset.assetId}-${parsedAsset.dimensions}.${parsedAsset.format}`
  );

  if (options.width !== undefined) {
    url.searchParams.set("w", String(options.width));
  }

  if (options.height !== undefined) {
    url.searchParams.set("h", String(options.height));
  }

  if (options.fit) {
    url.searchParams.set("fit", options.fit);
  }

  if (options.autoFormat ?? true) {
    url.searchParams.set("auto", "format");
  }

  return url.toString();
}
