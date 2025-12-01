import type { Metadata } from "next";
import { ArrowLeft, Clock } from 'lucide-react';
import TrackedLink from '@/components/shared/TrackedLink';
import TrackedButton from '@/components/shared/TrackedButton';

export const metadata: Metadata = {
  title: "Research",
  description: "Explore our technical architecture, safety protocols, and research papers on dual-core superintelligence alignment.",
  openGraph: {
    title: "Research | The Galion Initiative",
    description: "Explore our technical architecture, safety protocols, and research papers on dual-core superintelligence alignment.",
    url: "https://galioninitiative.org/research",
  },
  alternates: {
    canonical: "/research",
  },
};

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://galioninitiative.org"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "Research",
              "item": "https://galioninitiative.org/research"
            }]
          })
        }}
      />

      <div className="relative z-10 text-center max-w-2xl">
        <div className="flex justify-center mb-8">
            <img src="/logo.webp" alt="The Galion Initiative" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(14,165,233,0.2)]" />
        </div>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 mb-8 shadow-2xl">
            <Clock className="w-8 h-8 text-primary-500 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Research in Progress
        </h1>
        
        <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-light">
          Our team is currently finalizing the first public release of our technical architecture documentation. We adhere to strict verification standards before publication.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <TrackedLink 
              href="/"
              className="inline-block"
              eventName="click_back_to_home"
              eventProperties={{ from: 'research_page' }}
            >
              <button className="inline-flex items-center justify-center border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 hover:text-white h-11 sm:h-12 px-6 sm:px-8 rounded-full border transition-colors touch-manipulation min-w-[140px] text-sm sm:text-base">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </button>
            </TrackedLink>
            <TrackedLink 
              href="/#join-team"
              className="inline-block"
              eventName="click_join_team"
              eventProperties={{ from: 'research_page' }}
            >
              <button className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white h-11 sm:h-12 px-6 sm:px-8 rounded-full transition-colors touch-manipulation min-w-[180px] text-sm sm:text-base">
                Join the Research Team
              </button>
            </TrackedLink>
        </div>
      </div>
    </main>
  );
}
