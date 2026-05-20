import Link from "next/link";

type SiteFooterProps = {
  companyName?: string;
};

export default function SiteFooter({ companyName = "Acme Service Co." }: SiteFooterProps) {
  return (
    <footer
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
        Built with baseline placeholder content until Sanity content is seeded.
      </p>
      <p style={{ margin: 0 }}>
        <Link href="/contact" style={{ color: "#2563eb" }}>
          Contact our team
        </Link>
      </p>
    </footer>
  );
}
