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
    title: "1. Discovery & Vision",
    detail: "We align on style, guest experience goals, budget range, and the atmosphere you want guests to feel."
  },
  {
    title: "2. Venue & Design Direction",
    detail: "You receive curated venue options, refined design concepts, and trusted vendor recommendations."
  },
  {
    title: "3. Precision Planning",
    detail: "Contracts, logistics, and production timelines are handled with clear updates and calm communication."
  },
  {
    title: "4. Wedding Weekend Execution",
    detail: "Our team runs the event flow on-site so you can focus on celebrating with your people."
  }
];

export default function PlanningProcess({
  heading = "A seamless four-step planning journey",
  steps = defaultSteps
}: PlanningProcessProps) {
  return (
    <section style={{ padding: "0 1.5rem 2.25rem" }}>
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
