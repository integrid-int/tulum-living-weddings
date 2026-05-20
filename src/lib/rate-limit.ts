type RateLimitOptions = {
  maxRequests: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const DEFAULT_OPTIONS: RateLimitOptions = {
  maxRequests: 5,
  windowMs: 60_000
};

const requestBuckets = new Map<string, number[]>();

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function checkRateLimit(key: string, options: Partial<RateLimitOptions> = {}): RateLimitResult {
  const { maxRequests, windowMs } = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const threshold = now - windowMs;

  const recentRequests = (requestBuckets.get(key) ?? []).filter((timestamp) => timestamp > threshold);

  if (recentRequests.length >= maxRequests) {
    const oldestRecentRequest = recentRequests[0] ?? now;
    const retryAfterMs = oldestRecentRequest + windowMs - now;
    requestBuckets.set(key, recentRequests);

    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1_000))
    };
  }

  recentRequests.push(now);
  requestBuckets.set(key, recentRequests);

  return {
    allowed: true,
    retryAfterSeconds: 0
  };
}
