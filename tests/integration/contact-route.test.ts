import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock, sendContactNotificationMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(() => ({ create: vi.fn() })),
  sendContactNotificationMock: vi.fn()
}));

vi.mock("next-sanity", () => ({
  createClient: createClientMock
}));

vi.mock("@/src/lib/email", () => ({
  sendContactNotification: sendContactNotificationMock
}));

import { POST } from "@/app/api/contact/route";

function buildRequest(payload: unknown, ip = "198.51.100.20") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip
    },
    body: JSON.stringify(payload)
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    createClientMock.mockClear();
    sendContactNotificationMock.mockClear();
  });

  it("returns 400 for invalid payload", async () => {
    const response = await POST(
      buildRequest({
        name: "Jane Doe",
        email: "invalid",
        message: "Planning a wedding in Tulum with 60 guests.",
        consent: true,
        website: ""
      })
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.message).toBe("Invalid contact request.");
    expect(createClientMock).not.toHaveBeenCalled();
    expect(sendContactNotificationMock).not.toHaveBeenCalled();
  });

  it("returns success and no-ops for honeypot payload", async () => {
    const response = await POST(
      buildRequest({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Planning a wedding in Tulum with 60 guests and a beachfront ceremony.",
        consent: true,
        website: "https://spam.example"
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(createClientMock).not.toHaveBeenCalled();
    expect(sendContactNotificationMock).not.toHaveBeenCalled();
  });
});
