import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  credentialsMatch,
  getStudioAuthConfig,
  parseBasicAuthorizationHeader,
  shouldEnforceStudioAuth
} from "@/src/lib/studio-auth";

function unauthorizedResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Sanity Studio", charset="UTF-8"',
      "Cache-Control": "no-store"
    }
  });
}

export function proxy(request: NextRequest) {
  const authConfig = getStudioAuthConfig();
  if (!shouldEnforceStudioAuth(undefined, authConfig)) {
    return NextResponse.next();
  }

  if (!authConfig) {
    return unauthorizedResponse();
  }

  const provided = parseBasicAuthorizationHeader(request.headers.get("authorization"));
  if (!credentialsMatch(authConfig, provided)) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio", "/studio/:path*"]
};
