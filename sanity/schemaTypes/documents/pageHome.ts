import { defineArrayMember, defineField, defineType } from "sanity";

export const pageHomeType = defineType({
  name: "pageHome",
  title: "Page: Home",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "heroTitle",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "heroSubtitle",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "heroImage",
      type: "imageWithAlt"
    }),
    defineField({
      name: "primaryCta",
      type: "cta"
    }),
    defineField({
      name: "featuredGalleryItems",
      title: "Featured gallery items",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "galleryItem" }] })]
    }),
    defineField({
      name: "featuredTestimonials",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })]
    }),
    defineField({
      name: "featuredPackages",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "pricingPackage" }] })]
    }),
    defineField({
      name: "seo",
      type: "seo"
    })
  ],
  preview: {
    select: {
      title: "title"
    }
  }
});
