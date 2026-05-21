type EditorialMotifPanelProps = {
  label: string;
  headline: string;
  detail: string;
  tags?: string[];
};

export default function EditorialMotifPanel({
  label,
  headline,
  detail,
  tags = []
}: EditorialMotifPanelProps) {
  return (
    <section data-testid="editorial-motif" className="editorial-fade-up editorial-fade-up-delay luxury-card" style={{ padding: "0 1.5rem 2.25rem" }}>
      <div
        style={{
          maxWidth: "70rem",
          margin: "0 auto",
          borderRadius: "1rem",
          border: "1px solid rgba(var(--brand-platinum-rgb), 0.45)",
          background:
            "linear-gradient(140deg, rgba(var(--brand-white-rgb), 0.95), rgba(var(--brand-sand-rgb), 0.65))",
          boxShadow: "0 14px 28px rgba(var(--brand-ink-rgb), 0.08)",
          padding: "1.15rem",
          display: "grid",
          gap: "0.7rem"
        }}
      >
        <p style={{ margin: 0, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand-primary)", fontWeight: 700 }}>
          {label}
        </p>
        <h2 style={{ margin: 0, color: "var(--brand-ink)" }}>{headline}</h2>
        <p style={{ margin: 0, color: "var(--brand-cocoa)" }}>{detail}</p>
        {tags.length > 0 ? (
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  borderRadius: "999px",
                  border: "1px solid rgba(var(--brand-primary-rgb), 0.25)",
                  color: "var(--brand-primary)",
                  padding: "0.25rem 0.65rem",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  backgroundColor: "rgba(var(--brand-white-rgb), 0.8)"
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
