export type StudioAuthConfig = {
  username: string;
  password: string;
};

function decodeBase64(input: string): string | null {
  try {
    if (typeof atob === "function") {
      return atob(input);
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(input, "base64").toString("utf-8");
    }
  } catch {
    return null;
  }

  return null;
}

export function parseBasicAuthorizationHeader(headerValue: string | null): StudioAuthConfig | null {
  if (!headerValue) {
    return null;
  }

  const [scheme, encodedCredentials] = headerValue.split(" ");
  if (!scheme || !encodedCredentials || scheme.toLowerCase() !== "basic") {
    return null;
  }

  const decoded = decodeBase64(encodedCredentials);
  if (!decoded) {
    return null;
  }

  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex <= 0) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1)
  };
}

export function getStudioAuthConfig(env: Record<string, string | undefined> = process.env): StudioAuthConfig | null {
  const username = env.STUDIO_BASIC_AUTH_USER?.trim();
  const password = env.STUDIO_BASIC_AUTH_PASSWORD?.trim();

  if (!username || !password) {
    return null;
  }

  return { username, password };
}

export function shouldEnforceStudioAuth(
  nodeEnv: string | undefined = process.env.NODE_ENV,
  authConfig: StudioAuthConfig | null = getStudioAuthConfig()
): boolean {
  if (authConfig) {
    return true;
  }

  return nodeEnv === "production";
}

export function credentialsMatch(
  expected: StudioAuthConfig,
  provided: StudioAuthConfig | null
): boolean {
  if (!provided) {
    return false;
  }

  return expected.username === provided.username && expected.password === provided.password;
}
