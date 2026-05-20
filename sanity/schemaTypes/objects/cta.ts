import { defineField, defineType } from "sanity";

export const ctaType = defineType({
  name: "cta",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "href",
      title: "Link URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] })
    }),
    defineField({
      name: "openInNewTab",
      type: "boolean",
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "href"
    }
  }
});
