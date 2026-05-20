import { describe, expect, it } from "vitest";
import { contactSchema } from "@/src/lib/contact-schema";

describe("contactSchema", () => {
  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "invalid",
      message: "Planning a wedding in Tulum with 60 guests.",
      consent: true,
    });

    expect(result.success).toBe(false);
  });
});
