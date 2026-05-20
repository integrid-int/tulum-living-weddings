import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { deskStructure, singletonTypes } from "./sanity/deskStructure";
import { readSanityEnv } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

const env = readSanityEnv();

export default defineConfig({
  name: "default",
  title: "Website Studio",
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  basePath: "/studio",
  plugins: [structureTool({ structure: deskStructure }), visionTool()],
  document: {
    newDocumentOptions: (previousOptions) =>
      previousOptions.filter((templateItem) => !singletonTypes.has(templateItem.templateId)),
    actions: (previousActions, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return previousActions.filter((actionItem) => actionItem.action !== "duplicate");
      }

      return previousActions;
    }
  },
  schema: {
    types: schemaTypes
  }
});
