import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);

export const sanityEnvSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: nonEmptyString,
  NEXT_PUBLIC_SANITY_DATASET: nonEmptyString,
  NEXT_PUBLIC_SANITY_API_VERSION: nonEmptyString.default("2026-01-01")
});

export type SanityEnv = z.infer<typeof sanityEnvSchema>;

export function readSanityEnv(env: NodeJS.ProcessEnv = process.env): SanityEnv {
  return sanityEnvSchema.parse({
    NEXT_PUBLIC_SANITY_PROJECT_ID: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: env.NEXT_PUBLIC_SANITY_API_VERSION
  });
}
