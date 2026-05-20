import { defineArrayMember, defineField, defineType } from "sanity";

export const pageTestimonialsType = defineType({
  name: "pageTestimonials",
  title: "Page: Testimonials",
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
      name: "featuredTestimonials",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })]
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
