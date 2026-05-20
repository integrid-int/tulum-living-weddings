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
    title: "Clear project scoping",
    description: "We break large goals into practical, easy-to-review milestones."
  },
  {
    title: "Fast delivery loops",
    description: "Small increments let teams validate direction early and often."
  },
  {
    title: "Reliable handoff",
    description: "Every baseline route has reusable components ready for CMS wiring."
  }
];

export default function FeatureGrid({
  heading = "What we deliver",
  features = defaultFeatures
}: FeatureGridProps) {
  return (
    <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0 }}>{heading}</h2>
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
            style={{ border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1rem" }}
          >
            <h3 style={{ marginTop: 0 }}>{feature.title}</h3>
            <p style={{ marginBottom: 0, color: "#4b5563" }}>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
