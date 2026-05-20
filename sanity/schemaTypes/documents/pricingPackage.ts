import { defineArrayMember, defineField, defineType } from "sanity";

export const pricingPackageType = defineType({
  name: "pricingPackage",
  title: "Pricing Package",
  type: "document",
  fields: [
    defineField({
      name: "packageName",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "priceLabel",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "inclusions",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "addOns",
      title: "Add-ons",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "cta",
      type: "cta"
    }),
    defineField({
      name: "isFeatured",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: "packageName",
      subtitle: "priceLabel"
    }
  }
});
