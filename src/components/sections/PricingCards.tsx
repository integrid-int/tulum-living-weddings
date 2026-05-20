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
    name: "Starter",
    price: "$499",
    features: ["Landing page setup", "1 strategy session", "Email support"]
  },
  {
    name: "Growth",
    price: "$1,499",
    features: ["Multi-page baseline", "Weekly check-ins", "Priority support"]
  },
  {
    name: "Scale",
    price: "Custom",
    features: ["Complex scope planning", "Dedicated lead", "Custom roadmap"]
  }
];

export default function PricingCards({
  heading = "Simple baseline pricing",
  tiers = defaultTiers
}: PricingCardsProps) {
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
        {tiers.map((tier) => (
          <article
            key={tier.name}
            style={{ border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1rem" }}
          >
            <h3 style={{ marginTop: 0 }}>{tier.name}</h3>
            <p style={{ margin: "0.25rem 0 0.75rem", fontSize: "1.5rem", fontWeight: 700 }}>
              {tier.price}
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#4b5563", display: "grid", gap: "0.35rem" }}>
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
