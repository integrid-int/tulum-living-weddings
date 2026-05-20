import { defineCliConfig } from "sanity/cli";
import { readSanityEnv } from "./sanity/env";

const env = readSanityEnv();

export default defineCliConfig({
  api: {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET
  }
});
