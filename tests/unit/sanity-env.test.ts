import { describe, expect, it } from "vitest";
import { sanityEnvSchema } from "@/sanity/env";

describe("sanity env schema", () => {
  it("requires project id and dataset", () => {
    const result = sanityEnvSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
