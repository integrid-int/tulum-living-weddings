import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.max(60)
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160)
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "imageWithAlt"
    })
  ]
});
