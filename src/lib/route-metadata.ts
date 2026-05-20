import type { Metadata } from "next";
import { resolveMarketingCopy } from "@/src/lib/copy";

export type RouteSeoFields = {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
};

type BuildRouteMetadataArgs = {
  routePath: string;
  fallbackTitle: string;
  fallbackDescription: string;
  seo?: RouteSeoFields | null;
};

function normalizeCanonicalValue(canonicalUrl: string | null | undefined, routePath: string): string {
  const trimmed = canonicalUrl?.trim();
  if (!trimmed) {
    return routePath;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function buildRouteMetadata({
  routePath,
  fallbackTitle,
  fallbackDescription,
  seo
}: BuildRouteMetadataArgs): Metadata {
  const canonical = normalizeCanonicalValue(seo?.canonicalUrl, routePath);
  const noIndex = seo?.noIndex ?? false;

  return {
    title: resolveMarketingCopy(seo?.title, fallbackTitle),
    description: resolveMarketingCopy(seo?.description, fallbackDescription),
    alternates: {
      canonical
    },
    robots: {
      index: !noIndex,
      follow: !noIndex
    }
  };
}
