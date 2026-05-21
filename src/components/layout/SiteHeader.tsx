import Link from "next/link";
import { BRAND_IMAGE_SOURCES } from "@/src/lib/brand";

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
  title = "Tulum Living Weddings",
  links = defaultLinks
}: SiteHeaderProps) {
  return (
    <header
      data-testid="site-header"
      style={{
        borderBottom: "1px solid rgba(var(--brand-cocoa-rgb), 0.24)",
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "saturate(140%) blur(3px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0.9rem 1.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <Link
        href="/"
        style={{ fontWeight: 700, textDecoration: "none", color: "var(--brand-deep-cocoa)", display: "inline-flex", alignItems: "center", gap: "0.75rem" }}
      >
        <img
          src={BRAND_IMAGE_SOURCES.logo}
          alt="Tulum Living Weddings logo"
          width={42}
          height={42}
          style={{ borderRadius: "999px", objectFit: "cover", border: "2px solid var(--brand-sand)" }}
        />
        <span>{title}</span>
      </Link>
      <nav aria-label="Primary" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
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
              <Link
                href={link.href}
                className="luxury-nav-link"
                style={{
                  color: "var(--brand-cocoa)",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "color 180ms ease"
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/contact"
          className="luxury-pill-link"
          style={{
            color: "var(--brand-white)",
            textDecoration: "none",
            fontWeight: 700,
            backgroundColor: "var(--brand-primary)",
            borderRadius: "999px",
            padding: "0.45rem 0.85rem",
            fontSize: "0.92rem",
            transition: "transform 180ms ease, box-shadow 180ms ease"
          }}
        >
          Book consultation
        </Link>
      </nav>
    </header>
  );
}
