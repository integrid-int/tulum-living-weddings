import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { CORE_REVALIDATE_PATHS, isValidWebhookSecret } from "@/src/lib/revalidate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const configuredSecret = process.env.SANITY_REVALIDATE_WEBHOOK_SECRET?.trim();

  if (!configuredSecret) {
    console.error("[revalidate] SANITY_REVALIDATE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json({ ok: false, message: "Revalidation secret is not configured." }, { status: 500 });
  }

  const webhookSecret = request.headers.get("x-sanity-webhook-secret");
  if (!isValidWebhookSecret(webhookSecret, configuredSecret)) {
    return NextResponse.json({ ok: false, message: "Unauthorized webhook request." }, { status: 401 });
  }

  for (const path of CORE_REVALIDATE_PATHS) {
    revalidatePath(path);
  }

  return NextResponse.json({ ok: true, revalidated: CORE_REVALIDATE_PATHS });
}
