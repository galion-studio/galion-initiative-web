'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import Hero from '@/components/sections/Hero';
import Mission from '@/components/sections/Mission';
import Blueprint from '@/components/sections/Blueprint';
import Donate from '@/components/sections/Donate';
import JoinTeam from '@/components/sections/JoinTeam';
import Newsletter from '@/components/sections/Newsletter';
import Footer from '@/components/sections/Footer';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    trackEvent('click_back_to_top', { location: 'home_page' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NGO",
            "name": "The Galion Initiative",
            "url": "https://galioninitiative.org",
            "logo": "https://galioninitiative.org/logo.webp",
            "description": "Building safe superintelligence for humanity.",
            "foundingDate": "2025",
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "contact@galioninitiative.org",
              "contactType": "general support"
            }
          })
        }}
      />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary-500 origin-left z-50"
        style={{ scaleX }}
      />

      <Hero />
      <Mission />
      <Blueprint />
      <Donate />
      <JoinTeam />
      <Newsletter />
      <Footer />

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0 }}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-primary-500 text-white shadow-lg z-40 hover:bg-primary-600 transition-colors ${showBackToTop ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </main>
  );
}
