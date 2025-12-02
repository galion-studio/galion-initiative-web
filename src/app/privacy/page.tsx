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
            Last Updated: December 2, 2025
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="text-sm sm:text-base mb-4">
              The Galion Initiative ("we," "us," "our," or "The Galion Initiative") is an independent nonprofit research organization founded in 2025, dedicated to developing provably safe artificial superintelligence through dual-core architecture and transparent oversight. We are committed to protecting your privacy and being transparent about how we collect, use, and safeguard your information.
            </p>
            <p className="text-sm sm:text-base">
              This Privacy Policy explains our practices regarding the collection, use, disclosure, and protection of information when you visit our website at galioninitiative.org, subscribe to our newsletter, apply to join our team, make donations, or otherwise interact with our organization and research activities.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3 mt-4">2.1 Information You Provide Directly</h3>
            <p className="text-sm sm:text-base mb-3">We collect information that you voluntarily provide to us, including:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Newsletter Subscriptions:</strong> Email address, subscription preferences, and consent records when you subscribe to our newsletter.</li>
              <li><strong>Team Applications:</strong> Name, email address, professional information (resume, CV, expertise areas), and any messages you provide when applying to join our team.</li>
              <li><strong>Contact Inquiries:</strong> Name, email address, and message content when you contact us through our website forms or email addresses.</li>
              <li><strong>Donation Information:</strong> For cryptocurrency donations, we may receive wallet addresses and transaction hashes. Note that blockchain transactions are publicly visible, but we do not link them to personal identities unless you explicitly request acknowledgment for tax or recognition purposes.</li>
              <li><strong>Event Registration:</strong> Information provided when registering for events, webinars, or briefings.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">2.2 Automatically Collected Information</h3>
            <p className="text-sm sm:text-base mb-3">When you visit our website, we automatically collect certain information, including:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, and navigation paths.</li>
              <li><strong>Technical Data:</strong> IP address, browser type and version, device information, operating system, and referring URLs.</li>
              <li><strong>Analytics Data:</strong> We use Cloudflare Web Analytics (privacy-preserving) to understand website usage patterns. This service does not use cookies or track individual users.</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3 mt-4">2.3 Cookies and Tracking Technologies</h3>
            <p className="text-sm sm:text-base mb-3">
              Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. We respect your privacy and provide you with control over cookie preferences.
            </p>
            <p className="text-sm sm:text-base mb-3 font-semibold text-white">Types of Cookies We Use:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Necessary Cookies:</strong> These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. These cookies cannot be disabled as they are required for the website to operate.</li>
              <li><strong>Analytics Cookies:</strong> We use Cloudflare Web Analytics, a privacy-preserving analytics service, to understand how visitors interact with our website. This service collects aggregated, anonymized data and does not track individual users or use traditional tracking cookies. No personal information is collected or stored.</li>
              <li><strong>Functional Cookies:</strong> These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings (including your cookie consent choices).</li>
            </ul>
            <p className="text-sm sm:text-base mb-3">
              <strong>Cookie Consent:</strong> When you first visit our website, you will be presented with a cookie consent banner that allows you to:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Accept all cookies</li>
              <li>Accept only necessary cookies</li>
              <li>Customize your cookie preferences</li>
            </ul>
            <p className="text-sm sm:text-base mb-3">
              Your cookie preferences are stored locally in your browser and will be remembered for future visits. You can change your preferences at any time by clearing your browser's local storage or by contacting us.
            </p>
            <p className="text-sm sm:text-base">
              <strong>Third-Party Cookies:</strong> We do not use advertising cookies or third-party tracking for marketing purposes. We do not sell or share your data with advertisers. Any third-party services we use (such as Cloudflare Web Analytics) are privacy-preserving and do not collect personal information.
            </p>
            <p className="text-sm sm:text-base mt-3">
              <strong>Browser Controls:</strong> You can also control cookies through your browser settings. Most browsers allow you to refuse or delete cookies. However, disabling necessary cookies may impact your ability to use certain features of our website.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">3. How We Use Your Information</h2>
            <p className="text-sm sm:text-base mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Communication:</strong> To send you newsletters, research updates, event invitations, and respond to your inquiries.</li>
              <li><strong>Recruitment:</strong> To process and evaluate team applications, assess candidate qualifications, and communicate about opportunities.</li>
              <li><strong>Donation Processing:</strong> To verify, acknowledge, and process donations, and provide tax documentation when requested.</li>
              <li><strong>Research Transparency:</strong> To maintain public records of our activities, as part of our commitment to radical transparency in AI safety research.</li>
              <li><strong>Website Improvement:</strong> To analyze website usage, improve user experience, and ensure security and functionality.</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
              <li><strong>Protection of Rights:</strong> To protect the rights, property, or safety of The Galion Initiative, our team members, or others.</li>
            </ul>
            <p className="text-sm sm:text-base">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-sm sm:text-base mb-3">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Service Providers:</strong> We may share information with trusted service providers who assist us in operating our website, managing newsletters, or processing donations, subject to strict confidentiality obligations.</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation, or to respond to legal process.</li>
              <li><strong>Research Transparency:</strong> As part of our commitment to transparency, we may publish aggregated, anonymized data about our activities, but never individual personal information without explicit consent.</li>
              <li><strong>Organizational Transfers:</strong> In the event of a merger, reorganization, or transfer of assets, your information may be transferred, subject to the same privacy protections.</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">5. Data Security</h2>
            <p className="text-sm sm:text-base mb-3">
              We implement institutional-grade security measures appropriate for a research organization handling sensitive information. These measures include:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li>Encryption of data in transit using TLS/SSL protocols.</li>
              <li>Secure storage of data using industry-standard practices.</li>
              <li>Access controls limiting data access to authorized personnel only.</li>
              <li>Regular security assessments and updates.</li>
            </ul>
            <p className="text-sm sm:text-base">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security. You use our services at your own risk.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">6. Data Retention</h2>
            <p className="text-sm sm:text-base mb-3">We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Newsletter Subscriptions:</strong> Until you unsubscribe or request deletion.</li>
              <li><strong>Team Applications:</strong> For the duration of the recruitment process and up to 2 years for potential future opportunities, unless you request deletion.</li>
              <li><strong>Donation Records:</strong> As required by law for tax and accounting purposes (typically 7 years).</li>
              <li><strong>Website Analytics:</strong> Aggregated, anonymized data may be retained indefinitely for research purposes.</li>
            </ul>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">7. Your Rights and Choices</h2>
            <p className="text-sm sm:text-base mb-3">Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-3 sm:mt-4 text-sm sm:text-base mb-4">
              <li><strong>Access:</strong> Request access to the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal and operational requirements.</li>
              <li><strong>Objection:</strong> Object to processing of your information for certain purposes.</li>
              <li><strong>Portability:</strong> Request transfer of your information to another service provider.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for newsletter subscriptions or other communications at any time.</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from newsletters using the link in any email or by contacting us directly.</li>
            </ul>
            <p className="text-sm sm:text-base">
              To exercise these rights, please contact us at{' '}
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const subject = encodeURIComponent('Privacy Rights Request - The Galion Initiative');
                  const body = encodeURIComponent(`Dear Galion Initiative Team,

I would like to exercise my privacy rights regarding my personal information.

[Please specify which right you wish to exercise: access, correction, deletion, etc.]

Best regards,
[Your Name]
[Your Email]`);
                  window.location.href = `mailto:contact@galioninitiative.org?subject=${subject}&body=${body}`;
                }}
                className="text-primary-400 hover:underline break-all cursor-pointer"
              >
                contact@galioninitiative.org
              </a>. We will respond to your request within 30 days.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">8. International Data Transfers</h2>
            <p className="text-sm sm:text-base">
              The Galion Initiative operates globally, and your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our services, you consent to the transfer of your information to these countries. We take appropriate safeguards to ensure your information receives adequate protection in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">9. Children's Privacy</h2>
            <p className="text-sm sm:text-base">
              Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">10. Third-Party Links</h2>
            <p className="text-sm sm:text-base">
              Our website may contain links to third-party websites, services, or resources (such as Ko-fi, Coinbase Commerce, or research paper repositories). We are not responsible for the privacy practices or content of these third parties. We encourage you to review the privacy policies of any third-party services you access through our website.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-sm sm:text-base">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on this page with a new "Last Updated" date. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">12. Contact Us</h2>
            <p className="text-sm sm:text-base mb-3">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
