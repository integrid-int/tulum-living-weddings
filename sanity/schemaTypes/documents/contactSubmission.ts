import { defineField, defineType } from "sanity";

export const contactSubmissionType = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "email",
      type: "string",
      validation: (rule) => rule.required().email()
    }),
    defineField({
      name: "phone",
      title: "Phone / WhatsApp",
      type: "string"
    }),
    defineField({
      name: "eventDate",
      type: "date"
    }),
    defineField({
      name: "guestCount",
      type: "number",
      validation: (rule) => rule.integer().min(1)
    }),
    defineField({
      name: "budgetRange",
      type: "string"
    }),
    defineField({
      name: "eventType",
      type: "string",
      options: {
        list: [
          { title: "Wedding", value: "wedding" },
          { title: "Engagement", value: "engagement" },
          { title: "Elopement", value: "elopement" },
          { title: "Other", value: "other" }
        ]
      }
    }),
    defineField({
      name: "message",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().min(20)
    }),
    defineField({
      name: "sourcePage",
      type: "string"
    }),
    defineField({
      name: "consent",
      type: "boolean",
      validation: (rule) => rule.required().custom((value) => value === true || "Consent is required")
    }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Progress", value: "in-progress" },
          { title: "Closed", value: "closed" }
        ]
      },
      initialValue: "new",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "submittedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "name",
      email: "email",
      status: "status"
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: `${selection.email} · ${selection.status}`
      };
    }
  }
});
