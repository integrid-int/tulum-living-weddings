import Hero from "@/src/components/sections/Hero";
import PricingCards from "@/src/components/sections/PricingCards";

export default function PricingPage() {
  return (
    <main>
      <Hero
        eyebrow="Pricing"
        title="Pick a package and move quickly"
        description="Simple baseline pricing cards are ready to swap with dynamic content later."
        ctaLabel="Start with a discovery call"
        ctaHref="/contact"
      />
      <PricingCards />
    </main>
  );
}
