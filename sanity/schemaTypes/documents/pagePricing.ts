import { defineArrayMember, defineField, defineType } from "sanity";

export const pagePricingType = defineType({
  name: "pagePricing",
  title: "Page: Pricing",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "intro",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "featuredPackages",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "pricingPackage" }] })]
    }),
    defineField({
      name: "primaryCta",
      type: "cta"
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
