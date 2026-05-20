import { defineArrayMember, defineField, defineType } from "sanity";

export const pageHowWeHelpType = defineType({
  name: "pageHowWeHelp",
  title: "Page: How We Help",
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
      name: "serviceBlocks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "heading",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "description",
              type: "text",
              rows: 3
            })
          ]
        })
      ],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "primaryCta",
      type: "cta"
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
