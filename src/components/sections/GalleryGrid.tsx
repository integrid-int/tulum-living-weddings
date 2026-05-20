type GalleryItem = {
  title: string;
  caption: string;
  imageUrl?: string;
};

type GalleryGridProps = {
  heading?: string;
  items?: GalleryItem[];
};

const defaultItems: GalleryItem[] = [
  {
    title: "Ceremony on the sand",
    caption: "Beachside altar styling, seating, and floral details for golden-hour vows."
  },
  {
    title: "Reception under the stars",
    caption: "Dinner layouts and party production tailored for destination wedding weekends."
  },
  {
    title: "Design details in motion",
    caption: "Signature flowers, table settings, and styling moments captured throughout the event."
  }
];

export default function GalleryGrid({
  heading = "Gallery of inspiration",
  items = defaultItems
}: GalleryGridProps) {
  return (
    <section style={{ padding: "0 1.5rem 2.25rem" }}>
      <div style={{ margin: "0 auto", maxWidth: "70rem", display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>{heading}</h2>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
        }}
      >
        {items.map((item) => (
          <article
            key={item.title}
            style={{
              border: "1px solid rgba(175, 158, 133, 0.5)",
              borderRadius: "0.75rem",
              overflow: "hidden",
              background: "var(--brand-white)",
              boxShadow: "0 10px 22px rgba(95, 74, 66, 0.08)"
            }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                style={{ display: "block", width: "100%", height: "12rem", objectFit: "cover" }}
              />
            ) : (
              <div style={{ background: "linear-gradient(135deg, var(--brand-sand), var(--brand-accent))", height: "12rem" }} />
            )}
            <div style={{ padding: "0.9rem" }}>
              <h3 style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>{item.title}</h3>
              <p style={{ marginBottom: 0, color: "var(--brand-cocoa)" }}>{item.caption}</p>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
