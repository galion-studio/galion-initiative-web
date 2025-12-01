import type { Metadata } from "next";
import TrackedLink from '@/components/shared/TrackedLink';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using The Galion Initiative's website and resources.",
  openGraph: {
    title: "Terms of Service | The Galion Initiative",
    url: "https://galioninitiative.org/terms",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfService() {
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
              "name": "Terms of Service",
              "item": "https://galioninitiative.org/terms"
            }]
          })
        }}
      />
      <div className="container mx-auto max-w-3xl">
        <TrackedLink 
          href="/" 
          className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-6 sm:mb-8 transition-colors touch-manipulation min-h-[44px]"
          eventName="click_back_to_home"
          eventProperties={{ from: 'terms_page' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </TrackedLink>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 tracking-tight">Terms of Service</h1>
        
        <div className="prose prose-invert prose-neutral max-w-none prose-sm sm:prose-base">
          <p className="lead text-lg sm:text-xl text-neutral-400 mb-6 sm:mb-8">
            Last Updated: December 1, 2025
          </p>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">1. Agreement to Terms</h2>
            <p className="text-sm sm:text-base">
              By accessing our website and resources, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">2. Intellectual Property</h2>
            <p className="text-sm sm:text-base">
              The Galion Initiative is an open research organization. Unless otherwise stated, our public research papers and code are released under permissive open licenses (such as MIT or CC-BY). However, the Galion Initiative brand, logo, and website design are proprietary.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">3. User Conduct</h2>
            <p className="text-sm sm:text-base">
              You agree not to use the website for any unlawful purpose or in any way that interrupts, damages, or impairs the service.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">4. Disclaimers</h2>
            <p className="text-sm sm:text-base">
              Our research and publications are provided "as is" for informational purposes only. They do not constitute professional advice. We make no warranties regarding the accuracy or completeness of any information found on this site.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">5. Governing Law</h2>
            <p className="text-sm sm:text-base">
              These Terms shall be governed by and defined following the laws of the jurisdiction in which The Galion Initiative is incorporated.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
