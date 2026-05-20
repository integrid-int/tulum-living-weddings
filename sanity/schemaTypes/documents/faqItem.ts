import { defineArrayMember, defineField, defineType } from "sanity";

export const faqItemType = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({
      name: "question",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "answer",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "category",
      type: "string"
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "category"
    }
  }
});
