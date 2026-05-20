import { groq } from "next-sanity";

export const FAQ_ITEMS_QUERY = groq`*[_type == "faqItem"] | order(coalesce(sortOrder, 0) asc, _createdAt asc) {
  _id,
  question,
  answer,
  category,
  sortOrder
}`;

export const GALLERY_ITEMS_QUERY = groq`*[_type == "galleryItem"] | order(coalesce(sortOrder, 0) asc, _createdAt asc) {
  _id,
  title,
  category,
  images[] {
    alt,
    image {
      asset,
      crop,
      hotspot
    }
  },
  instagramPermalink,
  source,
  isFeatured,
  sortOrder
}`;

export const TESTIMONIALS_QUERY = groq`*[_type == "testimonial"] | order(coalesce(sortOrder, 0) asc, _createdAt asc) {
  _id,
  coupleName,
  eventType,
  eventDate,
  location,
  quote,
  image {
    alt,
    image {
      asset,
      crop,
      hotspot
    }
  },
  isFeatured,
  sortOrder
}`;

export const PRICING_PACKAGES_QUERY = groq`*[_type == "pricingPackage"] | order(coalesce(sortOrder, 0) asc, _createdAt asc) {
  _id,
  packageName,
  summary,
  priceLabel,
  inclusions,
  addOns,
  cta {
    label,
    href,
    openInNewTab
  },
  isFeatured,
  sortOrder
}`;

export const PAGE_FAQ_QUERY = groq`*[_type == "pageFaq"][0] {
  _id,
  title,
  intro,
  seo {
    title,
    description,
    ogImage {
      alt,
      image {
        asset,
        crop,
        hotspot
      }
    }
  },
  "featuredFaqItems": coalesce(featuredFaqItems[]->{
    _id,
    question,
    answer,
    category,
    sortOrder
  }, [])
}`;
