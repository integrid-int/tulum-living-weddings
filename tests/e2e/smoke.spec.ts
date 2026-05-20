import { test, expect } from "@playwright/test";

test("core routes return successful responses", async ({ page }) => {
  const routeMarkers: Record<string, string> = {
    "/": "Launch-ready pages before CMS content is seeded",
    "/how-we-can-help": "Structured support from planning to launch",
    "/so-why-us": "Practical execution with predictable delivery",
    "/gallery": "Snapshots of our process",
    "/testimonials": "Feedback from teams we have supported",
    "/faq": "Answers to common planning questions",
    "/pricing": "Pick a package and move quickly",
    "/contact": "Plan your Tulum celebration with local experts"
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
