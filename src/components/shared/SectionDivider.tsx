'use client';

import { motion } from 'framer-motion';

/**
 * SectionDivider Component
 * 
 * Creates elegant visual separation between page sections.
 * Features a gradient line with decorative dots for a modern, polished look.
 * Mobile version uses a simpler, cleaner design optimized for small screens.
 */
export default function SectionDivider() {
  return (
    <div className="relative w-full bg-neutral-950 z-20 border-0">
      {/* Mobile: Simple gradient line with center accent */}
      <div className="flex items-center justify-center py-0 relative z-20 md:hidden border-0">
        <div className="w-full max-w-sm mx-auto px-6 relative z-20 border-0">
          <div className="relative h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent z-20 border-0">
            {/* Center accent dot - larger and more visible on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/50 blur-[2px]"></div>
              <div className="absolute inset-0 w-0.5 h-0.5 rounded-full bg-primary-500/70 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop: Full decorative gradient line with center dot */}
      <div className="hidden md:flex items-center justify-center py-0 relative z-20 border-0">
        <div className="w-full max-w-4xl mx-auto px-4 relative z-20 border-0">
          {/* Main gradient line */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent z-20 border-0">
            {/* Center decorative dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/50 blur-[2px]"></div>
              <div className="absolute inset-0 w-0.5 h-0.5 rounded-full bg-primary-500/70 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

