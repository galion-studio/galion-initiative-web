import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the researchers, engineers, and policy experts building safe superintelligence at The Galion Initiative.",
  openGraph: {
    title: "Our Team | The Galion Initiative",
    description: "Meet the researchers, engineers, and policy experts building safe superintelligence at The Galion Initiative.",
    url: "https://galioninitiative.org/team",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team | The Galion Initiative",
    description: "Meet the researchers, engineers, and policy experts building safe superintelligence.",
  },
  alternates: {
    canonical: "/team",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

