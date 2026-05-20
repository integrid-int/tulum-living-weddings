import { defineField, defineType } from "sanity";

export const pageContactType = defineType({
  name: "pageContact",
  title: "Page: Contact",
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
      name: "contactEmail",
      type: "string",
      validation: (rule) => rule.email()
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone / WhatsApp",
      type: "string"
    }),
    defineField({
      name: "submitButtonLabel",
      type: "string",
      initialValue: "Send message"
    }),
    defineField({
      name: "successMessage",
      type: "text",
      rows: 3
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
