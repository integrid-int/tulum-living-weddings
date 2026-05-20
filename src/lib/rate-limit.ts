import { isIP } from "node:net";

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

type RequestBucket = {
  timestamps: number[];
  lastSeen: number;
};

const TRUSTED_IP_HEADERS = ["x-vercel-forwarded-for", "x-real-ip", "cf-connecting-ip"] as const;
const STALE_BUCKET_TTL_MS = 15 * 60_000;
const CLEANUP_INTERVAL_REQUESTS = 100;
const MAX_TRACKED_KEYS = 2_048;

const requestBuckets = new Map<string, RequestBucket>();
let requestCountSinceCleanup = 0;

function normalizeIpToken(token: string): string | undefined {
  const trimmed = token.trim().replace(/^"|"$/g, "");
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("[")) {
    const closingBracketIndex = trimmed.indexOf("]");
    if (closingBracketIndex > 1) {
      const ipv6 = trimmed.slice(1, closingBracketIndex);
      if (isIP(ipv6)) {
        return ipv6;
      }
    }
  }

  if (isIP(trimmed)) {
    return trimmed;
  }

  if (trimmed.indexOf(":") === trimmed.lastIndexOf(":")) {
    const [ipWithoutPort] = trimmed.split(":");
    if (ipWithoutPort && isIP(ipWithoutPort)) {
      return ipWithoutPort;
    }
  }

  return undefined;
}

function parseHeaderForIps(rawValue: string | null): string[] {
  if (!rawValue) {
    return [];
  }

  const parsedIps: string[] = [];
  for (const token of rawValue.split(",")) {
    const normalized = normalizeIpToken(token);
    if (normalized) {
      parsedIps.push(normalized);
    }
  }

  return parsedIps;
}

function getForwardedForIp(rawValue: string | null): string | undefined {
  const parsedIps = parseHeaderForIps(rawValue);
  return parsedIps.at(-1);
}

function getTrustedHeaderIp(rawValue: string | null): string | undefined {
  return parseHeaderForIps(rawValue)[0];
}

function touchBucket(key: string, bucket: RequestBucket) {
  if (requestBuckets.has(key)) {
    requestBuckets.delete(key);
  }

  requestBuckets.set(key, bucket);
}

function pruneStaleBuckets(now: number) {
  for (const [bucketKey, bucket] of requestBuckets.entries()) {
    const recentTimestamps = bucket.timestamps.filter((timestamp) => now - timestamp <= STALE_BUCKET_TTL_MS);

    if (recentTimestamps.length === 0 || now - bucket.lastSeen > STALE_BUCKET_TTL_MS) {
      requestBuckets.delete(bucketKey);
      continue;
    }

    if (recentTimestamps.length !== bucket.timestamps.length) {
      bucket.timestamps = recentTimestamps;
      touchBucket(bucketKey, bucket);
    }
  }
}

function enforceMaxTrackedKeys() {
  if (requestBuckets.size <= MAX_TRACKED_KEYS) {
    return;
  }

  const overflow = requestBuckets.size - MAX_TRACKED_KEYS;
  let removed = 0;

  for (const bucketKey of requestBuckets.keys()) {
    requestBuckets.delete(bucketKey);
    removed += 1;

    if (removed >= overflow) {
      break;
    }
  }
}

function maybeCleanup(now: number) {
  requestCountSinceCleanup += 1;
  const shouldCleanup = requestCountSinceCleanup % CLEANUP_INTERVAL_REQUESTS === 0;

  if (shouldCleanup || requestBuckets.size > MAX_TRACKED_KEYS) {
    pruneStaleBuckets(now);
    enforceMaxTrackedKeys();
  }
}

export function getClientIp(request: Request): string {
  for (const headerName of TRUSTED_IP_HEADERS) {
    const trustedHeaderIp = getTrustedHeaderIp(request.headers.get(headerName));
    if (trustedHeaderIp) {
      return trustedHeaderIp;
    }
  }

  const forwardedForIp = getForwardedForIp(request.headers.get("x-forwarded-for"));
  if (forwardedForIp) {
    return forwardedForIp;
  }

  return "unknown";
}

export function checkRateLimit(key: string, options: Partial<RateLimitOptions> = {}): RateLimitResult {
  const { maxRequests, windowMs } = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const threshold = now - windowMs;

  maybeCleanup(now);

  const bucket = requestBuckets.get(key) ?? { timestamps: [], lastSeen: now };
  const recentRequests = bucket.timestamps.filter((timestamp) => timestamp > threshold);
  bucket.timestamps = recentRequests;
  bucket.lastSeen = now;
  touchBucket(key, bucket);
  enforceMaxTrackedKeys();

  if (recentRequests.length >= maxRequests) {
    const oldestRecentRequest = recentRequests[0] ?? now;
    const retryAfterMs = oldestRecentRequest + windowMs - now;

    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1_000))
    };
  }

  recentRequests.push(now);
  bucket.timestamps = recentRequests;
  bucket.lastSeen = now;
  touchBucket(key, bucket);
  enforceMaxTrackedKeys();

  return {
    allowed: true,
    retryAfterSeconds: 0
  };
}

export function resetRateLimitStoreForTesting() {
  requestBuckets.clear();
  requestCountSinceCleanup = 0;
}
