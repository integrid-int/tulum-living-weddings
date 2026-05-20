import Hero from "@/src/components/sections/Hero";
import TestimonialsGrid from "@/src/components/sections/TestimonialsGrid";

export default function TestimonialsPage() {
  return (
    <main>
      <Hero
        eyebrow="Testimonials"
        title="Feedback from teams we have supported"
        description="All entries are placeholders for now and can be replaced with Sanity documents later."
      />
      <TestimonialsGrid />
    </main>
  );
}
