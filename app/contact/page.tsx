import { cache } from "react";
import type { Metadata } from "next";
import ContactForm from "@/src/components/contact/ContactForm";
import { fetchSanitySafe } from "@/sanity/lib/client";
import { PAGE_CONTACT_QUERY } from "@/sanity/lib/queries";
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
  title: "Plan your Tulum celebration with local experts",
  description:
    "Share your vision, timeline, and guest count, and our planning team will guide your next steps.",
  email: "hello@tulumlivingweddings.com",
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
      <section style={{ display: "grid", gap: "1rem", padding: "2rem 1.5rem" }}>
        <p style={{ margin: 0, color: "#2563eb", fontWeight: 600, textTransform: "uppercase" }}>{FALLBACK_CONTENT.eyebrow}</p>
        <h1 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.2 }}>
          {resolveMarketingCopy(page?.title, FALLBACK_CONTENT.title)}
        </h1>
        <p style={{ margin: 0, maxWidth: "48rem", color: "#4b5563" }}>
          {resolveMarketingCopy(page?.intro, FALLBACK_CONTENT.description)}
        </p>
      </section>

      <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "1rem", maxWidth: "48rem" }}>
        <h2 style={{ margin: 0 }}>Send us your wedding plans</h2>
        <ContactForm
          submitButtonLabel={page?.submitButtonLabel?.trim() || FALLBACK_CONTENT.submitButtonLabel}
          successMessage={page?.successMessage?.trim() || FALLBACK_CONTENT.successMessage}
        />
      </section>

      <section style={{ padding: "0 1.5rem 2rem", display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Connect with our planning team</h2>
        <p style={{ margin: 0 }}>
          Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
        <p style={{ margin: 0 }}>
          Phone: <a href={`tel:${contactPhoneHref}`}>{contactPhoneRaw}</a>
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Based in Tulum, Quintana Roo, serving destination weddings across the Riviera Maya.
        </p>
      </section>
    </main>
  );
}
