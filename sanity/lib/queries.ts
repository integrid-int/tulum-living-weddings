import { groq } from "next-sanity";

const SEO_FIELDS = `
  seo {
    title,
    description,
    canonicalUrl,
    noIndex,
    ogImage {
      alt,
      image {
        asset,
        crop,
        hotspot
      }
    }
  }
`;

export const FAQ_ITEMS_QUERY = groq`*[_type == "faqItem"] | order(coalesce(sortOrder, 0) asc, _createdAt asc) {
  _id,
  _updatedAt,
  question,
  answer,
  category,
  sortOrder
}`;

export const GALLERY_ITEMS_QUERY = groq`*[_type == "galleryItem"] | order(coalesce(sortOrder, 0) asc, _createdAt asc) {
  _id,
  _updatedAt,
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
  _updatedAt,
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
  _updatedAt,
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

export const PAGE_HOME_QUERY = groq`*[_type == "pageHome"][0] {
  _id,
  title,
  heroTitle,
  heroSubtitle,
  primaryCta {
    label,
    href,
    openInNewTab
  },
  ${SEO_FIELDS},
  "featuredTestimonials": coalesce(featuredTestimonials[]->{
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
  }, []),
  "featuredPackages": coalesce(featuredPackages[]->{
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
  }, []),
  "featuredGalleryItems": coalesce(featuredGalleryItems[]->{
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
  }, [])
}`;

export const PAGE_HOW_WE_HELP_QUERY = groq`*[_type == "pageHowWeHelp"][0] {
  _id,
  title,
  intro,
  serviceBlocks[] {
    heading,
    description
  },
  primaryCta {
    label,
    href,
    openInNewTab
  },
  ${SEO_FIELDS}
}`;

export const PAGE_WHY_US_QUERY = groq`*[_type == "pageWhyUs"][0] {
  _id,
  title,
  intro,
  reasons[] {
    title,
    description
  },
  primaryCta {
    label,
    href,
    openInNewTab
  },
  ${SEO_FIELDS}
}`;

export const PAGE_GALLERY_QUERY = groq`*[_type == "pageGallery"][0] {
  _id,
  title,
  intro,
  ${SEO_FIELDS},
  "featuredItems": coalesce(featuredItems[]->{
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
  }, [])
}`;

export const PAGE_TESTIMONIALS_QUERY = groq`*[_type == "pageTestimonials"][0] {
  _id,
  title,
  intro,
  ${SEO_FIELDS},
  "featuredTestimonials": coalesce(featuredTestimonials[]->{
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
  }, [])
}`;

export const PAGE_FAQ_QUERY = groq`*[_type == "pageFaq"][0] {
  _id,
  title,
  intro,
  ${SEO_FIELDS},
  "featuredFaqItems": coalesce(featuredFaqItems[]->{
    _id,
    question,
    answer,
    category,
    sortOrder
  }, [])
}`;

export const PAGE_PRICING_QUERY = groq`*[_type == "pagePricing"][0] {
  _id,
  title,
  intro,
  primaryCta {
    label,
    href,
    openInNewTab
  },
  ${SEO_FIELDS},
  "featuredPackages": coalesce(featuredPackages[]->{
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
  }, [])
}`;

export const PAGE_CONTACT_QUERY = groq`*[_type == "pageContact"][0] {
  _id,
  title,
  intro,
  contactEmail,
  contactPhone,
  submitButtonLabel,
  successMessage,
  ${SEO_FIELDS}
}`;

export const SITEMAP_ROUTE_STATE_QUERY = groq`{
  "home": *[_type == "pageHome"][0]{
    _updatedAt,
    "noIndex": coalesce(seo.noIndex, false)
  },
  "howWeHelp": *[_type == "pageHowWeHelp"][0]{
    _updatedAt,
    "noIndex": coalesce(seo.noIndex, false)
  },
  "whyUs": *[_type == "pageWhyUs"][0]{
    _updatedAt,
    "noIndex": coalesce(seo.noIndex, false)
  },
  "galleryPage": *[_type == "pageGallery"][0]{
    _updatedAt,
    "noIndex": coalesce(seo.noIndex, false)
  },
  "testimonialsPage": *[_type == "pageTestimonials"][0]{
    _updatedAt,
    "noIndex": coalesce(seo.noIndex, false)
  },
  "faqPage": *[_type == "pageFaq"][0]{
    _updatedAt,
    "noIndex": coalesce(seo.noIndex, false)
  },
  "pricingPage": *[_type == "pagePricing"][0]{
    _updatedAt,
    "noIndex": coalesce(seo.noIndex, false)
  },
  "contactPage": *[_type == "pageContact"][0]{
    _updatedAt,
    "noIndex": coalesce(seo.noIndex, false)
  },
  "galleryCollectionLastModified": *[_type == "galleryItem"] | order(_updatedAt desc)[0]._updatedAt,
  "testimonialsCollectionLastModified": *[_type == "testimonial"] | order(_updatedAt desc)[0]._updatedAt,
  "faqCollectionLastModified": *[_type == "faqItem"] | order(_updatedAt desc)[0]._updatedAt,
  "pricingCollectionLastModified": *[_type == "pricingPackage"] | order(_updatedAt desc)[0]._updatedAt,
  "galleryDetailRoutes": *[_type == "galleryItem" && defined(slug.current)]{
    "path": "/gallery/" + slug.current,
    _updatedAt
  },
  "testimonialDetailRoutes": *[_type == "testimonial" && defined(slug.current)]{
    "path": "/testimonials/" + slug.current,
    _updatedAt
  },
  "faqDetailRoutes": *[_type == "faqItem" && defined(slug.current)]{
    "path": "/faq/" + slug.current,
    _updatedAt
  },
  "pricingDetailRoutes": *[_type == "pricingPackage" && defined(slug.current)]{
    "path": "/pricing/" + slug.current,
    _updatedAt
  }
}`;
