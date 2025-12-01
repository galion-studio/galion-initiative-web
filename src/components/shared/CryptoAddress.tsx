'use client';

import { useState } from 'react';
import { Copy, Check, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';

interface CryptoAddressProps {
  currency: 'BTC' | 'ETH' | 'USDT';
  address: string;
  qrUrl?: string;
}

export default function CryptoAddress({ currency, address, qrUrl }: CryptoAddressProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success(`${currency} Address Copied`, {
        description: "Ready to paste into your wallet.",
        duration: 2000,
      });
      trackEvent('crypto_copy', { currency });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-6)}`;

  return (
    <div className="flex flex-col items-center">
      {/* QR Code Area */}
      <div className="relative group mb-5">
        <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-inner flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          {qrUrl ? (
            <img src={qrUrl} alt={`${currency} QR Code`} className="w-full h-full" />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center text-[10px] text-neutral-400 font-medium">
              <QrCode className="w-6 h-6 mb-1 opacity-50" />
              SCAN ME
            </div>
          )}
        </div>
        <div className="absolute inset-0 rounded-xl ring-2 ring-primary-500/0 group-hover:ring-primary-500/50 transition-all duration-300 pointer-events-none" />
      </div>

      <div className="w-full max-w-[280px]">
        <div className="relative group/input">
            <div 
                className="flex items-center justify-between gap-2 bg-neutral-950 rounded-lg p-2 pl-3 border border-neutral-800 transition-all duration-200 hover:border-primary-500/30 cursor-pointer"
                onClick={handleCopy}
            >
                <code className="flex-1 text-[11px] sm:text-xs font-mono text-neutral-400 break-all text-center group-hover/input:text-neutral-300 transition-colors">
                    {truncatedAddress}
                </code>
                <div className="h-6 w-[1px] bg-neutral-800" />
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-neutral-500 hover:text-white hover:bg-transparent shrink-0"
                    aria-label="Copy address"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
            </div>
             <p className="text-[10px] text-neutral-600 text-center mt-2 opacity-0 group-hover/input:opacity-100 transition-opacity">
                Click to copy full address
             </p>
        </div>
      </div>
    </div>
  );
}
