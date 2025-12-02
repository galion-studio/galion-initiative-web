import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "The Galion Initiative's Privacy Policy. Learn how we collect, use, and protect your information when you visit our website or engage with our research.",
  openGraph: {
    title: "Privacy Policy | The Galion Initiative",
    description: "The Galion Initiative's Privacy Policy. Learn how we collect, use, and protect your information.",
    url: "https://galioninitiative.org/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | The Galion Initiative",
    description: "The Galion Initiative's Privacy Policy.",
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

