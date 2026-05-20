import { describe, expect, it } from "vitest";
import { isValidWebhookSecret } from "@/src/lib/revalidate";

describe("isValidWebhookSecret", () => {
  it("rejects mismatched secrets", () => {
    expect(isValidWebhookSecret("one", "two")).toBe(false);
  });

  it("accepts matching secrets", () => {
    expect(isValidWebhookSecret("shared-secret", "shared-secret")).toBe(true);
  });

  it("rejects missing or empty secrets", () => {
    expect(isValidWebhookSecret("", "secret")).toBe(false);
    expect(isValidWebhookSecret("secret", "")).toBe(false);
    expect(isValidWebhookSecret(undefined, "secret")).toBe(false);
    expect(isValidWebhookSecret("secret", undefined)).toBe(false);
    expect(isValidWebhookSecret(null, "secret")).toBe(false);
    expect(isValidWebhookSecret("secret", null)).toBe(false);
  });
});
