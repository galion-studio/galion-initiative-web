'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

// Dynamically import the PDFViewer to avoid SSR issues with canvas
const PDFViewer = dynamic(() => import('@/components/pdf/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-400">
        <div className="animate-pulse">Loading Viewer...</div>
    </div>
  ),
});

export default function BlueprintPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "The Galion Blueprint V2.0",
            "description": "Our comprehensive technical architecture for safe superintelligence. Details the dual-core alignment protocols and hardware-level safety constraints.",
            "author": {
              "@type": "Organization",
              "name": "The Galion Initiative"
            },
            "publisher": {
              "@type": "Organization",
              "name": "The Galion Initiative",
              "logo": {
                "@type": "ImageObject",
                "url": "https://galioninitiative.org/logo.webp"
              }
            },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-01",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://galioninitiative.org/blueprint"
            }
          })
        }}
      />
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
              "name": "The Blueprint",
              "item": "https://galioninitiative.org/blueprint"
            }]
          })
        }}
      />
        {/* Top Navigation */}
        <div className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800">
            <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
                <Link 
                  href="/" 
                  className="flex items-center text-neutral-400 hover:text-white transition-colors group touch-manipulation min-h-[44px] min-w-[44px] items-center justify-center -ml-2 pl-2"
                  onClick={() => trackEvent('click_back_to_home', { from: 'blueprint_page' })}
                >
                    <ArrowLeft className="w-5 h-5 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Back to Home</span>
                </Link>

                <div className="flex items-center">
                    <a 
                      href="/blueprint.pdf" 
                      download="Galion-Blueprint-V2.pdf"
                      onClick={() => trackEvent('click_download_pdf', { location: 'blueprint_page', filename: 'Galion-Blueprint-V2.pdf' })}
                      className="touch-manipulation"
                    >
                        <Button variant="outline" size="sm" className="border-neutral-700 bg-transparent hover:bg-neutral-800 hover:border-neutral-600 text-neutral-200 hover:text-white text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                            <span className="hidden xs:inline sm:inline">Download PDF</span>
                            <span className="xs:inline sm:hidden">Download</span>
                        </Button>
                    </a>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 container mx-auto px-2 sm:px-4 md:px-4 py-4 sm:py-6 md:py-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 sm:mb-8 text-center px-2 sm:px-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
                        The Galion Blueprint V2.0
                    </h1>
                    <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Our comprehensive technical architecture for safe superintelligence. 
                        This document details the dual-core alignment protocols and hardware-level safety constraints.
                    </p>
                </div>

                <PDFViewer url="/blueprint.pdf" />
            </div>
        </div>
    </main>
  );
}

