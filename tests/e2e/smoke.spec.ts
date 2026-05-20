import { test, expect } from "@playwright/test";

test("core routes return successful responses", async ({ page }) => {
  const routeMarkers: Record<string, string | RegExp> = {
    "/": /Welcome to Tulum Living Weddings and Events!|Destination wedding planning rooted in Tulum expertise/,
    "/how-we-can-help": /How we can help|Structured support from planning to launch/,
    "/so-why-us": /So- why us\?|Practical execution with predictable delivery/,
    "/gallery": /Gallery of inspiration|Snapshots of our process/,
    "/testimonials": /Testimonials|Feedback from teams we have supported/,
    "/faq": /Frequently asked questions|Answers to common planning questions/,
    "/pricing": /Planning packages|Pick a package and move quickly/,
    "/contact": /Contact us|Plan your Tulum celebration with local experts/
  };

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

    await expect(page.getByTestId("site-header")).toContainText("Tulum Living Weddings");
    await expect(page.getByTestId("site-footer")).toContainText("Crafting unforgettable destination celebrations in Tulum");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(routeMarkers[route]);
  }
});
