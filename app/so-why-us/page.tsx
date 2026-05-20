import FaqAccordion from "@/src/components/sections/FaqAccordion";
import Hero from "@/src/components/sections/Hero";
import TestimonialsGrid from "@/src/components/sections/TestimonialsGrid";

export default function SoWhyUsPage() {
  return (
    <main>
      <Hero
        eyebrow="So, Why Us?"
        title="Practical execution with predictable delivery"
        description="We focus on clear scope, short feedback loops, and reusable foundations for long-term growth."
        ctaLabel="Read testimonials"
        ctaHref="/testimonials"
      />
      <TestimonialsGrid heading="Proof from recent engagements" />
      <FaqAccordion heading="How we work" />
    </main>
  );
}
