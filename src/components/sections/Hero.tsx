import Link from "next/link";

type HeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function Hero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref
}: HeroProps) {
  return (
    <section style={{ display: "grid", gap: "1rem", padding: "2rem 1.5rem" }}>
      {eyebrow ? (
        <p style={{ margin: 0, color: "#2563eb", fontWeight: 600, textTransform: "uppercase" }}>
          {eyebrow}
        </p>
      ) : null}
      <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.2 }}>{title}</h1>
      <p style={{ margin: 0, maxWidth: "48rem", color: "#4b5563" }}>{description}</p>
      {ctaLabel && ctaHref ? (
        <div>
          <Link
            href={ctaHref}
            style={{
              display: "inline-block",
              backgroundColor: "#111827",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "0.5rem",
              padding: "0.625rem 1rem"
            }}
          >
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
