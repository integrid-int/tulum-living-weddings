import { z } from "zod";

function optionalTrimmedString(maxLength: number) {
  return z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    },
    z.string().min(1).max(maxLength).optional()
  );
}

const optionalDateString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  },
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
);

const optionalPositiveInt = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }

  return value;
}, z.number().int().positive().optional());

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  phone: optionalTrimmedString(40),
  eventDate: optionalDateString,
  guestCount: optionalPositiveInt,
  budgetRange: optionalTrimmedString(120),
  eventType: z.enum(["wedding", "engagement", "elopement", "other"]).optional(),
  message: z.string().trim().min(20).max(3_000),
  consent: z.literal(true),
  sourcePage: optionalTrimmedString(120),
  website: z.string().max(0).optional()
});

export type ContactInput = z.infer<typeof contactSchema>;
