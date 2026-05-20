import { defineArrayMember, defineField, defineType } from "sanity";

export const pageWhyUsType = defineType({
  name: "pageWhyUs",
  title: "Page: Why Us",
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
      name: "reasons",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
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
