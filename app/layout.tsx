import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteFooter from "@/src/components/layout/SiteFooter";
import SiteHeader from "@/src/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tulum Living Weddings",
  description: "Destination wedding planning services in Tulum and the Riviera Maya"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <SiteHeader />
          <div style={{ flex: 1 }}>{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
