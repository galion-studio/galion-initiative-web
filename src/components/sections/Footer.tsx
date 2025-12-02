'use client';

import Link from 'next/link';
import { Twitter, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function Footer() {
  return (
    <footer className="relative bg-neutral-950 text-neutral-400 border-t border-neutral-900 text-sm overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 md:gap-8 mb-12 sm:mb-16">
          {/* Column 1: Brand & About */}
          <div className="sm:col-span-2 text-center sm:text-left pr-0 sm:pr-8">
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                <img src="/logo.webp" alt="The Galion Initiative" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                THE GALION INITIATIVE
                </h3>
            </div>
            <p className="text-neutral-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto sm:mx-0 font-light">
              An independent nonprofit research organization dedicated to ensuring artificial superintelligence is developed safely and for the benefit of all humanity.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
              <a 
                href="#" 
                className="p-2.5 sm:p-3 bg-neutral-900 rounded-full hover:bg-neutral-800 hover:text-white transition-all border border-neutral-800 hover:border-neutral-700 group touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center" 
                aria-label="Twitter"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('click_social_link', { platform: 'twitter', location: 'footer' });
                }}
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="p-2.5 sm:p-3 bg-neutral-900 rounded-full hover:bg-neutral-800 hover:text-white transition-all border border-neutral-800 hover:border-neutral-700 group touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center" 
                aria-label="GitHub"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('click_social_link', { platform: 'github', location: 'footer' });
                }}
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="#" 
                className="p-2.5 sm:p-3 bg-neutral-900 rounded-full hover:bg-neutral-800 hover:text-white transition-all border border-neutral-800 hover:border-neutral-700 group touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center" 
                aria-label="LinkedIn"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('click_social_link', { platform: 'linkedin', location: 'footer' });
                }}
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-white mb-4 sm:mb-6 tracking-wide text-xs uppercase text-neutral-500">Navigation</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link 
                  href="#mission" 
                  className="hover:text-primary-400 transition-colors flex items-center justify-center sm:justify-start gap-2 group"
                  onClick={() => trackEvent('click_footer_link', { link: 'about_us', location: 'footer' })}
                >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary-500" />
                    About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="#blueprint" 
                  className="hover:text-primary-400 transition-colors flex items-center justify-center sm:justify-start gap-2 group"
                  onClick={() => trackEvent('click_footer_link', { link: 'blueprint', location: 'footer' })}
                >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary-500" />
                    Blueprint
                </Link>
              </li>
              <li>
                <Link 
                  href="/research" 
                  className="hover:text-primary-400 transition-colors flex items-center justify-center sm:justify-start gap-2 group"
                  onClick={() => trackEvent('click_footer_link', { link: 'research', location: 'footer' })}
                >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary-500" />
                    Research
                </Link>
              </li>
               <li>
                <Link 
                  href="#join-team" 
                  className="hover:text-primary-400 transition-colors flex items-center justify-center sm:justify-start gap-2 group"
                  onClick={() => trackEvent('click_footer_link', { link: 'join_team', location: 'footer' })}
                >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary-500" />
                    Join Team
                </Link>
              </li>
              <li>
                <Link 
                  href="#donate" 
                  className="hover:text-primary-400 transition-colors flex items-center justify-center sm:justify-start gap-2 group"
                  onClick={() => trackEvent('click_footer_link', { link: 'donate', location: 'footer' })}
                >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary-500" />
                    Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-white mb-4 sm:mb-6 tracking-wide text-xs uppercase text-neutral-500">Contact</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    trackEvent('click_email', { email: 'contact', location: 'footer' });
                    const subject = encodeURIComponent('General Inquiry - The Galion Initiative');
                    const body = encodeURIComponent(`Dear Galion Initiative Team,

I am reaching out with a general inquiry about The Galion Initiative.

[Please provide details about your inquiry here]

Best regards,
[Your Name]
[Your Email]
[Your Organization (if applicable)]`);
                    window.location.href = `mailto:contact@galioninitiative.org?subject=${subject}&body=${body}`;
                  }}
                  className="flex items-start sm:items-center justify-center sm:justify-start gap-2 sm:gap-3 hover:text-white transition-colors group touch-manipulation break-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-primary-500 group-hover:text-white transition-colors flex-shrink-0 mt-0.5 sm:mt-0" /> 
                  <span className="text-xs sm:text-sm">contact@galioninitiative.org</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    trackEvent('click_email', { email: 'grants', location: 'footer' });
                    const subject = encodeURIComponent('Grants & Partnership Inquiry - The Galion Initiative');
                    const body = encodeURIComponent(`Dear Galion Initiative Grants Team,

I am interested in learning more about partnership and grant opportunities with The Galion Initiative.

Organization: [Your Organization Name]
Type of Partnership: [e.g., Strategic Partner, Founding Partner, Benefactor, Supporter]
Proposed Contribution: [Amount or type of support]
Interest Area: [e.g., Research, Governance, Safety Protocols]

Please let me know how we can proceed.

Best regards,
[Your Name]
[Your Title]
[Your Email]
[Your Phone Number]`);
                    window.location.href = `mailto:grants@galioninitiative.org?subject=${subject}&body=${body}`;
                  }}
                  className="hover:text-white transition-colors block pl-0 sm:pl-7 border-l-0 sm:border-l border-neutral-900 hover:border-primary-900 touch-manipulation break-all cursor-pointer"
                >
                  <span className="text-neutral-500 text-xs block mb-0.5">Grants & Partnerships</span>
                  <span className="text-xs sm:text-sm">grants@galioninitiative.org</span>
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    trackEvent('click_email', { email: 'press', location: 'footer' });
                    const subject = encodeURIComponent('Media Inquiry - The Galion Initiative');
                    const body = encodeURIComponent(`Dear Galion Initiative Press Team,

I am reaching out with a media inquiry.

Media Outlet: [Your Publication/Outlet Name]
Your Role: [e.g., Journalist, Editor, Producer]
Topic of Interest: [e.g., Research updates, Team interviews, Technical architecture]
Deadline: [If applicable]
Preferred Interview Format: [e.g., Email Q&A, Phone call, Video call]

Please let me know your availability and how we can proceed.

Best regards,
[Your Name]
[Your Title]
[Your Email]
[Your Phone Number]`);
                    window.location.href = `mailto:press@galioninitiative.org?subject=${subject}&body=${body}`;
                  }}
                  className="hover:text-white transition-colors block pl-0 sm:pl-7 border-l-0 sm:border-l border-neutral-900 hover:border-primary-900 touch-manipulation break-all cursor-pointer"
                >
                   <span className="text-neutral-500 text-xs block mb-0.5">Media Inquiries</span>
                  <span className="text-xs sm:text-sm">press@galioninitiative.org</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 sm:gap-4 text-xs text-neutral-600">
            <p className="text-center">&copy; {new Date().getFullYear()} The Galion Initiative. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <Link 
                  href="/privacy" 
                  className="hover:text-neutral-400 transition-colors"
                  onClick={() => trackEvent('click_footer_link', { link: 'privacy', location: 'footer' })}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="hover:text-neutral-400 transition-colors"
                  onClick={() => trackEvent('click_footer_link', { link: 'terms', location: 'footer' })}
                >
                  Terms of Service
                </Link>
                <Link 
                  href="/transparency" 
                  className="hover:text-neutral-400 transition-colors"
                  onClick={() => trackEvent('click_footer_link', { link: 'transparency', location: 'footer' })}
                >
                  Transparency Report
                </Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
