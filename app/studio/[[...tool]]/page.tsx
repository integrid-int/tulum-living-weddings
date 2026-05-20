import type { Metadata, Viewport } from "next";
import { StudioClientPage } from "./studioClientPage";

export const metadata: Metadata = {
  title: "Sanity Studio"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <StudioClientPage />;
}
