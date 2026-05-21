import Link from "next/link";

type SiteFooterProps = {
  companyName?: string;
};

export default function SiteFooter({ companyName = "Tulum Living Weddings" }: SiteFooterProps) {
  return (
    <footer
      data-testid="site-footer"
      style={{
        borderTop: "1px solid rgba(var(--brand-platinum-rgb), 0.36)",
        padding: "2rem 1.5rem",
        display: "grid",
        gap: "0.95rem",
        color: "var(--brand-cream)",
        backgroundColor: "var(--brand-cocoa)"
      }}
    >
      <p style={{ margin: 0, fontWeight: 700 }}>
        © {new Date().getFullYear()} {companyName}
      </p>
      <p style={{ margin: 0 }}>
        Crafting unforgettable destination celebrations in Tulum and the Riviera Maya.
      </p>
      <p style={{ margin: 0, color: "rgba(255, 244, 230, 0.86)" }}>
        Riviera Maya • Tulum • Playa del Carmen • Cancun
      </p>
      <p style={{ margin: 0 }}>
        <Link href="/contact" style={{ color: "var(--brand-accent)", fontWeight: 700 }}>
          Begin your couture planning
        </Link>
      </p>
    </footer>
  );
}
