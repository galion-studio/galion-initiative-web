'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Scale, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

const pillars = [
  {
    icon: ShieldCheck,
    title: "Uncompromising Safety",
    text: "Safety isn't a feature; it's the foundation. We embed immutable safety protocols at the hardware level, ensuring that alignment is physical, not just algorithmic.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500"
  },
  {
    icon: Scale,
    title: "Dual-Core Architecture",
    text: "Stability through opposition. Our architecture pits two ASIs against each other in a perpetual balance—one focused on expansion, the other on preservation.",
    gradient: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-500"
  },
  {
    icon: Cpu,
    title: "Radical Transparency",
    text: "No black boxes. Every major decision, audit, and research breakthrough is open to public scrutiny. We believe superintelligence requires super-oversight.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500"
  }
];

export default function Mission() {
  return (
    <section id="mission" className="py-24 sm:py-28 md:py-32 bg-neutral-950 text-white relative overflow-hidden">
      {/* Dark Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase text-xs mb-4 block">
              Our Purpose
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Built for <span className="text-primary-400">Humanity's</span> Future
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-neutral-400 font-light mb-6">
              The Galion Initiative is an independent nonprofit research organization dedicated to the safe development of superintelligence. We don't just research safety—we <span className="text-white font-medium">engineer</span> it.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-neutral-500 font-light max-w-2xl mx-auto">
              Founded in 2025, we bring together leading researchers, engineers, and policy experts to solve the most critical challenge of our time: ensuring that artificial superintelligence serves and protects humanity. Our approach uniquely blends rigorous technical research, transparent oversight, and institutional governance to create provably safe AI systems.
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/team" onClick={() => trackEvent('click_meet_team', { location: 'mission_section' })}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 hover:border-primary-500/50 text-neutral-200 hover:text-white px-6 py-6 rounded-full backdrop-blur-sm transition-all duration-300 group"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Meet Our Team
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className="group relative p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-neutral-950 border border-neutral-800 group-hover:border-neutral-700 shadow-lg ${pillar.iconColor} transition-colors duration-300`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white group-hover:text-primary-100 transition-colors">{pillar.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm">
                  {pillar.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
