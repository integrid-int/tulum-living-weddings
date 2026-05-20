import type { MetadataRoute } from "next";
import { SITE_URL, buildCanonicalUrl } from "@/src/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api"]
      }
    ],
    sitemap: buildCanonicalUrl(SITE_URL, "/sitemap.xml"),
    host: SITE_URL
  };
}
