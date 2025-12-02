'use client';

import { useState } from 'react';
import { Copy, Check, QrCode, Smartphone, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';

interface CryptoAddressProps {
  currency: 'BTC' | 'ETH' | 'USDT';
  address: string;
  qrUrl?: string;
}

// Currency display names and colors
const currencyInfo = {
  BTC: { name: 'Bitcoin', color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
  ETH: { name: 'Ethereum', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  USDT: { name: 'Tether', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
};

export default function CryptoAddress({ currency, address, qrUrl }: CryptoAddressProps) {
  const [copied, setCopied] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const info = currencyInfo[currency];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success(`${currency} Address Copied!`, {
        description: "Paste it into your wallet to send.",
        duration: 3000,
      });
      trackEvent('crypto_copy', { currency });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  // Format address for display (show first 8 and last 8 characters)
  const formatAddress = (addr: string) => {
    if (showFullAddress || addr.length <= 20) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  return (
    <div className="flex flex-col items-center w-full py-4">
      {/* Currency Header */}
      <div className={`mb-4 px-4 py-2 rounded-lg ${info.bgColor} ${info.borderColor} border`}>
        <div className="flex items-center gap-2">
          <Wallet className={`w-4 h-4 ${info.color}`} />
          <span className={`text-sm font-semibold ${info.color}`}>{info.name} ({currency})</span>
        </div>
      </div>

      {/* QR Code Area - Enhanced */}
      <div className="relative group mb-6">
        <div className="w-40 h-40 bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] mx-auto relative z-10 border-2 border-neutral-200">
          {qrUrl ? (
            <img src={qrUrl} alt={`${currency} QR Code`} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-400 gap-3 bg-gradient-to-br from-neutral-50 to-neutral-100">
              <QrCode className="w-12 h-12 opacity-50" />
              <span className="text-xs font-bold tracking-widest opacity-70 text-neutral-600">SCAN TO SEND</span>
            </div>
          )}
        </div>
        {/* Enhanced glow effect */}
        <div className={`absolute -inset-6 ${info.bgColor} blur-3xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />
      </div>

      {/* Address Container - Improved */}
      <div className="w-full max-w-md mx-auto">
        <label className="text-xs text-neutral-500 mb-3 block text-center font-semibold uppercase tracking-wider">
          {currency} Wallet Address
        </label>
        
        <div 
            className="group/input relative flex items-center gap-2 bg-neutral-950 rounded-xl p-2 border-2 border-neutral-800 transition-all duration-300 hover:border-primary-500/50 hover:shadow-[0_0_25px_rgba(14,165,233,0.15)] cursor-pointer overflow-hidden"
            onClick={handleCopy}
        >
            <div className="flex-1 px-4 py-3 min-w-0">
                <code 
                    className="block text-sm sm:text-base font-mono text-neutral-300 group-hover/input:text-white transition-colors text-center break-all"
                    title={address}
                >
                    {formatAddress(address)}
                </code>
            </div>
            
            <div className="h-10 w-[1px] bg-neutral-800 group-hover/input:bg-neutral-700 transition-colors" />
            
            <Button
                size="icon"
                variant="ghost"
                className={`h-10 w-10 shrink-0 rounded-lg transition-all duration-300 ${
                    copied 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                aria-label="Copy address"
            >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </Button>
        </div>
        
        {/* Helper Text */}
        <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex items-center gap-1.5 text-neutral-500">
                <Smartphone className="w-3.5 h-3.5" />
                <p className="text-xs font-medium">
                    {copied ? 'Copied! Paste into your wallet' : 'Click to copy address'}
                </p>
            </div>
            {address.length > 20 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowFullAddress(!showFullAddress);
                    }}
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors underline"
                >
                    {showFullAddress ? 'Show less' : 'Show full address'}
                </button>
            )}
        </div>

        {/* Security Note */}
        <div className="mt-4 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <p className="text-xs text-neutral-500 text-center leading-relaxed">
                ⚠️ Always verify the address before sending. Double-check the first and last few characters.
            </p>
        </div>
      </div>
    </div>
  );
}
