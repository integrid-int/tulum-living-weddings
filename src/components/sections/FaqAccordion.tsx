type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  heading?: string;
  items?: FaqItem[];
};

const defaultFaqItems: FaqItem[] = [
  {
    question: "Can these pages run before CMS content is ready?",
    answer: "Yes. Each route uses static placeholder data and typed props."
  },
  {
    question: "Will this block future Sanity integration?",
    answer: "No. The sections are intentionally lightweight and easy to wire to query results."
  },
  {
    question: "Is this production styling?",
    answer: "No. It is a baseline visual shell to keep this task focused on route readiness."
  }
];

export default function FaqAccordion({
  heading = "Frequently asked questions",
  items = defaultFaqItems
}: FaqAccordionProps) {
  return (
    <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0 }}>{heading}</h2>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {items.map((item) => (
          <details
            key={item.question}
            style={{ border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "0.75rem 1rem" }}
          >
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>{item.question}</summary>
            <p style={{ marginBottom: 0, color: "#4b5563" }}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
