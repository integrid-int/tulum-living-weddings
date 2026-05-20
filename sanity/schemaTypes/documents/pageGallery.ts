import { defineArrayMember, defineField, defineType } from "sanity";

export const pageGalleryType = defineType({
  name: "pageGallery",
  title: "Page: Gallery",
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
      name: "featuredItems",
      title: "Featured gallery items",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "galleryItem" }] })]
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
