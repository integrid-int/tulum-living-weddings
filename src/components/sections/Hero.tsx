import Link from "next/link";

type HeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImageUrl?: string;
};

export default function Hero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  backgroundImageUrl
}: HeroProps) {
  return (
    <section
      style={{
        display: "grid",
        gap: "1rem",
        padding: "2.5rem 1.5rem",
        backgroundColor: "var(--brand-sand)",
        backgroundImage: backgroundImageUrl
          ? `linear-gradient(rgba(95, 74, 66, 0.58), rgba(95, 74, 66, 0.58)), url(${backgroundImageUrl})`
          : "linear-gradient(120deg, rgba(195, 77, 95, 0.16), rgba(248, 186, 80, 0.24))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "var(--brand-white)"
      }}
    >
      {eyebrow ? (
        <p style={{ margin: 0, color: "var(--brand-accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {eyebrow}
        </p>
      ) : null}
      <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.2 }}>{title}</h1>
      <p style={{ margin: 0, maxWidth: "48rem", color: "rgba(255, 255, 255, 0.92)", fontWeight: 500 }}>{description}</p>
      {ctaLabel && ctaHref ? (
        <div>
          <Link
            href={ctaHref}
            style={{
              display: "inline-block",
              backgroundColor: "var(--brand-primary)",
              color: "var(--brand-white)",
              textDecoration: "none",
              borderRadius: "0.5rem",
              padding: "0.625rem 1rem",
              fontWeight: 700
            }}
          >
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
