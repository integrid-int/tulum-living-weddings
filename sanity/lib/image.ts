import { createImageUrlBuilder } from "@sanity/image-url";

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

export type SanityImageSource = SanityImageWithAlt | SanityImageField | null | undefined;

export type SanityImageUrlOptions = {
  width?: number;
  height?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  autoFormat?: boolean;
};

function resolveSanityImageSource(source: SanityImageSource): SanityImageField | null {
  if (!source) {
    return null;
  }

  if ("image" in source) {
    return source.image ?? null;
  }

  if ("asset" in source || "crop" in source || "hotspot" in source) {
    return source;
  }

  return null;
}

export function getSanityImageAssetRef(source: SanityImageSource): string | null {
  return resolveSanityImageSource(source)?.asset?._ref ?? null;
}

export function getSanityImageBuilder(source: SanityImageSource) {
  const imageSource = resolveSanityImageSource(source);

  if (!imageSource?.asset?._ref) {
    return null;
  }

  const env = readSanityEnv();

  return createImageUrlBuilder({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET
  }).image(imageSource);
}

export function buildSanityImageUrl(
  source: SanityImageSource,
  options: SanityImageUrlOptions = {}
): string | null {
  let builder = getSanityImageBuilder(source);

  if (!builder) {
    return null;
  }

  if (options.width !== undefined) {
    builder = builder.width(options.width);
  }

  if (options.height !== undefined) {
    builder = builder.height(options.height);
  }

  if (options.fit) {
    builder = builder.fit(options.fit);
  }

  if (options.autoFormat ?? true) {
    builder = builder.auto("format");
  }

  return builder.url();
}
