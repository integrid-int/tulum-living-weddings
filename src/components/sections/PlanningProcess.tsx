type ProcessStep = {
  title: string;
  detail: string;
};

type PlanningProcessProps = {
  heading?: string;
  steps?: ProcessStep[];
};

const defaultSteps: ProcessStep[] = [
  {
    title: "1. Vision Atelier",
    detail: "We define your aesthetic, guest journey, and investment priorities with complete strategic clarity."
  },
  {
    title: "2. Venue & Art Direction",
    detail: "You receive handpicked venues, a refined creative language, and premium partner recommendations."
  },
  {
    title: "3. Precision Production",
    detail: "Contracts, logistics, and timeline architecture are managed with proactive communication and elegant control."
  },
  {
    title: "4. Weekend Orchestration",
    detail: "Our on-site team leads every transition so you can stay fully present with your guests and partner."
  }
];

export default function PlanningProcess({
  heading = "Your private planning atelier in four movements",
  steps = defaultSteps
}: PlanningProcessProps) {
  return (
    <section className="editorial-fade-up editorial-fade-up-delay-2" style={{ padding: "0 1.5rem 2.25rem" }}>
      <div style={{ maxWidth: "70rem", margin: "0 auto", display: "grid", gap: "1rem" }}>
        <h2 style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>{heading}</h2>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
          }}
        >
          {steps.map((step) => (
            <article
              key={step.title}
              className="luxury-card"
              style={{
                backgroundColor: "var(--brand-white)",
                border: "1px solid rgba(175, 158, 133, 0.5)",
                borderRadius: "0.85rem",
                padding: "1rem",
                boxShadow: "0 8px 18px rgba(95, 74, 66, 0.08)"
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "0.5rem", color: "var(--brand-primary)" }}>{step.title}</h3>
              <p style={{ margin: 0, color: "var(--brand-cocoa)" }}>{step.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
