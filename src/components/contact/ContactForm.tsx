"use client";

import { type CSSProperties, type FormEvent, useState } from "react";

type SubmitState =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type ContactFormProps = {
  submitButtonLabel: string;
  successMessage: string;
};

const baseInputStyles: CSSProperties = {
  width: "100%",
  border: "1px solid rgba(175, 158, 133, 0.6)",
  borderRadius: "0.5rem",
  padding: "0.625rem 0.75rem",
  font: "inherit",
  color: "var(--brand-deep-cocoa)",
  backgroundColor: "var(--brand-white)"
};

function toOptionalString(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export default function ContactForm({ submitButtonLabel, successMessage }: ContactFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ type: "submitting" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const guestCountValue = toOptionalString(formData.get("guestCount"));

    const payload = {
      name: toOptionalString(formData.get("name")) ?? "",
      email: toOptionalString(formData.get("email")) ?? "",
      phone: toOptionalString(formData.get("phone")),
      eventDate: toOptionalString(formData.get("eventDate")),
      guestCount: guestCountValue ? Number(guestCountValue) : undefined,
      budgetRange: toOptionalString(formData.get("budgetRange")),
      eventType: toOptionalString(formData.get("eventType")),
      message: toOptionalString(formData.get("message")) ?? "",
      consent: formData.get("consent") === "on",
      sourcePage: "/contact",
      website: toOptionalString(formData.get("website")) ?? ""
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        const message =
          typeof body?.message === "string"
            ? body.message
            : "We could not send your request. Please try again.";
        setSubmitState({ type: "error", message });
        return;
      }

      form.reset();
      setSubmitState({
        type: "success",
        message: successMessage
      });
    } catch {
      setSubmitState({
        type: "error",
        message: "Network issue while sending your request. Please try again."
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Name *</span>
        <input name="name" type="text" required style={baseInputStyles} autoComplete="name" />
      </label>

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Email *</span>
        <input name="email" type="email" required style={baseInputStyles} autoComplete="email" />
      </label>

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Phone / WhatsApp</span>
        <input name="phone" type="tel" style={baseInputStyles} autoComplete="tel" />
      </label>

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Event date</span>
        <input name="eventDate" type="date" style={baseInputStyles} />
      </label>

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Estimated guests</span>
        <input name="guestCount" type="number" min={1} step={1} style={baseInputStyles} />
      </label>

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Estimated budget range</span>
        <input name="budgetRange" type="text" style={baseInputStyles} />
      </label>

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Event type</span>
        <select name="eventType" defaultValue="" style={baseInputStyles}>
          <option value="">Select an event type</option>
          <option value="wedding">Wedding</option>
          <option value="engagement">Engagement</option>
          <option value="elopement">Elopement</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label style={{ display: "grid", gap: "0.25rem" }}>
        <span>Message *</span>
        <textarea name="message" required minLength={20} rows={6} style={baseInputStyles} />
      </label>

      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      />

      <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
        <input name="consent" type="checkbox" required style={{ marginTop: "0.25rem" }} />
        <span>I consent to being contacted by the Tulum Living Weddings team. *</span>
      </label>

      <button
        type="submit"
        disabled={submitState.type === "submitting"}
        style={{
          border: 0,
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
          backgroundColor: "var(--brand-primary)",
          color: "var(--brand-white)",
          font: "inherit",
          cursor: submitState.type === "submitting" ? "not-allowed" : "pointer",
          fontWeight: 700
        }}
      >
        {submitState.type === "submitting" ? "Sending..." : submitButtonLabel}
      </button>

      {submitState.type === "success" ? (
        <p style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>{submitState.message}</p>
      ) : null}

      {submitState.type === "error" ? <p style={{ margin: 0, color: "var(--brand-primary)" }}>{submitState.message}</p> : null}
    </form>
  );
}
