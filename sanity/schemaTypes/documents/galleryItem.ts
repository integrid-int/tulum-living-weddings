import { defineArrayMember, defineField, defineType } from "sanity";

export const galleryItemType = defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "instagramPermalink",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] })
    }),
    defineField({
      name: "source",
      type: "string",
      options: {
        list: [
          { title: "Manual", value: "manual" },
          { title: "Instagram", value: "instagram" }
        ]
      },
      initialValue: "manual",
      validation: (rule) => rule.required()
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
      title: "title",
      subtitle: "category",
      media: "images.0.image"
    }
  }
});
