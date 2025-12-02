import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Blueprint",
  description: "Our comprehensive technical architecture for safe superintelligence. Details the dual-core alignment protocols and hardware-level safety constraints.",
  openGraph: {
    title: "The Blueprint | The Galion Initiative",
    description: "Our comprehensive technical architecture for safe superintelligence. Details the dual-core alignment protocols and hardware-level safety constraints.",
    url: "https://galioninitiative.org/blueprint",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Blueprint | The Galion Initiative",
    description: "Our comprehensive technical architecture for safe superintelligence.",
  },
  alternates: {
    canonical: "/blueprint",
  },
};

export default function BlueprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

