import Link from "next/link";

type HeroProps = {
  eyebrow?: string;
  kicker?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  backgroundImageUrl?: string;
};

export default function Hero({
  eyebrow,
  kicker,
  title,
  description,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  backgroundImageUrl
}: HeroProps) {
  return (
    <section
      className="editorial-fade-up"
      style={{
        padding: "3.5rem 1.5rem 4.5rem",
        backgroundColor: "var(--brand-sand)",
        backgroundImage: backgroundImageUrl
          ? `linear-gradient(rgba(var(--brand-ink-rgb), 0.66), rgba(var(--brand-ink-rgb), 0.58)), url(${backgroundImageUrl})`
          : "linear-gradient(120deg, rgba(var(--brand-primary-rgb), 0.2), rgba(var(--brand-accent-rgb), 0.22))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "var(--brand-white)",
        minHeight: "clamp(26rem, 58vh, 38rem)",
        display: "grid",
        alignContent: "end"
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: "70rem",
          display: "grid",
          gap: "1rem",
          borderRadius: "1rem",
          padding: "1rem",
          backgroundColor: "rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(2px)"
        }}
      >
        {eyebrow ? (
          <p style={{ margin: 0, color: "var(--brand-accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {eyebrow}
          </p>
        ) : null}
        {kicker ? (
          <p style={{ margin: 0, color: "rgba(var(--brand-white-rgb), 0.92)", fontWeight: 600, fontStyle: "italic", letterSpacing: "0.01em" }}>
            {kicker}
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
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
            {secondaryCtaLabel && secondaryCtaHref ? (
              <Link
                href={secondaryCtaHref}
                style={{
                  display: "inline-block",
                  color: "var(--brand-white)",
                  textDecoration: "none",
                  borderRadius: "0.6rem",
                  padding: "0.72rem 1.15rem",
                  fontWeight: 700,
                  border: "1px solid rgba(255, 255, 255, 0.7)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)"
                }}
              >
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
