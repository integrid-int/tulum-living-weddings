import { test, expect } from "@playwright/test";

test("core routes return successful responses", async ({ page }) => {
  for (const route of [
    "/",
    "/how-we-can-help",
    "/so-why-us",
    "/gallery",
    "/testimonials",
    "/faq",
    "/pricing",
    "/contact"
  ]) {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
  }
});
