import type { MetadataRoute } from "next";
import { CANONICAL_ROUTES, SITE_URL, buildCanonicalUrl } from "@/src/lib/seo";
import { fetchSanitySafe } from "@/sanity/lib/client";
import { SITEMAP_ROUTE_STATE_QUERY } from "@/sanity/lib/queries";

type SitemapRouteState = {
  _updatedAt?: string | null;
  noIndex?: boolean | null;
};

type SitemapDetailRoute = {
  path?: string | null;
  _updatedAt?: string | null;
};

type SitemapState = {
  home?: SitemapRouteState | null;
  howWeHelp?: SitemapRouteState | null;
  whyUs?: SitemapRouteState | null;
  galleryPage?: SitemapRouteState | null;
  testimonialsPage?: SitemapRouteState | null;
  faqPage?: SitemapRouteState | null;
  pricingPage?: SitemapRouteState | null;
  contactPage?: SitemapRouteState | null;
  galleryCollectionLastModified?: string | null;
  testimonialsCollectionLastModified?: string | null;
  faqCollectionLastModified?: string | null;
  pricingCollectionLastModified?: string | null;
  galleryDetailRoutes?: SitemapDetailRoute[] | null;
  testimonialDetailRoutes?: SitemapDetailRoute[] | null;
  faqDetailRoutes?: SitemapDetailRoute[] | null;
  pricingDetailRoutes?: SitemapDetailRoute[] | null;
};

function parseDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function pickLastModified(
  now: Date,
  pageUpdatedAt?: string | null,
  collectionUpdatedAt?: string | null
): Date {
  const candidates = [parseDate(pageUpdatedAt), parseDate(collectionUpdatedAt)].filter(
    (date): date is Date => date !== null
  );

  if (candidates.length === 0) {
    return now;
  }

  return candidates.reduce((latest, current) => (current > latest ? current : latest));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const state = await fetchSanitySafe<SitemapState | null>(SITEMAP_ROUTE_STATE_QUERY, null);

  const routeStateByPath: Record<(typeof CANONICAL_ROUTES)[number], SitemapRouteState | null | undefined> = {
    "/": state?.home,
    "/how-we-can-help": state?.howWeHelp,
    "/so-why-us": state?.whyUs,
    "/gallery": state?.galleryPage,
    "/testimonials": state?.testimonialsPage,
    "/faq": state?.faqPage,
    "/pricing": state?.pricingPage,
    "/contact": state?.contactPage
  };

  const collectionLastModifiedByPath: Partial<Record<(typeof CANONICAL_ROUTES)[number], string | null | undefined>> = {
    "/gallery": state?.galleryCollectionLastModified,
    "/testimonials": state?.testimonialsCollectionLastModified,
    "/faq": state?.faqCollectionLastModified,
    "/pricing": state?.pricingCollectionLastModified
  };

  const routeEntries: MetadataRoute.Sitemap = CANONICAL_ROUTES
    .filter((route) => !(routeStateByPath[route]?.noIndex ?? false))
    .map((route) => ({
      url: buildCanonicalUrl(SITE_URL, route),
      lastModified: pickLastModified(
        lastModified,
        routeStateByPath[route]?._updatedAt,
        collectionLastModifiedByPath[route]
      ),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : 0.7
    }));

  const detailRouteConfigs: Array<{
    parentPath: (typeof CANONICAL_ROUTES)[number];
    routes: SitemapDetailRoute[] | null | undefined;
  }> = [
    { parentPath: "/gallery", routes: state?.galleryDetailRoutes },
    { parentPath: "/testimonials", routes: state?.testimonialDetailRoutes },
    { parentPath: "/faq", routes: state?.faqDetailRoutes },
    { parentPath: "/pricing", routes: state?.pricingDetailRoutes }
  ];

  const detailEntries: MetadataRoute.Sitemap = detailRouteConfigs.flatMap(({ parentPath, routes }) => {
    if (routeStateByPath[parentPath]?.noIndex ?? false) {
      return [];
    }

    return (routes ?? [])
      .filter((item): item is SitemapDetailRoute & { path: string } => Boolean(item.path))
      .map((item) => ({
        url: buildCanonicalUrl(SITE_URL, item.path),
        lastModified: pickLastModified(lastModified, item._updatedAt),
        changeFrequency: "monthly",
        priority: 0.6
      }));
  });

  const uniqueByUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...routeEntries, ...detailEntries]) {
    uniqueByUrl.set(entry.url, entry);
  }

  return [...uniqueByUrl.values()];
}
