import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { CORE_REVALIDATE_PATHS } from "@/src/lib/revalidate";

const { revalidatePathMock, initialWebhookSecret } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  initialWebhookSecret: process.env.SANITY_REVALIDATE_WEBHOOK_SECRET
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock
}));

import { POST } from "@/app/api/revalidate/route";

function buildRequest(secret?: string) {
  const headers: HeadersInit = {};
  if (typeof secret === "string") {
    headers["x-sanity-webhook-secret"] = secret;
  }

  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidatePathMock.mockClear();
    delete process.env.SANITY_REVALIDATE_WEBHOOK_SECRET;
  });

  afterAll(() => {
    if (initialWebhookSecret === undefined) {
      delete process.env.SANITY_REVALIDATE_WEBHOOK_SECRET;
      return;
    }

    process.env.SANITY_REVALIDATE_WEBHOOK_SECRET = initialWebhookSecret;
  });

  it("returns 500 when webhook secret env is missing", async () => {
    const response = await POST(buildRequest("anything"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("returns 401 when webhook secret header is invalid", async () => {
    process.env.SANITY_REVALIDATE_WEBHOOK_SECRET = "expected-secret";

    const response = await POST(buildRequest("wrong-secret"));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("returns 200 with valid secret and revalidates all core paths", async () => {
    process.env.SANITY_REVALIDATE_WEBHOOK_SECRET = "expected-secret";

    const response = await POST(buildRequest("expected-secret"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.revalidated).toEqual(CORE_REVALIDATE_PATHS);
    expect(revalidatePathMock).toHaveBeenCalledTimes(CORE_REVALIDATE_PATHS.length);
    expect(revalidatePathMock.mock.calls.map((call) => call[0])).toEqual([...CORE_REVALIDATE_PATHS]);
  });
});
