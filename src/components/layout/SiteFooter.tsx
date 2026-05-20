import Link from "next/link";

type SiteFooterProps = {
  companyName?: string;
};

export default function SiteFooter({ companyName = "Tulum Living Weddings" }: SiteFooterProps) {
  return (
    <footer
      data-testid="site-footer"
      style={{
        borderTop: "1px solid rgba(140, 110, 97, 0.35)",
        padding: "1.5rem",
        display: "grid",
        gap: "0.75rem",
        color: "var(--brand-cream)",
        backgroundColor: "var(--brand-cocoa)"
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} {companyName}
      </p>
      <p style={{ margin: 0 }}>
        Crafting unforgettable destination celebrations in Tulum and the Riviera Maya.
      </p>
      <p style={{ margin: 0 }}>
        <Link href="/contact" style={{ color: "var(--brand-accent)", fontWeight: 700 }}>
          Start planning your wedding
        </Link>
      </p>
    </footer>
  );
}
