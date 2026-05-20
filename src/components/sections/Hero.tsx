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
        padding: "3.5rem 1.5rem 4.5rem",
        backgroundColor: "var(--brand-sand)",
        backgroundImage: backgroundImageUrl
          ? `linear-gradient(rgba(95, 74, 66, 0.6), rgba(95, 74, 66, 0.56)), url(${backgroundImageUrl})`
          : "linear-gradient(120deg, rgba(195, 77, 95, 0.16), rgba(248, 186, 80, 0.24))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "var(--brand-white)"
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: "70rem", display: "grid", gap: "1rem" }}>
        {eyebrow ? (
          <p style={{ margin: 0, color: "var(--brand-accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {eyebrow}
          </p>
        ) : null}
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 3.4vw, 3.2rem)",
            lineHeight: 1.12,
            maxWidth: "52rem",
            textWrap: "balance"
          }}
        >
          {title}
        </h1>
        <p style={{ margin: 0, maxWidth: "48rem", color: "rgba(255, 255, 255, 0.92)", fontWeight: 500, fontSize: "1.05rem" }}>
          {description}
        </p>
        {ctaLabel && ctaHref ? (
          <div>
            <Link
              href={ctaHref}
              style={{
                display: "inline-block",
                backgroundColor: "var(--brand-primary)",
                color: "var(--brand-white)",
                textDecoration: "none",
                borderRadius: "0.6rem",
                padding: "0.72rem 1.15rem",
                fontWeight: 700,
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)"
              }}
            >
              {ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
