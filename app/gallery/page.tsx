import GalleryGrid from "@/src/components/sections/GalleryGrid";
import Hero from "@/src/components/sections/Hero";

export default function GalleryPage() {
  return (
    <main>
      <Hero
        eyebrow="Gallery"
        title="Snapshots of our process"
        description="A static gallery placeholder that can later be replaced with CMS-driven assets."
      />
      <GalleryGrid />
    </main>
  );
}
