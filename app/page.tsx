import FeatureGrid from "@/src/components/sections/FeatureGrid";
import Hero from "@/src/components/sections/Hero";
import TestimonialsGrid from "@/src/components/sections/TestimonialsGrid";

export default function HomePage() {
  return (
    <main>
      <Hero
        eyebrow="Baseline Marketing Site"
        title="Launch-ready pages before CMS content is seeded"
        description="These routes are intentionally lightweight and use shared section components with static defaults."
        ctaLabel="View pricing"
        ctaHref="/pricing"
      />
      <FeatureGrid />
      <TestimonialsGrid />
    </main>
  );
}
