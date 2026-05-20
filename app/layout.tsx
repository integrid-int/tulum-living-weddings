import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteFooter from "@/src/components/layout/SiteFooter";
import SiteHeader from "@/src/components/layout/SiteHeader";
import JsonLd from "@/src/components/seo/JsonLd";
import { OPENGRAPH_IMAGE_PATH, SITE_DESCRIPTION, SITE_NAME, SITE_URL, buildCanonicalUrl, buildSitewideJsonLd } from "@/src/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: buildCanonicalUrl(SITE_URL, OPENGRAPH_IMAGE_PATH),
        width: 1200,
        height: 630,
        alt: "Tulum Living Weddings oceanfront destination wedding setup"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [buildCanonicalUrl(SITE_URL, OPENGRAPH_IMAGE_PATH)]
  },
  robots: {
    index: true,
    follow: true
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const sitewideJsonLd = buildSitewideJsonLd();

  return (
    <html lang="en">
      <body>
        <JsonLd data={sitewideJsonLd} />
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <SiteHeader />
          <div style={{ flex: 1 }}>{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
