import Hero from "@/src/components/sections/Hero";

export default function ContactPage() {
  return (
    <main>
      <Hero
        eyebrow="Contact"
        title="Tell us what you are building"
        description="We respond quickly with a recommended path based on your timeline, team size, and priorities."
      />
      <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Get in touch</h2>
        <p style={{ margin: 0 }}>
          Email: <a href="mailto:hello@example.com">hello@example.com</a>
        </p>
        <p style={{ margin: 0 }}>
          Phone: <a href="tel:+15550000000">+1 (555) 000-0000</a>
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Placeholder contact details are used until production contact data is finalized.
        </p>
      </section>
    </main>
  );
}
