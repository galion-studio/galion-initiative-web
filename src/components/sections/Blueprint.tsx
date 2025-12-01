'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Clock, Eye, Cpu, ShieldCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlueprintCard from '@/components/shared/BlueprintCard';
import { trackEvent } from '@/lib/analytics';

const blueprintItems = [
  {
    title: "Dual-Core Architecture",
    icon: Network,
    summary: "Two opposing ASIs in constant negotiation.",
    details: "We implement a checks-and-balances system where two distinct AI models—one optimizing for growth, the other for safety—must reach a consensus before executing any high-stakes action."
  },
  {
    title: "Hardware-Level Safety",
    icon: Cpu,
    summary: "Immutable rules burned into silicon.",
    details: "Safety constraints aren't just software prompts; they are encoded into the hardware architecture itself, making them impossible for the AI to rewrite or bypass."
  },
  {
    title: "Human-Paced Alignment",
    icon: Clock,
    summary: "Progress anchored to human timescales.",
    details: "The system's processing speed for critical decisions is artificially governed to match human comprehension, preventing 'fast takeoff' scenarios where AI evolves beyond control in seconds."
  },
  {
    title: "Transparent Oversight",
    icon: Eye,
    summary: "Public audits and live decision logs.",
    details: "A 'glass box' approach where internal reasoning traces and decision logs are publicly broadcast, ensuring no hidden agendas or deceptive behaviors can emerge unnoticed."
  }
];

export default function Blueprint() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    const item = blueprintItems[index];
    const isExpanding = expandedIndex !== index;
    trackEvent('blueprint_card_toggle', { 
      title: item.title, 
      expanded: isExpanding,
      index: index 
    });
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="blueprint" className="py-32 bg-neutral-950 text-white relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Side: Sticky Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-5/12 lg:sticky lg:top-32 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold tracking-wider uppercase mb-8">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety By Design</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-tight">
              The <span className="text-white">Blueprint</span>
            </h2>
            <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-light">
              We aren't just hoping for safe AI. We've designed a technical architecture that <span className="text-white font-medium">guarantees</span> it. Our approach treats alignment as an engineering problem with concrete, verifiable solutions.
            </p>
            
            <Button 
              size="lg" 
              className="hidden lg:inline-flex bg-white text-neutral-950 hover:bg-neutral-200 rounded-full px-8 py-6 text-base font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:scale-105"
              onClick={() => {
                trackEvent('click_read_technical_paper', { location: 'blueprint_section', device: 'desktop' });
                window.location.href = '/blueprint';
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Read Technical Paper
            </Button>
          </motion.div>

          {/* Right Side: Interactive Cards */}
          <div className="lg:w-7/12 w-full grid gap-3 md:gap-4">
            {blueprintItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BlueprintCard
                  {...item}
                  isExpanded={expandedIndex === index}
                  onToggle={() => toggleCard(index)}
                />
              </motion.div>
            ))}
            
            <div className="lg:hidden mt-10 text-center">
               <Button 
                size="lg" 
                className="bg-white text-neutral-950 hover:bg-neutral-200 rounded-full px-8 py-6 text-base font-medium shadow-lg transition-all w-full sm:w-auto"
                onClick={() => {
                  trackEvent('click_read_technical_paper', { location: 'blueprint_section', device: 'mobile' });
                  window.location.href = '/blueprint';
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Read Technical Paper
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
