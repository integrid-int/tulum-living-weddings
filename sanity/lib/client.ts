import { createClient } from "next-sanity";

import { readSanityEnv } from "@/sanity/env";

let cachedClient: ReturnType<typeof createClient> | null = null;

function getSanityClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const env = readSanityEnv();
  cachedClient = createClient({
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
    useCdn: process.env.NODE_ENV === "production"
  });

  return cachedClient;
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return getSanityClient().fetch<T>(query, params);
}

export async function fetchSanitySafe<T>(
  query: string,
  fallbackValue: T,
  params: Record<string, unknown> = {}
): Promise<T> {
  try {
    return await fetchSanity<T>(query, params);
  } catch {
    return fallbackValue;
  }
}
