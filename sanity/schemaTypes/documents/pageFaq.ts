import { defineArrayMember, defineField, defineType } from "sanity";

export const pageFaqType = defineType({
  name: "pageFaq",
  title: "Page: FAQ",
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
      name: "featuredFaqItems",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faqItem" }] })]
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
