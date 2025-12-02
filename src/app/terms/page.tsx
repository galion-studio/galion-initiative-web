'use client';

import Link from 'next/link';
import TrackedLink from '@/components/shared/TrackedLink';
import { ArrowLeft } from 'lucide-react';

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
            Last Updated: December 2, 2025
          </p>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">1. Agreement to Terms</h2>
            <p className="text-sm sm:text-base mb-3">
              Welcome to The Galion Initiative. These Terms of Service ("Terms," "Agreement") constitute a legally binding agreement between you ("User," "you," or "your") and The Galion Initiative ("we," "us," "our," or "The Galion Initiative"), an independent nonprofit research organization dedicated to developing provably safe artificial superintelligence.
            </p>
            <p className="text-sm sm:text-base mb-3">
              By accessing, browsing, or using our website at galioninitiative.org (the "Website"), subscribing to our newsletter, applying to join our team, making donations, downloading research materials, or otherwise engaging with our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-sm sm:text-base">
              If you do not agree to these Terms, you must not access or use our Website or services. These Terms apply to all visitors, users, and others who access or use our services.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">2. About The Galion Initiative</h2>
            <p className="text-sm sm:text-base mb-3">
              The Galion Initiative is an independent nonprofit research organization founded in 2025. Our mission is to develop provably safe artificial superintelligence through dual-core architecture, hardware-level safety constraints, and transparent oversight. We operate as a research institution focused on AI safety, alignment, and governance.
            </p>
            <p className="text-sm sm:text-base">
              Our research, publications, and technical work are conducted in the public interest. We are committed to radical transparency in our research activities, governance, and operations.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">3. Use of Website and Services</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3 mt-4">3.1 Permitted Use</h3>
            <p className="text-sm sm:text-base mb-3">You may use our Website and services for lawful purposes only, including:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Accessing and reading our research publications and technical papers.</li>
              <li>Subscribing to our newsletter for research updates.</li>
              <li>Applying to join our research team.</li>
              <li>Making donations to support our mission.</li>
              <li>Sharing our research and content in accordance with applicable licenses.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">3.2 Prohibited Activities</h3>
            <p className="text-sm sm:text-base mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Use the Website for any unlawful purpose or in violation of any applicable laws or regulations.</li>
              <li>Interfere with, disrupt, or damage the Website, servers, or networks connected to the Website.</li>
              <li>Attempt to gain unauthorized access to any portion of the Website, accounts, computer systems, or networks.</li>
              <li>Use automated systems (bots, scrapers) to access the Website without our express written permission.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
              <li>Transmit any viruses, malware, or other harmful code.</li>
              <li>Collect or harvest any information from the Website for commercial purposes without our consent.</li>
              <li>Use the Website to harass, abuse, or harm others.</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">4. Intellectual Property Rights</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3 mt-4">4.1 Research Publications and Code</h3>
            <p className="text-sm sm:text-base mb-3">
              The Galion Initiative is committed to open research. Unless otherwise explicitly stated, our research papers, technical publications, and software code are released under permissive open-source licenses, such as:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Research Papers:</strong> Typically released under Creative Commons Attribution (CC-BY) or similar licenses, allowing free use, distribution, and modification with attribution.</li>
              <li><strong>Software Code:</strong> Typically released under MIT License, Apache 2.0, or similar permissive licenses.</li>
            </ul>
            <p className="text-sm sm:text-base mb-4">
              Specific licensing terms will be clearly stated in each publication or repository. You are responsible for complying with the applicable license terms.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">4.2 Proprietary Materials</h3>
            <p className="text-sm sm:text-base mb-3">
              The following materials remain proprietary to The Galion Initiative and are protected by copyright, trademark, and other intellectual property laws:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>The Galion Initiative name, logo, and brand identity.</li>
              <li>Website design, layout, and user interface elements.</li>
              <li>Proprietary research methodologies and internal processes (unless explicitly published).</li>
              <li>Any content explicitly marked as proprietary or confidential.</li>
            </ul>
            <p className="text-sm sm:text-base">
              You may not use our name, logo, or brand identity without our express written permission, except for attribution purposes when referencing our research in accordance with applicable licenses.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">5. Research Publications and Disclaimers</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3 mt-4">5.1 Research Nature</h3>
            <p className="text-sm sm:text-base mb-3">
              Our research publications, technical papers, and findings are provided for informational and research purposes only. They represent our current understanding and ongoing work in AI safety and alignment research. Research in this field is rapidly evolving, and our findings may be updated, revised, or superseded by subsequent research.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">5.2 No Professional Advice</h3>
            <p className="text-sm sm:text-base mb-3">
              Our research and publications do not constitute:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Professional, legal, financial, or technical advice.</li>
              <li>Endorsements of any products, services, or technologies.</li>
              <li>Guarantees or warranties regarding the safety, effectiveness, or outcomes of any AI systems or approaches.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">5.3 Research Limitations</h3>
            <p className="text-sm sm:text-base mb-3">
              AI safety research is inherently uncertain and involves significant risks. Our research:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>May contain errors, inaccuracies, or incomplete information.</li>
              <li>May be based on assumptions, models, or theories that prove incorrect.</li>
              <li>Cannot guarantee the safety or alignment of any AI system.</li>
              <li>Should not be the sole basis for critical decisions regarding AI development or deployment.</li>
            </ul>
            <p className="text-sm sm:text-base">
              You use our research at your own risk and should consult qualified professionals for advice on specific applications.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">6. Donations</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3 mt-4">6.1 Donation Terms</h3>
            <p className="text-sm sm:text-base mb-3">
              When you make a donation to The Galion Initiative:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Donations are voluntary and non-refundable, except as required by law.</li>
              <li>We will provide acknowledgment and tax documentation as applicable and when requested.</li>
              <li>Donations support our research mission but do not grant you any rights, ownership, or control over our research, operations, or decisions.</li>
              <li>Cryptocurrency donations are processed through third-party services (e.g., Coinbase Commerce). We are not responsible for the security or operation of these third-party services.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">6.2 Tax Deductibility</h3>
            <p className="text-sm sm:text-base">
              The tax deductibility of donations depends on your jurisdiction and our tax-exempt status in that jurisdiction. Consult a tax professional for advice on the deductibility of your donation. We will provide appropriate documentation upon request.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">7. Team Applications</h2>
            <p className="text-sm sm:text-base mb-3">
              When you apply to join our team:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Application submission does not guarantee consideration, interview, or employment.</li>
              <li>We reserve the right to reject any application for any reason, without explanation.</li>
              <li>All application materials become our property and will not be returned.</li>
              <li>We may retain application materials for future opportunities unless you request deletion.</li>
              <li>By submitting an application, you represent that all information provided is accurate and that you have the right to provide such information.</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">8. Newsletter Subscriptions</h2>
            <p className="text-sm sm:text-base mb-3">
              When you subscribe to our newsletter:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>You consent to receive periodic emails about our research, mission progress, and events.</li>
              <li>You can unsubscribe at any time using the link in any newsletter email or by contacting us.</li>
              <li>We respect your privacy and will not share your email address with third parties for marketing purposes.</li>
              <li>Newsletter frequency is typically once per month, but may vary based on research developments.</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">9. Third-Party Services and Links</h2>
            <p className="text-sm sm:text-base mb-3">
              Our Website may contain links to third-party websites, services, or resources, including:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Payment processors (Ko-fi, Coinbase Commerce) for donations.</li>
              <li>Research paper repositories and academic databases.</li>
              <li>Social media platforms and external resources.</li>
            </ul>
            <p className="text-sm sm:text-base">
              We are not responsible for the content, privacy practices, or terms of service of third-party websites or services. Your use of third-party services is subject to their respective terms and conditions. We encourage you to review the terms and privacy policies of any third-party services you access.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">10. Cookies and Tracking Technologies</h2>
            <p className="text-sm sm:text-base mb-3">
              By using our Website, you consent to our use of cookies and similar tracking technologies in accordance with our Privacy Policy and your cookie preferences.
            </p>
            <p className="text-sm sm:text-base mb-3">
              <strong>Cookie Consent:</strong> When you first visit our Website, you will be presented with a cookie consent banner. By clicking "Accept All," "Necessary Only," or customizing your preferences, you agree to our use of cookies as described in our Privacy Policy.
            </p>
            <p className="text-sm sm:text-base mb-3">
              <strong>Types of Cookies:</strong> We use the following types of cookies:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Necessary Cookies:</strong> Required for the Website to function properly. These cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Used to understand website usage through privacy-preserving analytics (Cloudflare Web Analytics).</li>
              <li><strong>Functional Cookies:</strong> Enable enhanced functionality and remember your preferences, including your cookie consent choices.</li>
            </ul>
            <p className="text-sm sm:text-base mb-3">
              <strong>Managing Cookies:</strong> You can manage your cookie preferences at any time through the cookie consent banner or by adjusting your browser settings. However, disabling necessary cookies may impact your ability to use certain features of our Website.
            </p>
            <p className="text-sm sm:text-base">
              For detailed information about our use of cookies, please refer to our <Link href="/privacy" className="text-primary-400 hover:text-primary-300 underline">Privacy Policy</Link>.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">11. Disclaimers and Limitations of Liability</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3 mt-4">11.1 Website Availability</h3>
            <p className="text-sm sm:text-base mb-4">
              We strive to maintain the availability of our Website, but we do not guarantee that the Website will be available at all times, uninterrupted, or error-free. We may suspend, modify, or discontinue any aspect of the Website at any time without notice.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">11.2 Content Accuracy</h3>
            <p className="text-sm sm:text-base mb-4">
              While we strive for accuracy, we make no warranties or representations regarding the accuracy, completeness, reliability, or timeliness of any information on the Website. Information may contain errors, inaccuracies, or be outdated.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">11.3 Limitation of Liability</h3>
            <p className="text-sm sm:text-base mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE GALION INITIATIVE AND ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Any indirect, incidental, special, consequential, or punitive damages.</li>
              <li>Loss of profits, revenue, data, or use.</li>
              <li>Damages resulting from your use or inability to use the Website or services.</li>
              <li>Damages resulting from reliance on our research, publications, or information.</li>
              <li>Damages resulting from unauthorized access to or alteration of your data.</li>
            </ul>
            <p className="text-sm sm:text-base">
              Our total liability for any claims arising from or related to these Terms or your use of the Website shall not exceed the amount you paid to us in the 12 months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">12. Indemnification</h2>
            <p className="text-sm sm:text-base">
              You agree to indemnify, defend, and hold harmless The Galion Initiative and its directors, officers, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from or related to: (a) your use of the Website or services; (b) your violation of these Terms; (c) your violation of any rights of another party; or (d) your violation of any applicable laws or regulations.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">13. Termination</h2>
            <p className="text-sm sm:text-base mb-3">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Terminate or suspend your access to the Website or services at any time, with or without cause, and with or without notice.</li>
              <li>Remove or modify any content or features of the Website at any time.</li>
              <li>Discontinue the Website or any services at any time.</li>
            </ul>
            <p className="text-sm sm:text-base">
              Upon termination, your right to use the Website will immediately cease. Provisions of these Terms that by their nature should survive termination shall survive, including intellectual property rights, disclaimers, limitations of liability, and indemnification.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">14. Changes to Terms</h2>
            <p className="text-sm sm:text-base">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page with a new "Last Updated" date. Your continued use of the Website after such modifications constitutes your acceptance of the updated Terms. If you do not agree to the modified Terms, you must stop using the Website and services.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">15. Governing Law and Dispute Resolution</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3 mt-4">15.1 Governing Law</h3>
            <p className="text-sm sm:text-base mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which The Galion Initiative is incorporated, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">15.2 Dispute Resolution</h3>
            <p className="text-sm sm:text-base mb-3">
              In the event of any dispute, controversy, or claim arising out of or relating to these Terms or your use of the Website, we encourage you to first contact us to seek an amicable resolution. If a dispute cannot be resolved through good faith negotiation, the parties agree to resolve the dispute through:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Mediation, if both parties agree.</li>
              <li>Binding arbitration in accordance with applicable arbitration rules, if required by law or if both parties agree.</li>
              <li>Litigation in the courts of the jurisdiction in which The Galion Initiative is incorporated, as a last resort.</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">16. Severability</h2>
            <p className="text-sm sm:text-base">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">17. Entire Agreement</h2>
            <p className="text-sm sm:text-base">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and The Galion Initiative regarding your use of the Website and services, and supersede all prior or contemporaneous communications, proposals, and agreements, whether oral or written.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">18. Waiver</h2>
            <p className="text-sm sm:text-base">
              Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by an authorized representative of The Galion Initiative.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">19. Contact Information</h2>
            <p className="text-sm sm:text-base mb-3">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 sm:p-6 mt-4">
              <p className="text-sm sm:text-base mb-2">
                <strong className="text-white">The Galion Initiative</strong>
              </p>
              <p className="text-sm sm:text-base mb-2">
                Email:{' '}
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const subject = encodeURIComponent('Terms of Service Inquiry - The Galion Initiative');
                    const body = encodeURIComponent(`Dear Galion Initiative Team,

I have a question regarding your Terms of Service.

[Please provide details about your question here]

Best regards,
[Your Name]
[Your Email]`);
                    window.location.href = `mailto:contact@galioninitiative.org?subject=${subject}&body=${body}`;
                  }}
                  className="text-primary-400 hover:underline break-all cursor-pointer"
                >
                  contact@galioninitiative.org
                </a>
              </p>
              <p className="text-sm sm:text-base">
                Website: <a href="https://galioninitiative.org" className="text-primary-400 hover:underline">galioninitiative.org</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
