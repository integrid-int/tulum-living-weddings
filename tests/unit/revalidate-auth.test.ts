import { describe, expect, it } from "vitest";
import { isValidWebhookSecret } from "@/src/lib/revalidate";

describe("isValidWebhookSecret", () => {
  it("rejects mismatched secrets", () => {
    expect(isValidWebhookSecret("one", "two")).toBe(false);
  });
});
