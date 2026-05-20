type JsonLdRecord = Record<string, unknown>;

const DEFAULT_SITE_URL = "https://www.tulumlivingweddings.com";

function normalizeSiteUrl(siteUrl: string) {
  const trimmed = siteUrl.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);
export const SITE_NAME = "Tulum Living Weddings";
export const SITE_DESCRIPTION =
  "Destination wedding planning and design services for couples celebrating in Tulum and across the Riviera Maya.";

export const CANONICAL_ROUTES = [
  "/",
  "/how-we-can-help",
  "/so-why-us",
  "/gallery",
  "/testimonials",
  "/faq",
  "/pricing",
  "/contact"
] as const;

export function buildCanonicalUrl(siteUrl: string, path: string) {
  const normalizedSite = siteUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  if (!normalizedPath) {
    return normalizedSite;
  }

  return `${normalizedSite}/${normalizedPath}`;
}

export function buildLocalBusinessJsonLd(siteUrl = SITE_URL): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    image: buildCanonicalUrl(siteUrl, "/og-image.jpg"),
    areaServed: ["Tulum", "Riviera Maya"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@tulumlivingweddings.com",
        availableLanguage: ["English", "Spanish"]
      }
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tulum",
      addressRegion: "Quintana Roo",
      addressCountry: "MX"
    }
  };
}

export function buildWebSiteJsonLd(siteUrl = SITE_URL): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/faq?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildSitewideJsonLd(siteUrl = SITE_URL): JsonLdRecord[] {
  return [buildLocalBusinessJsonLd(siteUrl), buildWebSiteJsonLd(siteUrl)];
}
