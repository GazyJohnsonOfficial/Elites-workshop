import type { Metadata, Viewport } from "next";
import "@fontsource/sora/latin-400.css";
import "@fontsource/sora/latin-500.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import "@fontsource/sora/latin-800.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/fraunces/latin-600.css";
import "@fontsource/fraunces/latin-700.css";
import "@fontsource/fraunces/latin-600-italic.css";
import "./globals.css";
import { Sprite } from "@/components/Sprite";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollEffects } from "@/components/ScrollEffects";
import { CookieConsent } from "@/components/CookieConsent";
import { RegionLocaleSync } from "@/components/RegionLocaleSync";
import { SITE_CONFIG } from "@/lib/config";

export const viewport: Viewport = {
  themeColor: "#0f2557",
  width: "device-width",
  initialScale: 1,
};

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
      <body>
        <Sprite />
        <Header />
        {children}
        <Footer />
        <ScrollEffects />
        <RegionLocaleSync />
        <CookieConsent />
      </body>
    </html>
  );
}
