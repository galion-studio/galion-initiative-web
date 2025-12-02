import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using The Galion Initiative's website and resources.",
  openGraph: {
    title: "Terms of Service | The Galion Initiative",
    description: "Terms and conditions for using The Galion Initiative's website and resources.",
    url: "https://galioninitiative.org/terms",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | The Galion Initiative",
    description: "Terms and conditions for using The Galion Initiative's website and resources.",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

