type JsonLdRecord = Record<string, unknown>;
type FaqJsonLdItem = { question: string; answer: string };
type PricingJsonLdItem = { packageName: string; summary?: string | null; priceLabel: string };

const DEFAULT_SITE_URL = "https://www.tulumlivingweddings.com";
export const OPENGRAPH_IMAGE_PATH = "/opengraph-image";

export function resolveSiteUrl(siteUrl?: string | null) {
  const trimmed = (siteUrl ?? "").trim();
  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsedUrl = new URL(withProtocol);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return DEFAULT_SITE_URL;
    }

    return parsedUrl.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
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
  const normalizedSite = resolveSiteUrl(siteUrl);
  const normalizedPath = path.replace(/^\/+/, "").trim();

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
    image: buildCanonicalUrl(siteUrl, OPENGRAPH_IMAGE_PATH),
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
  const faqUrl = buildCanonicalUrl(siteUrl, "/faq");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${faqUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildSitewideJsonLd(siteUrl = SITE_URL): JsonLdRecord[] {
  return [buildLocalBusinessJsonLd(siteUrl), buildWebSiteJsonLd(siteUrl)];
}

export function buildFaqPageJsonLd(items: FaqJsonLdItem[]): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildPricingServiceJsonLd(items: PricingJsonLdItem[]): JsonLdRecord {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Destination wedding planning packages",
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      url: SITE_URL
    },
    areaServed: ["Tulum", "Riviera Maya"],
    offers: items.map((item) => ({
      "@type": "Offer",
      name: item.packageName,
      description: item.summary ?? undefined,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        price: item.priceLabel
      }
    }))
  };
}
