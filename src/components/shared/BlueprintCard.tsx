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
    if (!isExpanded) {
      trackEvent('blueprint_card_expand', { card: title });
    }
    onToggle();
  };

  return (
    <motion.div 
      onClick={handleToggle}
      layout
      className={`
        cursor-pointer group relative overflow-hidden rounded-xl border transition-all duration-300
        ${isExpanded 
          ? 'bg-white dark:bg-neutral-900 border-primary-500/50 shadow-lg shadow-primary-500/10 ring-1 ring-primary-500/20' 
          : 'bg-white dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 hover:border-primary-500/30 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:shadow-md'
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`
            shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300
            ${isExpanded 
              ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' 
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-primary-500/10 group-hover:text-primary-600 dark:group-hover:text-primary-400'
            }
          `}>
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1.5 gap-2">
              <div className="flex-1">
                <h3 className={`text-base font-semibold transition-colors mb-1 ${isExpanded ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-900 dark:text-white'}`}>
                  {title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {summary}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-all duration-300 shrink-0 mt-0.5 ${isExpanded ? 'rotate-180 text-primary-500' : 'group-hover:text-primary-500'}`} />
            </div>

            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                  layout
                >
                  <p className="pt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-neutral-700 mt-3">
                    {details}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
