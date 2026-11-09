import type { Metadata } from "next";
import "./globals.css";
import { Sprite } from "@/components/Sprite";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollEffects } from "@/components/ScrollEffects";
import { CookieConsent } from "@/components/CookieConsent";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Elites Tech Solutions LLC | Cloud, Cybersecurity, Data & IT Staffing",
  description:
    "Senior-led cloud strategy, zero-downtime migration, cybersecurity governance, automated DevOps, data analytics, and IT staffing across the United States, the United Kingdom, and Ghana.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitestechsolutions.com"),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Elites Tech Solutions LLC | Cloud, Cybersecurity, Data & IT Staffing",
    description:
      "Senior-led cloud strategy, zero-downtime migration, cybersecurity governance, automated DevOps, data analytics, and IT staffing across the United States, the United Kingdom, and Ghana.",
    siteName: SITE_CONFIG.COMPANY,
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary",
    title: SITE_CONFIG.COMPANY,
    description: SITE_CONFIG.TAGLINE,
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f2557" />
        <link rel="preload" href="/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <Sprite />
        <Header />
        {children}
        <Footer />
        <ScrollEffects />
        <CookieConsent />
      </body>
    </html>
  );
}
