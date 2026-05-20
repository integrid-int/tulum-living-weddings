import Link from "next/link";

export default function ConciergeFab() {
  return (
    <Link
      href="/contact"
      data-testid="concierge-fab"
      className="luxury-fab"
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        zIndex: 65,
        textDecoration: "none",
        color: "var(--brand-white)",
        background: "linear-gradient(135deg, var(--brand-primary), #a73f52)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "999px",
        padding: "0.72rem 1rem",
        fontWeight: 700,
        boxShadow: "0 14px 26px rgba(95, 74, 66, 0.34)"
      }}
    >
      Plan with concierge
    </Link>
  );
}
