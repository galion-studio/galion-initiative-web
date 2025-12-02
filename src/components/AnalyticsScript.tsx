'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { isAnalyticsEnabled } from '@/lib/cookie-consent';

/**
 * Conditionally loads Cloudflare Analytics based on cookie consent
 */
export default function AnalyticsScript() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;

  useEffect(() => {
    // Check cookie consent on mount and when it changes
    const checkConsent = () => {
      setShouldLoad(isAnalyticsEnabled());
    };

    // Initial check
    checkConsent();

    // Listen for storage changes (when user updates cookie preferences)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'galion_cookie_preferences' || e.key === 'galion_cookie_consent') {
        checkConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event from cookie consent component
    const handleConsentChange = () => {
      checkConsent();
    };
    
    window.addEventListener('cookieConsentChanged', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);

  if (!token || !shouldLoad) {
    return null;
  }

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${token}"}`}
      strategy="afterInteractive"
    />
  );
}

