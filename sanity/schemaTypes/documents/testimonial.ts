import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "coupleName",
      title: "Couple or client name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "eventType",
      type: "string"
    }),
    defineField({
      name: "eventDate",
      type: "date"
    }),
    defineField({
      name: "location",
      type: "string"
    }),
    defineField({
      name: "quote",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().min(20)
    }),
    defineField({
      name: "image",
      type: "imageWithAlt"
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
      title: "coupleName",
      subtitle: "eventType",
      media: "image.image"
    }
  }
});
