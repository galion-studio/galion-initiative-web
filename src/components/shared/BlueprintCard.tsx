'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface BlueprintCardProps {
  title: string;
  icon: LucideIcon;
  summary: string;
  details: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function BlueprintCard({ title, icon: Icon, summary, details, isExpanded, onToggle }: BlueprintCardProps) {
  const handleToggle = () => {
    // Tracking is handled in parent component (Blueprint.tsx)
    onToggle();
  };

  return (
    <div 
      onClick={handleToggle}
      className={`
        cursor-pointer group relative overflow-hidden rounded-xl border transition-all duration-300
        ${isExpanded 
          ? 'bg-white dark:bg-neutral-900 border-primary-500/50 shadow-md shadow-primary-500/5 ring-1 ring-primary-500/20' 
          : 'bg-white dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 hover:border-primary-500/30 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
        }
      `}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-4">
          <div className={`
            shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300
            ${isExpanded 
              ? 'bg-primary-500 text-white' 
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-primary-500/10 group-hover:text-primary-600 dark:group-hover:text-primary-400'
            }
          `}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <h3 className={`text-lg font-semibold transition-colors ${isExpanded ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-900 dark:text-white'}`}>
                {title}
              </h3>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180 text-primary-500' : ''}`} />
            </div>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-0">
              {summary}
            </p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 mt-3">
                    {details}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
