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
    question: "How far in advance should we start planning?",
    answer: "Most destination couples start 9 to 14 months ahead, but we can also support shorter timelines."
  },
  {
    question: "Can you help with legal ceremonies in Mexico?",
    answer: "Yes. We guide document requirements and legal planning logistics for civil ceremonies."
  },
  {
    question: "Do you coordinate guest logistics too?",
    answer: "Absolutely. We support transfers, event-week communication, and guest experience planning."
  }
];

export default function FaqAccordion({
  heading = "Frequently asked questions",
  items = defaultFaqItems
}: FaqAccordionProps) {
  return (
    <section className="editorial-fade-up" style={{ padding: "0 1.5rem 2.25rem" }}>
      <div style={{ margin: "0 auto", maxWidth: "70rem", display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>{heading}</h2>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {items.map((item) => (
          <details
            key={item.question}
            style={{
              border: "1px solid rgba(175, 158, 133, 0.5)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              backgroundColor: "var(--brand-white)",
              boxShadow: "0 6px 16px rgba(95, 74, 66, 0.06)"
            }}
          >
            <summary style={{ cursor: "pointer", fontWeight: 700, color: "var(--brand-primary)" }}>{item.question}</summary>
            <p style={{ marginBottom: 0, color: "var(--brand-cocoa)" }}>{item.answer}</p>
          </details>
        ))}
      </div>
      </div>
    </section>
  );
}
