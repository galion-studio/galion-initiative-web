import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import AnalyticsScript from "@/components/AnalyticsScript";
import CookieConsent from "@/components/shared/CookieConsent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://galioninitiative.org"),
  title: {
    default: "The Galion Initiative | Building Safe Superintelligence",
    template: "%s | The Galion Initiative",
  },
  description: "Independent nonprofit research organization developing provably safe artificial superintelligence through dual-core architecture and transparent oversight.",
  keywords: ["AI safety", "superintelligence", "AGI", "ASI", "alignment research", "AI governance", "nonprofit AI"],
  authors: [{ name: "The Galion Initiative" }],
  creator: "The Galion Initiative",
  publisher: "The Galion Initiative",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "The Galion Initiative | Building Safe Superintelligence",
    description: "Independent nonprofit research organization developing provably safe artificial superintelligence.",
    url: "https://galioninitiative.org",
    siteName: "The Galion Initiative",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "The Galion Initiative - Building Safe Superintelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Galion Initiative",
    description: "Building safe superintelligence for humanity.",
    creator: "@galioninitiative",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: '/logo.webp', sizes: 'any', type: 'image/webp' },
    ],
    apple: [
      { url: '/logo.webp', sizes: '180x180', type: 'image/webp' },
    ],
    shortcut: '/logo.webp',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950`}
      >
        <AnalyticsScript />
        <AnalyticsProvider />
        {children}
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  );
}
