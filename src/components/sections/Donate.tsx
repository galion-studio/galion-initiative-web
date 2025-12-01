'use client';

import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CryptoAddress from '@/components/shared/CryptoAddress';
import { Coffee, ArrowRight, Heart } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const tiers = [
  {
    name: "Strategic Partner",
    amount: "$1M+",
    benefits: ["Dedicated liaison", "Research fellowship", "Strategic input"],
    icon: "💎",
    highlight: true
  },
  {
    name: "Founding Partner",
    amount: "$100k+",
    benefits: ["Advisory board", "Summit invite", "Private briefings"],
    icon: "🥇",
    highlight: false
  },
  {
    name: "Benefactor",
    amount: "$10k+",
    benefits: ["Research updates", "Team access", "Recognition"],
    icon: "🥈",
    highlight: false
  },
  {
    name: "Supporter",
    amount: "$1k+",
    benefits: ["Quarterly newsletter", "Community access"],
    icon: "🥉",
    highlight: false
  }
];

export default function Donate() {
  return (
    <section id="donate" className="py-24 bg-neutral-950 text-neutral-50 border-t border-neutral-900 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-400 font-bold tracking-widest uppercase text-xs mb-4 block">
              Philanthropy
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Fund the Mission
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-neutral-400 max-w-2xl mx-auto font-light">
              Help us build safe superintelligence before unsafe ASI emerges.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column: Tiers */}
          <div className="lg:col-span-7">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-white">
              <span className="w-1 h-5 sm:h-6 bg-primary-500 rounded-full"></span>
              Institutional Giving
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {tiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`relative group h-full rounded-xl p-[1px] transition-all duration-300 ${tier.highlight ? 'bg-gradient-to-br from-primary-500/40 to-primary-900/10' : 'bg-neutral-800/50 hover:bg-neutral-700/50'}`}>
                    <Card className={`h-full bg-neutral-950/80 backdrop-blur-sm border-none shadow-lg ${tier.highlight ? '' : ''} transition-colors`}>
                      <CardHeader className="pb-2 pt-5 px-5 text-center sm:text-left">
                        <div className="flex justify-center sm:justify-between items-start">
                          <div>
                            <CardTitle className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                              <span className="text-xl filter drop-shadow-md">{tier.icon}</span> 
                              {tier.name}
                            </CardTitle>
                            <div className="text-primary-400 font-mono text-xs mt-1 tracking-wide font-semibold text-center sm:text-left">{tier.amount}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <ul className="space-y-2">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="text-xs text-neutral-400 flex items-start justify-center sm:justify-start gap-2 group-hover:text-neutral-300 transition-colors">
                              <span className="text-primary-500 mt-0.5">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 sm:mt-8 flex justify-center">
                 <Button className="bg-white text-neutral-950 hover:bg-neutral-200 font-medium px-5 sm:px-6 py-4 sm:py-5 text-sm rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all w-full sm:w-auto touch-manipulation min-h-[44px]" onClick={() => {
                    trackEvent('click_schedule_briefing', { location: 'donate_section' });
                    const subject = encodeURIComponent('Request for Strategic Briefing - The Galion Initiative');
                    const body = encodeURIComponent(`Dear Galion Initiative Team,

I am interested in scheduling a strategic briefing to learn more about your mission and how I can support the development of safe superintelligence.

Please let me know your availability for a briefing call.

Best regards,
[Your Name]
[Your Organization]
[Your Email]
[Your Phone Number]`);
                    window.location.href = `mailto:grants@galioninitiative.org?subject=${subject}&body=${body}`;
                 }}>
                    Schedule a Briefing <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
          </div>

          {/* Right Column: Direct Support */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-white">
              <span className="w-1 h-5 sm:h-6 bg-primary-500 rounded-full"></span>
              Individual Contributions
            </h3>
            
            <div className="bg-neutral-900/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-800 shadow-xl flex-1 flex flex-col">
                {/* Ko-fi Section */}
                <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-neutral-800">
                    <Button className="w-full bg-[#FF5E5B] hover:bg-[#FF413D] text-white flex items-center justify-center gap-2 py-5 sm:py-6 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-[#FF5E5B]/20 transition-all group mb-3 sm:mb-4 touch-manipulation min-h-[48px]" onClick={() => {
                        trackEvent('click_kofi_support', { location: 'donate_section' });
                        window.open('https://ko-fi.com', '_blank');
                    }}>
                            <Heart className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                            Support on Ko-fi
                    </Button>
                    <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                        {['$5', '$10', '$25', '$100'].map((amt) => (
                            <div key={amt} className="px-3 sm:px-4 py-1.5 rounded-full bg-neutral-900 text-neutral-400 text-xs font-mono border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors cursor-default">
                                {amt}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Crypto Section */}
                <div>
                    <h4 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-center uppercase tracking-wider text-neutral-500">Cryptocurrency</h4>
                    <Tabs defaultValue="BTC" className="w-full" onValueChange={(val) => trackEvent('crypto_tab_change', { currency: val })}>
                        <TabsList className="grid w-full grid-cols-3 bg-neutral-950 p-1 rounded-lg mb-4 sm:mb-6 border border-neutral-800 h-10 sm:h-9">
                            <TabsTrigger value="BTC" className="text-xs rounded-md data-[state=active]:bg-neutral-800 text-neutral-400 data-[state=active]:text-white transition-all h-8 sm:h-7 touch-manipulation">BTC</TabsTrigger>
                            <TabsTrigger value="ETH" className="text-xs rounded-md data-[state=active]:bg-neutral-800 text-neutral-400 data-[state=active]:text-white transition-all h-8 sm:h-7 touch-manipulation">ETH</TabsTrigger>
                            <TabsTrigger value="USDT" className="text-xs rounded-md data-[state=active]:bg-neutral-800 text-neutral-400 data-[state=active]:text-white transition-all h-8 sm:h-7 touch-manipulation">USDT</TabsTrigger>
                        </TabsList>
                        <div className="relative min-h-[180px]">
                            <TabsContent value="BTC" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <CryptoAddress currency="BTC" address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" />
                            </TabsContent>
                            <TabsContent value="ETH" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <CryptoAddress currency="ETH" address="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
                            </TabsContent>
                            <TabsContent value="USDT" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <CryptoAddress currency="USDT" address="TYASr6cqzx4kWyBz2m8s2um4VdJgFmWJkB" />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
