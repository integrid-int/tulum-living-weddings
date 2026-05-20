import { beforeEach, describe, expect, it } from "vitest";

import { checkRateLimit, getClientIp, resetRateLimitStoreForTesting } from "@/src/lib/rate-limit";

function buildRequest(headers: Record<string, string>) {
  return new Request("http://localhost/api/contact", {
    headers
  });
}

describe("getClientIp", () => {
  beforeEach(() => {
    resetRateLimitStoreForTesting();
  });

  it("prefers x-vercel-forwarded-for over other headers", () => {
    const request = buildRequest({
      "x-vercel-forwarded-for": "203.0.113.10",
      "x-real-ip": "198.51.100.5",
      "cf-connecting-ip": "198.51.100.6",
      "x-forwarded-for": "198.51.100.7, 198.51.100.8"
    });

    expect(getClientIp(request)).toBe("203.0.113.10");
  });

  it("falls back through trusted headers before x-forwarded-for", () => {
    const request = buildRequest({
      "x-real-ip": "198.51.100.12",
      "cf-connecting-ip": "198.51.100.13",
      "x-forwarded-for": "198.51.100.14, 198.51.100.15"
    });

    expect(getClientIp(request)).toBe("198.51.100.12");
  });

  it("parses x-forwarded-for safely instead of trusting raw first value", () => {
    const request = buildRequest({
      "x-forwarded-for": "8.8.8.8, garbage, 198.51.100.22"
    });

    expect(getClientIp(request)).toBe("198.51.100.22");
  });

  it("returns unknown when no valid IP is available", () => {
    const request = buildRequest({
      "x-forwarded-for": "junk, still-not-an-ip"
    });

    expect(getClientIp(request)).toBe("unknown");
  });
});

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitStoreForTesting();
  });

  it("evicts old keys under key spray pressure to stay bounded", () => {
    const options = { maxRequests: 1, windowMs: 10 * 60_000 };

    expect(checkRateLimit("seed-key", options).allowed).toBe(true);

    for (let index = 0; index < 6_000; index += 1) {
      checkRateLimit(`spray-${index}`, options);
    }

    expect(checkRateLimit("seed-key", options).allowed).toBe(true);
  });
});
