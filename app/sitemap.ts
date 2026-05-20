import type { MetadataRoute } from "next";
import { CANONICAL_ROUTES, SITE_URL, buildCanonicalUrl } from "@/src/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return CANONICAL_ROUTES.map((route) => ({
    url: buildCanonicalUrl(SITE_URL, route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));
}
