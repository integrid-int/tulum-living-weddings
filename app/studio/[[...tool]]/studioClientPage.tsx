"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export function StudioClientPage() {
  return <NextStudio config={config} />;
}
