import type { SanityImageWithAlt } from "@/sanity/lib/image";

export type PortableTextBlock = {
  _type: string;
  [key: string]: unknown;
};

export type SanityFaqItemDocument = {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
  category?: string | null;
  sortOrder?: number | null;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: PortableTextBlock[];
  category: string | null;
  sortOrder: number;
};

export function mapFaqItems(items: SanityFaqItemDocument[]): FaqItem[] {
  return items.map((item) => ({
    id: item._id,
    question: item.question,
    answer: item.answer,
    category: item.category ?? null,
    sortOrder: item.sortOrder ?? 0
  }));
}

export type SanityGalleryItemDocument = {
  _id: string;
  title: string;
  category: string;
  images?: SanityImageWithAlt[] | null;
  instagramPermalink?: string | null;
  source: "manual" | "instagram";
  isFeatured?: boolean | null;
  sortOrder?: number | null;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  images: SanityImageWithAlt[];
  instagramPermalink: string | null;
  source: "manual" | "instagram";
  isFeatured: boolean;
  sortOrder: number;
};

export function mapGalleryItems(items: SanityGalleryItemDocument[]): GalleryItem[] {
  return items.map((item) => ({
    id: item._id,
    title: item.title,
    category: item.category,
    images: item.images ?? [],
    instagramPermalink: item.instagramPermalink ?? null,
    source: item.source,
    isFeatured: item.isFeatured ?? false,
    sortOrder: item.sortOrder ?? 0
  }));
}

export type SanityTestimonialDocument = {
  _id: string;
  coupleName: string;
  eventType?: string | null;
  eventDate?: string | null;
  location?: string | null;
  quote: string;
  image?: SanityImageWithAlt | null;
  isFeatured?: boolean | null;
  sortOrder?: number | null;
};

export type TestimonialItem = {
  id: string;
  coupleName: string;
  eventType: string | null;
  eventDate: string | null;
  location: string | null;
  quote: string;
  image: SanityImageWithAlt | null;
  isFeatured: boolean;
  sortOrder: number;
};

export function mapTestimonials(items: SanityTestimonialDocument[]): TestimonialItem[] {
  return items.map((item) => ({
    id: item._id,
    coupleName: item.coupleName,
    eventType: item.eventType ?? null,
    eventDate: item.eventDate ?? null,
    location: item.location ?? null,
    quote: item.quote,
    image: item.image ?? null,
    isFeatured: item.isFeatured ?? false,
    sortOrder: item.sortOrder ?? 0
  }));
}

export type SanityCta = {
  label: string;
  href: string;
  openInNewTab?: boolean | null;
};

export type SanityPricingPackageDocument = {
  _id: string;
  packageName: string;
  summary?: string | null;
  priceLabel: string;
  inclusions?: string[] | null;
  addOns?: string[] | null;
  cta?: SanityCta | null;
  isFeatured?: boolean | null;
  sortOrder?: number | null;
};

export type PricingPackageItem = {
  id: string;
  packageName: string;
  summary: string | null;
  priceLabel: string;
  inclusions: string[];
  addOns: string[];
  cta: SanityCta | null;
  isFeatured: boolean;
  sortOrder: number;
};

export function mapPricingPackages(items: SanityPricingPackageDocument[]): PricingPackageItem[] {
  return items.map((item) => ({
    id: item._id,
    packageName: item.packageName,
    summary: item.summary ?? null,
    priceLabel: item.priceLabel,
    inclusions: item.inclusions ?? [],
    addOns: item.addOns ?? [],
    cta: item.cta ?? null,
    isFeatured: item.isFeatured ?? false,
    sortOrder: item.sortOrder ?? 0
  }));
}
