import type { Metadata } from "next";
import TrackedLink from '@/components/shared/TrackedLink';
import { ArrowLeft, FileCheck, Shield, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: "Transparency Report",
  description: "View our financial reports, safety audits, and governance minutes. We believe superintelligence requires radical transparency.",
  openGraph: {
    title: "Transparency Report | The Galion Initiative",
    description: "View our financial reports, safety audits, and governance minutes.",
    url: "https://galioninitiative.org/transparency",
  },
  alternates: {
    canonical: "/transparency",
  },
};

export default function TransparencyReport() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 py-12 sm:py-16 md:py-24 px-4 md:px-6">
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
              "name": "Transparency",
              "item": "https://galioninitiative.org/transparency"
            }]
          })
        }}
      />
      <div className="container mx-auto max-w-4xl">
        <TrackedLink 
          href="/" 
          className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-6 sm:mb-8 transition-colors touch-manipulation min-h-[44px]"
          eventName="click_back_to_home"
          eventProperties={{ from: 'transparency_page' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </TrackedLink>
        
        <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                 <img src="/logo.webp" alt="The Galion Initiative" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                 <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">Transparency Report</h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
                We believe that organizations building superintelligence must be radically transparent. Here we publish our funding sources, expenditures, and safety audits.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
            <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Safety Audits</h3>
                <p className="text-sm sm:text-base text-neutral-400 mb-4 sm:mb-6">Independent third-party audits of our codebases and physical infrastructure.</p>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-neutral-800">
                        <span>Q3 2025 Safety Audit</span>
                        <span className="text-neutral-500 text-xs">Coming Soon</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-neutral-800">
                        <span>Infrastructure Penetration Test</span>
                        <span className="text-neutral-500 text-xs">Pending</span>
                    </div>
                </div>
            </div>

            <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                    <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Financials</h3>
                <p className="text-sm sm:text-base text-neutral-400 mb-4 sm:mb-6">Quarterly reports on donation inflows and research expenditures.</p>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-neutral-800">
                        <span>Q1 2025 Financial Report</span>
                        <span className="text-neutral-500 text-xs">Coming Soon</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-neutral-800">
                        <span>2025 Budget Allocation</span>
                        <span className="text-neutral-500 text-xs">Available Jan 2025</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-500 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">Governance</h3>
            <p className="text-sm sm:text-base text-neutral-400 mb-4 sm:mb-6 max-w-xl mx-auto leading-relaxed">
                Our Board of Directors meeting minutes are published with a 30-day delay, redacted only for personnel privacy and physical security details.
            </p>
            <button className="px-5 sm:px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-xs sm:text-sm transition-colors cursor-not-allowed opacity-50 touch-manipulation min-h-[44px]">
                Access Governance Portal (Restricted)
            </button>
        </div>
      </div>
    </main>
  );
}
