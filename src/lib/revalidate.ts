import { timingSafeEqual } from "node:crypto";

export const CORE_REVALIDATE_PATHS = [
  "/",
  "/how-we-can-help",
  "/so-why-us",
  "/gallery",
  "/testimonials",
  "/faq",
  "/pricing",
  "/contact"
] as const;

export function isValidWebhookSecret(
  providedSecret: string | null | undefined,
  expectedSecret: string | null | undefined
) {
  const provided = (providedSecret ?? "").trim();
  const expected = (expectedSecret ?? "").trim();

  if (!provided || !expected) {
    return false;
  }

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}
