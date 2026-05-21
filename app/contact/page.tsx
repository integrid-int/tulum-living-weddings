import { cache } from "react";
import type { Metadata } from "next";
import ContactForm from "@/src/components/contact/ContactForm";
import EditorialMotifPanel from "@/src/components/sections/EditorialMotifPanel";
import { fetchSanitySafe } from "@/sanity/lib/client";
import { PAGE_CONTACT_QUERY } from "@/sanity/lib/queries";
import { BRAND_IMAGE_SOURCES } from "@/src/lib/brand";
import { resolveMarketingCopy } from "@/src/lib/copy";
import { buildRouteMetadata, type RouteSeoFields } from "@/src/lib/route-metadata";

type ContactPageDocument = {
  title?: string | null;
  intro?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  submitButtonLabel?: string | null;
  successMessage?: string | null;
  seo?: RouteSeoFields | null;
};

const FALLBACK_CONTENT = {
  eyebrow: "Contact",
  title: "Contact us",
  description:
    "Tell us about your event and we will guide your next steps. The best way to reach us is by email and we respond promptly.",
  email: "TulumLiving@gmail.com",
  phone: "+529841230456",
  phoneDisplay: "+52 (984) 123-0456",
  submitButtonLabel: "Submit inquiry",
  successMessage: "Thanks for reaching out. Our planning team will contact you shortly."
};

function sanitizePhoneForTel(phone: string | null | undefined): string | null {
  const trimmed = phone?.trim();
  if (!trimmed) {
    return null;
  }

  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.length < 7) {
    return null;
  }

  const hasInternationalPrefix = trimmed.startsWith("+") || trimmed.startsWith("00");
  return hasInternationalPrefix ? `+${digitsOnly}` : digitsOnly;
}

const getContactPageData = cache(async () => fetchSanitySafe<ContactPageDocument | null>(PAGE_CONTACT_QUERY, null));

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPageData();

  return buildRouteMetadata({
    routePath: "/contact",
    fallbackTitle: FALLBACK_CONTENT.title,
    fallbackDescription: FALLBACK_CONTENT.description,
    seo: page?.seo
  });
}

export default async function ContactPage() {
  const page = await getContactPageData();
  const contactEmail = page?.contactEmail?.trim() || FALLBACK_CONTENT.email;
  const cmsPhone = page?.contactPhone?.trim() ?? "";
  const sanitizedCmsPhone = sanitizePhoneForTel(cmsPhone);
  const hasValidCmsPhone = cmsPhone.length > 0 && sanitizedCmsPhone !== null;
  const contactPhoneRaw = hasValidCmsPhone ? cmsPhone : FALLBACK_CONTENT.phoneDisplay;
  const contactPhoneHref = hasValidCmsPhone ? sanitizedCmsPhone : FALLBACK_CONTENT.phone;

  return (
    <main>
      <section
        className="editorial-fade-up"
        style={{
          display: "grid",
          alignContent: "end",
          minHeight: "clamp(24rem, 52vh, 35rem)",
          padding: "3rem 1.5rem 3.8rem",
          backgroundImage: `linear-gradient(rgba(var(--brand-ink-rgb), 0.68), rgba(var(--brand-ink-rgb), 0.62)), url(${BRAND_IMAGE_SOURCES.contactHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "var(--brand-white)"
        }}
      >
        <div
          style={{
            margin: "0 auto",
            width: "100%",
            maxWidth: "70rem",
            display: "grid",
            gap: "1rem",
            backgroundColor: "rgba(0, 0, 0, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: "1rem",
            padding: "1rem",
            backdropFilter: "blur(2px)"
          }}
        >
          <p style={{ margin: 0, color: "var(--brand-accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{FALLBACK_CONTENT.eyebrow}</p>
          <h1 style={{ margin: 0, fontSize: "clamp(2rem, 3.4vw, 3rem)", lineHeight: 1.12 }}>
            {resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
          </h1>
          <p style={{ margin: 0, maxWidth: "48rem", color: "rgba(255, 255, 255, 0.92)" }}>
            {resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
          </p>
        </div>
      </section>

      <EditorialMotifPanel
        label="Concierge Access"
        headline="A direct planning line for couples who want refined guidance, fast."
        detail="Share your vision and constraints, and we’ll return with a strategic roadmap for venues, design, and execution."
        tags={["24h Response", "Bespoke Strategy", "On-Site Leadership"]}
      />

      <section className="editorial-fade-up editorial-fade-up-delay" style={{ padding: "0 1.5rem 2.4rem" }}>
        <div
          style={{
            margin: "0 auto",
            width: "100%",
            maxWidth: "70rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
          }}
        >
          <article
            style={{
              border: "1px solid rgba(175, 158, 133, 0.5)",
              borderRadius: "1rem",
              padding: "1rem",
              backgroundColor: "var(--brand-white)",
              boxShadow: "0 10px 24px rgba(95, 74, 66, 0.08)"
            }}
          >
            <h2 style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>Send us your wedding plans</h2>
            <p style={{ margin: "0.5rem 0 1rem", color: "var(--brand-cocoa)" }}>
              Tell us your date, guest count, and vision. We typically respond within 24 hours.
            </p>
            <ContactForm
              submitButtonLabel={page?.submitButtonLabel?.trim() || FALLBACK_CONTENT.submitButtonLabel}
              successMessage={page?.successMessage?.trim() || FALLBACK_CONTENT.successMessage}
            />
          </article>

          <aside
            style={{
              border: "1px solid rgba(175, 158, 133, 0.5)",
              borderRadius: "1rem",
              padding: "1rem",
              background: "linear-gradient(160deg, rgba(255, 255, 255, 0.98), rgba(255, 244, 230, 0.72))",
              boxShadow: "0 10px 24px rgba(95, 74, 66, 0.08)",
              display: "grid",
              gap: "0.9rem",
              alignContent: "start"
            }}
          >
            <h2 style={{ margin: 0, color: "var(--brand-deep-cocoa)" }}>Your concierge planning flow</h2>
            <ol style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--brand-cocoa)", display: "grid", gap: "0.5rem" }}>
              <li>Discovery call to align vision and budget.</li>
              <li>Curated venues and design direction.</li>
              <li>Vendor matching and timeline buildout.</li>
              <li>On-site production and wedding day execution.</li>
            </ol>
            <p style={{ margin: 0 }}>
              Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </p>
            <p style={{ margin: 0 }}>
              Phone: <a href={`tel:${contactPhoneHref}`}>{contactPhoneRaw}</a>
            </p>
            <p style={{ margin: 0, color: "var(--brand-cocoa)" }}>
              Based in Tulum, Quintana Roo, serving destination weddings across the Riviera Maya.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
