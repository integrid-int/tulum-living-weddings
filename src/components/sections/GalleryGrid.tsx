type GalleryItem = {
  title: string;
  caption: string;
};

type GalleryGridProps = {
  heading?: string;
  items?: GalleryItem[];
};

const defaultItems: GalleryItem[] = [
  {
    title: "Project kickoff",
    caption: "A focused session to align team goals and delivery expectations."
  },
  {
    title: "Milestone review",
    caption: "Structured checkpoints that keep progress visible and predictable."
  },
  {
    title: "Launch handoff",
    caption: "A clean baseline handoff package prepared for iteration."
  }
];

export default function GalleryGrid({
  heading = "Recent delivery snapshots",
  items = defaultItems
}: GalleryGridProps) {
  return (
    <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0 }}>{heading}</h2>
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
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              overflow: "hidden",
              background: "#f9fafb"
            }}
          >
            <div style={{ background: "#dbeafe", height: "7.5rem" }} />
            <div style={{ padding: "0.9rem" }}>
              <h3 style={{ margin: 0 }}>{item.title}</h3>
              <p style={{ marginBottom: 0, color: "#4b5563" }}>{item.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
