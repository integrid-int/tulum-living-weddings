type TrustSignal = {
  value: string;
  label: string;
};

type TrustSignalsProps = {
  heading?: string;
  signals?: TrustSignal[];
};

const defaultSignals: TrustSignal[] = [
  { value: "300+", label: "celebrations curated" },
  { value: "15+", label: "years of Riviera Maya expertise" },
  { value: "40+", label: "exclusive venues and trusted partners" },
  { value: "4.9/5", label: "average couple satisfaction" }
];

export default function TrustSignals({
  heading = "Trusted by destination couples worldwide",
  signals = defaultSignals
}: TrustSignalsProps) {
  return (
    <section
      data-testid="trust-signals"
      className="editorial-fade-up"
      style={{
        margin: "-1.75rem auto 0",
        padding: "0 1.5rem 2rem",
        width: "100%"
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: "70rem",
          borderRadius: "1rem",
          padding: "1.25rem",
          backgroundColor: "var(--brand-white)",
          border: "1px solid rgba(var(--brand-primary-rgb), 0.22)",
          boxShadow: "0 18px 38px rgba(var(--brand-ink-rgb), 0.12)"
        }}
      >
        <h2 style={{ margin: "0 0 1rem", color: "var(--brand-deep-cocoa)" }}>{heading}</h2>
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))"
          }}
        >
          {signals.map((signal) => (
            <article
              key={`${signal.value}-${signal.label}`}
              className="luxury-card"
              style={{
                borderRadius: "0.85rem",
                border: "1px solid rgba(var(--brand-platinum-rgb), 0.45)",
                background: "linear-gradient(145deg, rgba(var(--brand-white-rgb), 0.98), rgba(var(--brand-sand-rgb), 0.7))",
                padding: "0.85rem"
              }}
            >
              <p style={{ margin: 0, color: "var(--brand-primary)", fontWeight: 800, fontSize: "1.4rem" }}>
                {signal.value}
              </p>
              <p style={{ margin: "0.35rem 0 0", color: "var(--brand-cocoa)" }}>{signal.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
