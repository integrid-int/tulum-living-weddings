type PricingTier = {
  name: string;
  price: string;
  features: string[];
};

type PricingCardsProps = {
  heading?: string;
  tiers?: PricingTier[];
};

const defaultTiers: PricingTier[] = [
  {
    name: "Planning Essentials",
    price: "Starting at $2,500 USD",
    features: ["Venue and vendor shortlist", "Budget and timeline roadmap", "Monthly planning calls"]
  },
  {
    name: "Signature Planning",
    price: "Starting at $5,500 USD",
    features: ["Full vendor coordination", "Design direction and styling", "Event-day timeline management"]
  },
  {
    name: "Weekend Concierge",
    price: "Custom proposal",
    features: ["Multi-day event support", "Guest logistics oversight", "On-site production team"]
  }
];

export default function PricingCards({
  heading = "Simple baseline pricing",
  tiers = defaultTiers
}: PricingCardsProps) {
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
        {tiers.map((tier) => (
          <article
            key={tier.name}
            style={{
              border: "1px solid rgba(175, 158, 133, 0.5)",
              borderRadius: "0.75rem",
              padding: "1rem",
              backgroundColor: "var(--brand-white)"
            }}
          >
            <h3 style={{ marginTop: 0, color: "var(--brand-primary)" }}>{tier.name}</h3>
            <p style={{ margin: "0.25rem 0 0.75rem", fontSize: "1.5rem", fontWeight: 700, color: "var(--brand-deep-cocoa)" }}>
              {tier.price}
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--brand-cocoa)", display: "grid", gap: "0.35rem" }}>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
