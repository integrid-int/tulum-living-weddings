import { defineField, defineType } from "sanity";

export const imageWithAltType = defineType({
  name: "imageWithAlt",
  title: "Image with alt text",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: {
        hotspot: true
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "alt",
      media: "image"
    }
  }
});
