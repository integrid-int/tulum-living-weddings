import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo"
    }),
    defineField({
      name: "primaryNavigation",
      title: "Primary navigation",
      type: "reference",
      to: [{ type: "navigation" }]
    })
  ],
  preview: {
    select: {
      title: "siteTitle"
    }
  }
});
