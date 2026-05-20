import Link from "next/link";

type NavLink = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  title?: string;
  links?: NavLink[];
};

const defaultLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/how-we-can-help", label: "How We Can Help" },
  { href: "/so-why-us", label: "Why Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader({
  title = "Acme Service Co.",
  links = defaultLinks
}: SiteHeaderProps) {
  return (
    <header
      style={{
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem 1.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Link href="/" style={{ fontWeight: 700, textDecoration: "none", color: "#111827" }}>
        {title}
      </Link>
      <nav aria-label="Primary">
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            margin: 0,
            padding: 0
          }}
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} style={{ color: "#374151", textDecoration: "none" }}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
