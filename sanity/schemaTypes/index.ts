import { contactSubmissionType } from "./documents/contactSubmission";
import { faqItemType } from "./documents/faqItem";
import { galleryItemType } from "./documents/galleryItem";
import { navigationType } from "./documents/navigation";
import { pageContactType } from "./documents/pageContact";
import { pageFaqType } from "./documents/pageFaq";
import { pageGalleryType } from "./documents/pageGallery";
import { pageHomeType } from "./documents/pageHome";
import { pageHowWeHelpType } from "./documents/pageHowWeHelp";
import { pagePricingType } from "./documents/pagePricing";
import { pageTestimonialsType } from "./documents/pageTestimonials";
import { pageWhyUsType } from "./documents/pageWhyUs";
import { pricingPackageType } from "./documents/pricingPackage";
import { siteSettingsType } from "./documents/siteSettings";
import { testimonialType } from "./documents/testimonial";
import { ctaType } from "./objects/cta";
import { imageWithAltType } from "./objects/imageWithAlt";
import { seoType } from "./objects/seo";

export const schemaTypes = [
  siteSettingsType,
  navigationType,
  pageHomeType,
  pageHowWeHelpType,
  pageWhyUsType,
  pageContactType,
  pageGalleryType,
  pageTestimonialsType,
  pageFaqType,
  pagePricingType,
  galleryItemType,
  testimonialType,
  faqItemType,
  pricingPackageType,
  contactSubmissionType,
  seoType,
  ctaType,
  imageWithAltType
];
