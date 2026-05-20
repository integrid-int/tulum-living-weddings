type Feature = {
  title: string;
  description: string;
};

type FeatureGridProps = {
  heading?: string;
  features?: Feature[];
};

const defaultFeatures: Feature[] = [
  {
    title: "Venue and ceremony planning",
    description: "Beach clubs, private villas, cenotes, and jungle settings curated for your event style."
  },
  {
    title: "Design and decor coordination",
    description: "Florals, furnishings, lighting, and styling details aligned into one visual direction."
  },
  {
    title: "Guest and logistics support",
    description: "Transfers, welcome experiences, vendor timelines, and event-day flow managed end to end."
  }
];

export default function FeatureGrid({
  heading = "What we deliver",
  features = defaultFeatures
}: FeatureGridProps) {
  return (
    <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>{heading}</h2>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
        }}
      >
        {features.map((feature) => (
          <article
            key={feature.title}
            style={{
              border: "1px solid rgba(175, 158, 133, 0.5)",
              borderRadius: "0.75rem",
              padding: "1rem",
              backgroundColor: "var(--brand-white)"
            }}
          >
            <h3 style={{ marginTop: 0, color: "var(--brand-primary)" }}>{feature.title}</h3>
            <p style={{ marginBottom: 0, color: "var(--brand-cocoa)" }}>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
