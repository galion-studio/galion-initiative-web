'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CryptoAddress from '@/components/shared/CryptoAddress';
import { Coffee, ArrowRight, Heart, CreditCard, Wallet, ExternalLink } from 'lucide-react';
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
  const [cryptoMethod, setCryptoMethod] = useState<'direct' | 'coinbase'>('coinbase');
  const COINBASE_CHECKOUT_URL = 'https://commerce.coinbase.com/checkout/985d6a3c-5cb3-4c77-9855-ad358dfd652f';

  return (
    <section id="donate" className="py-24 sm:py-28 md:py-32 bg-neutral-950 text-neutral-50 relative overflow-hidden">
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
                  onClick={() => trackEvent('click_donation_tier', { tier: tier.name, amount: tier.amount })}
                >
                  <div className={`relative group h-full rounded-xl p-[1px] transition-all duration-300 cursor-pointer ${tier.highlight ? 'bg-gradient-to-br from-primary-500/40 to-primary-900/10' : 'bg-neutral-800/50 hover:bg-neutral-700/50'}`}>
                    <Card className={`h-full bg-neutral-950/80 backdrop-blur-sm border-none shadow-lg ${tier.highlight ? '' : ''} transition-colors`}>
                      <CardHeader className="pb-3 pt-6 px-6 text-center sm:text-left">
                        <div className="flex justify-center sm:justify-between items-start">
                          <div>
                            <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                              <span className="text-2xl sm:text-3xl filter drop-shadow-md">{tier.icon}</span> 
                              {tier.name}
                            </CardTitle>
                            <div className="text-primary-400 font-mono text-sm sm:text-base mt-2 tracking-wide font-semibold text-center sm:text-left">{tier.amount}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        <ul className="space-y-2.5">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm sm:text-base text-neutral-400 flex items-start justify-center sm:justify-start gap-2.5 group-hover:text-neutral-300 transition-colors">
                              <span className="text-primary-500 mt-0.5 text-base">•</span>
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
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 sm:mt-8 flex justify-center"
            >
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
            </motion.div>
          </div>

          {/* Right Column: Direct Support */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col h-full"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-white">
              <span className="w-1 h-5 sm:h-6 bg-primary-500 rounded-full"></span>
              Individual Contributions
            </h3>
            
            <div className="bg-neutral-900/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-800 shadow-xl flex-1 flex flex-col">
                {/* Ko-fi Section - Card/PayPal Payments - Updated UI */}
                <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-neutral-800">
                    <div className="mb-4 text-center">
                        <span className="inline-block text-xs font-semibold text-primary-400 uppercase tracking-wider mb-3 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20">
                            Most Popular
                        </span>
                        <p className="text-sm text-neutral-300 mb-2 font-medium">Quick & Secure Donations</p>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <CreditCard className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs text-neutral-500">Visa, Mastercard, Amex, PayPal accepted</span>
                        </div>
                    </div>
                    <Button className="w-full bg-[#FF5E5B] hover:bg-[#FF413D] text-white flex items-center justify-center gap-2 py-6 sm:py-7 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-[#FF5E5B]/20 transition-all group mb-4 touch-manipulation min-h-[56px] font-semibold" onClick={() => {
                        trackEvent('click_kofi_support', { location: 'donate_section' });
                        window.open('https://ko-fi.com/galioninitiative', '_blank');
                    }}>
                            <Heart className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                            Donate with Card or PayPal
                    </Button>
                    
                    <p className="text-xs text-neutral-500 text-center mb-4 leading-relaxed">
                        Choose any amount • One-time or recurring donations • Secure checkout via Stripe
                    </p>

                    <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                        {['$5', '$10', '$25', '$100'].map((amt) => (
                            <div key={amt} className="px-4 sm:px-5 py-2 rounded-full bg-neutral-900 text-neutral-400 text-xs sm:text-sm font-mono border border-neutral-800 hover:border-neutral-700 hover:text-white transition-colors cursor-default">
                                {amt}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Crypto Section */}
                <div>
                    <h4 className="text-xs sm:text-sm font-bold mb-3 sm:mb-4 text-center uppercase tracking-wider text-neutral-500">Cryptocurrency</h4>
                    
                    {/* Method Selector */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="mb-4 sm:mb-6"
                    >
                        <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                            <button
                                onClick={() => {
                                    setCryptoMethod('coinbase');
                                    trackEvent('crypto_method_change', { method: 'coinbase' });
                                }}
                                className={`px-3 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation ${
                                    cryptoMethod === 'coinbase'
                                        ? 'bg-neutral-800 text-white shadow-sm'
                                        : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-900/50'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Coinbase</span>
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setCryptoMethod('direct');
                                    trackEvent('crypto_method_change', { method: 'direct' });
                                }}
                                className={`px-3 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation ${
                                    cryptoMethod === 'direct'
                                        ? 'bg-neutral-800 text-white shadow-sm'
                                        : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-900/50'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <Wallet className="w-3.5 h-3.5" />
                                    <span>Direct</span>
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    {/* Coinbase Commerce Method */}
                    {cryptoMethod === 'coinbase' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            <div className="flex flex-col items-center py-6 sm:py-8">
                                {/* Coinbase Logo/Branding */}
                                <div className="mb-6 text-center">
                                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                                        <CreditCard className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm font-semibold text-blue-400">Coinbase Commerce</span>
                                    </div>
                                    <p className="text-sm text-neutral-400 mb-2 max-w-xs mx-auto leading-relaxed">
                                        Donate with Coinbase, MetaMask, or any crypto wallet
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        Secure checkout • Multiple cryptocurrencies supported
                                    </p>
                                </div>

                                {/* CTA Button */}
                      <Button
                        onClick={() => {
                          trackEvent('click_coinbase_checkout', { location: 'donate_section', method: 'crypto' });
                          trackEvent('click_external_link', { url: COINBASE_CHECKOUT_URL, type: 'donation', platform: 'coinbase' });
                          window.open(COINBASE_CHECKOUT_URL, '_blank');
                        }}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 py-6 sm:py-7 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all group mb-4 touch-manipulation min-h-[56px] font-semibold"
                                >
                                    <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Donate with Coinbase
                                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </Button>

                                {/* Supported Wallets Info */}
                                <div className="mt-4 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 w-full max-w-sm">
                                    <p className="text-xs text-neutral-500 text-center leading-relaxed">
                                        <span className="text-neutral-400 font-medium">Supported:</span> Coinbase Wallet, MetaMask, Smart Wallets, and more
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Direct Crypto Method */}
                    {cryptoMethod === 'direct' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            <Tabs defaultValue="BTC" className="w-full" onValueChange={(val) => trackEvent('crypto_tab_change', { currency: val })}>
                                <TabsList className="grid w-full grid-cols-3 bg-neutral-950 p-1 rounded-lg mb-4 sm:mb-6 border border-neutral-800 h-10 sm:h-9">
                                    <TabsTrigger value="BTC" className="text-xs rounded-md data-[state=active]:bg-neutral-800 text-neutral-400 data-[state=active]:text-white transition-all h-8 sm:h-7 touch-manipulation">BTC</TabsTrigger>
                                    <TabsTrigger value="ETH" className="text-xs rounded-md data-[state=active]:bg-neutral-800 text-neutral-400 data-[state=active]:text-white transition-all h-8 sm:h-7 touch-manipulation">ETH</TabsTrigger>
                                    <TabsTrigger value="USDT" className="text-xs rounded-md data-[state=active]:bg-neutral-800 text-neutral-400 data-[state=active]:text-white transition-all h-8 sm:h-7 touch-manipulation">USDT</TabsTrigger>
                                </TabsList>
                                <div className="relative min-h-[180px]">
                                    <TabsContent value="BTC" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <CryptoAddress currency="BTC" comingSoon={true} />
                                    </TabsContent>
                                    <TabsContent value="ETH" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <CryptoAddress currency="ETH" comingSoon={true} />
                                    </TabsContent>
                                    <TabsContent value="USDT" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <CryptoAddress currency="USDT" comingSoon={true} />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </motion.div>
                    )}
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
