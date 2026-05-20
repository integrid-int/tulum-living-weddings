import { describe, expect, it } from "vitest";
import {
  getStudioAuthConfig,
  parseBasicAuthorizationHeader,
  shouldEnforceStudioAuth
} from "@/src/lib/studio-auth";

describe("parseBasicAuthorizationHeader", () => {
  it("returns credentials from a valid basic auth header", () => {
    const encoded = Buffer.from("editor:super-secret").toString("base64");
    const parsed = parseBasicAuthorizationHeader(`Basic ${encoded}`);

    expect(parsed).toEqual({ username: "editor", password: "super-secret" });
  });

  it("returns null for malformed headers", () => {
    expect(parseBasicAuthorizationHeader("Bearer token")).toBeNull();
    expect(parseBasicAuthorizationHeader("Basic not-base64")).toBeNull();
  });
});

describe("studio auth configuration", () => {
  it("recognizes valid credentials from env vars", () => {
    expect(
      getStudioAuthConfig({
        STUDIO_BASIC_AUTH_USER: "editor",
        STUDIO_BASIC_AUTH_PASSWORD: "super-secret"
      })
    ).toEqual({
      username: "editor",
      password: "super-secret"
    });
  });

  it("enforces auth in production even if credentials are missing", () => {
    expect(shouldEnforceStudioAuth("production", null)).toBe(true);
  });

  it("does not enforce auth outside production if credentials are missing", () => {
    expect(shouldEnforceStudioAuth("development", null)).toBe(false);
  });
});
