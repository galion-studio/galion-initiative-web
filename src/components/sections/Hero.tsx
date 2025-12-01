'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function Hero() {
  const scrollToMission = () => {
    trackEvent('click_scroll_to_mission', { location: 'hero_section' });
    const element = document.getElementById('mission');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950 text-white selection:bg-primary-500/30">
      {/* Modern Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/40 via-neutral-950/80 to-neutral-950" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      
      {/* Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6 py-16 sm:py-20 md:py-20 lg:py-24 flex flex-col items-center text-center min-h-screen justify-center">
        {/* Logo - Fixed positioning to ensure visibility */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-7 sm:mb-8 md:mb-10"
        >
          <img 
            src="/logo.webp" 
            alt="The Galion Initiative" 
            className="w-20 h-20 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain drop-shadow-[0_0_25px_rgba(14,165,233,0.3)] mx-auto" 
          />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-6 sm:mb-6 md:mb-8"
        >
          <span className="inline-flex items-center rounded-full border border-primary-500/30 bg-primary-500/10 px-3 sm:px-3 py-1.5 sm:py-1.5 text-xs sm:text-xs md:text-sm font-medium text-primary-300 backdrop-blur-sm">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-white animate-[blink_1.5s_ease-in-out_infinite]"></span>
            <span className="whitespace-nowrap">Nonprofit Research Organization</span>
          </span>
        </motion.div>

        {/* Main Heading - Reduced size */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-7 md:mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-neutral-400 px-3 sm:px-4"
        >
          Building Safe Superintelligence for Humanity
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-2xl text-base sm:text-base md:text-lg lg:text-xl text-neutral-400 mb-7 sm:mb-8 md:mb-10 leading-relaxed font-light px-3 sm:px-4"
        >
          An independent research initiative developing provably safe artificial intelligence through transparent architecture and institutional oversight.
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 max-w-md sm:max-w-none"
        >
          <Button 
            size="lg" 
            className="bg-primary-600 hover:bg-primary-500 text-white text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-5 sm:py-6 md:py-7 rounded-full shadow-[0_0_40px_-10px_rgba(12,135,232,0.4)] hover:shadow-[0_0_60px_-10px_rgba(12,135,232,0.6)] transition-all duration-300 border border-primary-400/20 w-full sm:w-auto touch-manipulation"
            onClick={() => {
              trackEvent('click_read_blueprint', { location: 'hero_section', button: 'primary_cta' });
              window.location.href = '/blueprint';
            }}
          >
            Read the Blueprint →
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-600 text-neutral-200 hover:text-white text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-5 sm:py-6 md:py-7 rounded-full backdrop-blur-sm transition-all duration-300 w-full sm:w-auto touch-manipulation"
            onClick={scrollToMission}
          >
            Support the Mission
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-neutral-500 hover:text-white transition-colors p-2 sm:p-4 touch-manipulation"
          onClick={scrollToMission}
        >
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest opacity-50">Scroll</span>
            <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
