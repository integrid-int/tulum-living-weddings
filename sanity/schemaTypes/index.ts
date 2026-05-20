import { navigationType } from "./documents/navigation";
import { siteSettingsType } from "./documents/siteSettings";
import { ctaType } from "./objects/cta";
import { imageWithAltType } from "./objects/imageWithAlt";
import { seoType } from "./objects/seo";

export const schemaTypes = [
  siteSettingsType,
  navigationType,
  seoType,
  ctaType,
  imageWithAltType
];
