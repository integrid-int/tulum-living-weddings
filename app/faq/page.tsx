import FaqAccordion from "@/src/components/sections/FaqAccordion";
import Hero from "@/src/components/sections/Hero";

export default function FaqPage() {
  return (
    <main>
      <Hero
        eyebrow="FAQ"
        title="Answers to common planning questions"
        description="This page intentionally relies on static FAQ items so it works without seeded content."
      />
      <FaqAccordion />
    </main>
  );
}
