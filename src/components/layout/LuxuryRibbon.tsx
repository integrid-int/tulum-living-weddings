import Link from "next/link";

export default function LuxuryRibbon() {
  return (
    <div
      data-testid="luxury-ribbon"
      style={{
        background:
          "linear-gradient(90deg, rgba(95, 74, 66, 0.96), rgba(195, 77, 95, 0.96), rgba(95, 74, 66, 0.96))",
        borderBottom: "1px solid rgba(255, 255, 255, 0.22)"
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: "75rem",
          padding: "0.45rem 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.8rem",
          flexWrap: "wrap"
        }}
      >
        <p style={{ margin: 0, color: "var(--brand-cream)", fontWeight: 700, fontSize: "0.86rem", letterSpacing: "0.03em" }}>
          Limited 2027 luxury dates now open
        </p>
        <Link
          href="/contact"
          className="luxury-pill-link"
          style={{
            textDecoration: "none",
            color: "var(--brand-deep-cocoa)",
            backgroundColor: "var(--brand-accent)",
            borderRadius: "999px",
            padding: "0.25rem 0.7rem",
            fontWeight: 700,
            fontSize: "0.8rem"
          }}
        >
          Reserve your consultation
        </Link>
      </div>
    </div>
  );
}
