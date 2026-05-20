type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

type TestimonialsGridProps = {
  heading?: string;
  testimonials?: Testimonial[];
};

const defaultTestimonials: Testimonial[] = [
  {
    quote: "The team made our launch path clear and practical from day one.",
    author: "Jordan Lee",
    role: "Operations Lead"
  },
  {
    quote: "Communication stayed crisp, and every milestone shipped on schedule.",
    author: "Sam Rivera",
    role: "Founder"
  },
  {
    quote: "Exactly what we needed for a clean baseline before CMS integration.",
    author: "Alex Kim",
    role: "Product Manager"
  }
];

export default function TestimonialsGrid({
  heading = "What clients say",
  testimonials = defaultTestimonials
}: TestimonialsGridProps) {
  return (
    <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0 }}>{heading}</h2>
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
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              padding: "1rem"
            }}
          >
            <blockquote style={{ margin: 0, color: "#1f2937" }}>
              “{testimonial.quote}”
            </blockquote>
            <figcaption style={{ marginTop: "0.75rem", color: "#4b5563" }}>
              <strong style={{ color: "#111827" }}>{testimonial.author}</strong>
              {testimonial.role ? ` — ${testimonial.role}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
