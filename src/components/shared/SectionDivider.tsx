'use client';

import { motion } from 'framer-motion';

/**
 * SectionDivider Component
 * 
 * Creates elegant visual separation between page sections.
 * Features a gradient line with decorative dots for a modern, polished look.
 */
export default function SectionDivider() {
  return (
    <div className="relative w-full bg-neutral-950 overflow-hidden z-20">
      {/* Decorative gradient line */}
      <div className="flex items-center justify-center py-0 relative z-20">
        <div className="w-full max-w-4xl mx-auto px-4 relative z-20">
          {/* Main gradient line */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent z-20">
            {/* Center decorative dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500/50 blur-[2px]"></div>
              <div className="absolute inset-0 w-0.5 h-0.5 rounded-full bg-primary-500/70 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            {/* Side decorative dots */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute left-[20%] top-1/2 -translate-y-1/2 w-0.5 h-0.5 rounded-full bg-neutral-600 z-20"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute right-[20%] top-1/2 -translate-y-1/2 w-0.5 h-0.5 rounded-full bg-neutral-600 z-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

