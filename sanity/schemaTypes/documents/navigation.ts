import { defineArrayMember, defineField, defineType } from "sanity";

export const navigationType = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "items",
      type: "array",
      of: [defineArrayMember({ type: "cta" })],
      validation: (rule) => rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: "title"
    }
  }
});
