import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

import { contactSchema } from "@/src/lib/contact-schema";
import { sendContactNotification } from "@/src/lib/email";
import { checkRateLimit, getClientIp } from "@/src/lib/rate-limit";

export const runtime = "nodejs";

const HONEYPOT_FIELD = "website";
const CONTACT_RATE_LIMIT_PREFIX = "contact:";

function createSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2026-01-01";

  if (!token || !projectId || !dataset) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false
  });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`${CONTACT_RATE_LIMIT_PREFIX}${clientIp}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many contact requests. Please try again soon." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds)
        }
      }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  const honeypotValue =
    typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>)[HONEYPOT_FIELD] : "";
  if (typeof honeypotValue === "string" && honeypotValue.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid contact request.",
        errors: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const sanityWriteClient = createSanityWriteClient();

  if (!sanityWriteClient) {
    return NextResponse.json(
      { ok: false, message: "Contact service is not fully configured." },
      { status: 500 }
    );
  }

  try {
    await sanityWriteClient.create({
      _type: "contactSubmission",
      name: data.name,
      email: data.email,
      phone: data.phone,
      eventDate: data.eventDate,
      guestCount: data.guestCount,
      budgetRange: data.budgetRange,
      eventType: data.eventType,
      message: data.message,
      sourcePage: data.sourcePage ?? "/contact",
      consent: data.consent,
      status: "new",
      submittedAt: new Date().toISOString()
    });

    try {
      await sendContactNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.eventDate,
        guestCount: data.guestCount,
        budgetRange: data.budgetRange,
        eventType: data.eventType,
        message: data.message,
        sourcePage: data.sourcePage ?? "/contact"
      });
    } catch (error) {
      console.error("[contact] Email notification failed", error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Failed to store contact submission", error);
    return NextResponse.json({ ok: false, message: "Unable to submit contact request." }, { status: 500 });
  }
}
