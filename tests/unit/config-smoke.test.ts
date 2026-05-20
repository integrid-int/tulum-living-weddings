import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("project bootstrap", () => {
  it("has core framework config files", () => {
    expect(existsSync("next.config.ts")).toBe(true);
    expect(existsSync("tailwind.config.ts")).toBe(true);
    expect(existsSync("app/layout.tsx")).toBe(true);
  });
});
