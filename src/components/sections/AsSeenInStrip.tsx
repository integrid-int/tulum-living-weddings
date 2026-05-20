type AsSeenInStripProps = {
  heading?: string;
  publications?: string[];
};

const defaultPublications = [
  "Wedding Chicks",
  "WeddingWire",
  "Loverly",
  "Dancing With Her",
  "Google Reviews 5★",
  "International Couples"
];

export default function AsSeenInStrip({
  heading = "Featured in and trusted by",
  publications = defaultPublications
}: AsSeenInStripProps) {
  return (
    <section data-testid="as-seen-in" className="editorial-fade-up editorial-fade-up-delay" style={{ padding: "0 1.5rem 2.25rem" }}>
      <div
        style={{
          margin: "0 auto",
          maxWidth: "70rem",
          borderRadius: "999px",
          border: "1px solid rgba(175, 158, 133, 0.5)",
          backgroundColor: "rgba(255, 255, 255, 0.86)",
          backdropFilter: "blur(2px)",
          padding: "0.75rem 1rem",
          display: "grid",
          gap: "0.6rem"
        }}
      >
        <p style={{ margin: 0, color: "var(--brand-cocoa)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.78rem" }}>
          {heading}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.45rem 0.6rem"
          }}
        >
          {publications.map((publication) => (
            <span
              key={publication}
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "999px",
                padding: "0.33rem 0.72rem",
                border: "1px solid rgba(195, 77, 95, 0.22)",
                color: "var(--brand-primary)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                fontWeight: 700,
                fontSize: "0.85rem"
              }}
            >
              {publication}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
