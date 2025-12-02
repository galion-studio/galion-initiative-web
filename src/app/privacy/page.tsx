'use client';

import TrackedLink from '@/components/shared/TrackedLink';
import { ArrowLeft } from 'lucide-react';

// Metadata is handled in layout.tsx for client components

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 py-24 px-4 md:px-6">
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
              "name": "Privacy Policy",
              "item": "https://galioninitiative.org/privacy"
            }]
          })
        }}
      />
      <div className="container mx-auto max-w-3xl">
        <TrackedLink 
          href="/" 
          className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-8 transition-colors"
          eventName="click_back_to_home"
          eventProperties={{ from: 'privacy_page' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </TrackedLink>
        
        <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="lead text-xl text-neutral-400 mb-8">
            Last Updated: December 1, 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>
              The Galion Initiative ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website galioninitiative.org or engage with our research and mission.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">2. Information We Collect</h2>
            <p className="text-sm sm:text-base">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base">
              <li>Contact information (name, email address) when you join our newsletter or apply to join the team.</li>
              <li>Professional information (resume, expertise) when you submit an application.</li>
              <li>Donation information (wallet addresses, transaction hashes) for cryptocurrency contributions. Note that while blockchain transactions are public, we do not link them to personal identities unless explicitly requested for tax purposes.</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">3. How We Use Your Information</h2>
            <p className="text-sm sm:text-base">We use the information we collect to:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base">
              <li>Communicate with you about our research, mission progress, and events.</li>
              <li>Process job applications and assess candidate suitability.</li>
              <li>Verify and acknowledge donations.</li>
              <li>Improve the security and functionality of our website.</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">4. Data Security</h2>
            <p className="text-sm sm:text-base">
              We implement institutional-grade security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">5. Contact Us</h2>
            <p className="text-sm sm:text-base">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const subject = encodeURIComponent('Privacy Policy Inquiry - The Galion Initiative');
                  const body = encodeURIComponent(`Dear Galion Initiative Team,

I have a question regarding your Privacy Policy.

[Please provide details about your question here]

Best regards,
[Your Name]
[Your Email]`);
                  window.location.href = `mailto:contact@galioninitiative.org?subject=${subject}&body=${body}`;
                }}
                className="text-primary-400 hover:underline break-all cursor-pointer"
              >
                contact@galioninitiative.org
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
