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
      name: "canonicalUrl",
      title: "Canonical URL override",
      type: "string",
      description: "Optional canonical URL or route path (e.g. /faq).",
      validation: (rule) => rule.max(2048)
    }),
    defineField({
      name: "noIndex",
      title: "Noindex",
      type: "boolean",
      description: "Prevents this page from being indexed by search engines.",
      initialValue: false
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "imageWithAlt"
    })
  ]
});
