import Link from "next/link";

type SiteFooterProps = {
  companyName?: string;
};

export default function SiteFooter({ companyName = "Tulum Living Weddings" }: SiteFooterProps) {
  return (
    <footer
      data-testid="site-footer"
      style={{
        borderTop: "1px solid #e5e7eb",
        padding: "1.5rem",
        display: "grid",
        gap: "0.75rem",
        color: "#4b5563"
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} {companyName}
      </p>
      <p style={{ margin: 0 }}>
        Crafting unforgettable destination celebrations in Tulum and the Riviera Maya.
      </p>
      <p style={{ margin: 0 }}>
        <Link href="/contact" style={{ color: "#2563eb" }}>
          Start planning your wedding
        </Link>
      </p>
    </footer>
  );
}
