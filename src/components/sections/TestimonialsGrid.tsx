type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  imageUrl?: string;
};

type TestimonialsGridProps = {
  heading?: string;
  testimonials?: Testimonial[];
};

const defaultTestimonials: Testimonial[] = [
  {
    quote: "She was on top of every detail and always made herself available to help us.",
    author: "Kelly",
    role: "Destination Wedding Couple"
  },
  {
    quote: "Every vendor she provided was excellent, and she made planning remotely feel simple.",
    author: "Greg",
    role: "Destination Wedding Couple"
  },
  {
    quote: "Her organized approach and calm guidance delivered the exact celebration we envisioned.",
    author: "Andrea",
    role: "Destination Wedding Couple"
  }
];

export default function TestimonialsGrid({
  heading = "What clients say",
  testimonials = defaultTestimonials
}: TestimonialsGridProps) {
  return (
    <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>{heading}</h2>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
        }}
      >
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.author}
            style={{
              margin: 0,
              border: "1px solid rgba(175, 158, 133, 0.5)",
              borderRadius: "0.75rem",
              padding: "1rem",
              backgroundColor: "var(--brand-white)"
            }}
          >
            {testimonial.imageUrl ? (
              <img
                src={testimonial.imageUrl}
                alt={testimonial.author}
                loading="lazy"
                style={{ width: "100%", height: "10rem", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "0.75rem" }}
              />
            ) : null}
            <blockquote style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>
              “{testimonial.quote}”
            </blockquote>
            <figcaption style={{ marginTop: "0.75rem", color: "var(--brand-cocoa)" }}>
              <strong style={{ color: "var(--brand-primary)" }}>{testimonial.author}</strong>
              {testimonial.role ? ` — ${testimonial.role}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
