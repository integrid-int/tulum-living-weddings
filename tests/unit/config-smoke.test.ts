import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("project bootstrap", () => {
  it("has all required Task 1 artifacts", () => {
    const requiredArtifacts = [
      "next.config.ts",
      "tsconfig.json",
      "tailwind.config.ts",
      "postcss.config.js",
      "app/layout.tsx",
      "app/page.tsx",
      "app/globals.css",
      "tests/unit/config-smoke.test.ts",
      ".gitignore"
    ];

    for (const artifact of requiredArtifacts) {
      expect(
        existsSync(artifact),
        `Expected required artifact to exist: ${artifact}`
      ).toBe(true);
    }
  });
});
