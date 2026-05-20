import Hero from "@/src/components/sections/Hero";

export default function ContactPage() {
  return (
    <main>
      <Hero
        eyebrow="Contact"
        title="Plan your Tulum celebration with local experts"
        description="Share your vision, timeline, and guest count, and our planning team will guide your next steps."
      />
      <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Connect with our planning team</h2>
        <p style={{ margin: 0 }}>
          Email: <a href="mailto:hello@tulumlivingweddings.com">hello@tulumlivingweddings.com</a>
        </p>
        <p style={{ margin: 0 }}>
          Phone: <a href="tel:+529841230456">+52 (984) 123-0456</a>
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Based in Tulum, Quintana Roo, serving destination weddings across the Riviera Maya.
        </p>
      </section>
    </main>
  );
}
