const PLACEHOLDER_PATTERNS = [
  /placeholder/i,
  /\bbaseline\b/i,
  /later/i,
  /swap with dynamic/i,
  /replace(?:d)? with .*sanity/i,
  /cms content is seeded/i,
  /intentionally lightweight/i
];

export function resolveMarketingCopy(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return fallback;
  }

  if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return fallback;
  }

  return trimmed;
}
