import FeatureGrid from "@/src/components/sections/FeatureGrid";
import Hero from "@/src/components/sections/Hero";
import PricingCards from "@/src/components/sections/PricingCards";

export default function HowWeCanHelpPage() {
  return (
    <main>
      <Hero
        eyebrow="How We Can Help"
        title="Structured support from planning to launch"
        description="Choose the level of support your team needs right now, then scale as your roadmap expands."
        ctaLabel="Contact us"
        ctaHref="/contact"
      />
      <FeatureGrid heading="Support tracks" />
      <PricingCards heading="Packages aligned to support level" />
    </main>
  );
}
