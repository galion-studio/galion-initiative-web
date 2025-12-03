'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { isAnalyticsEnabled } from '@/lib/cookie-consent';

/**
 * Conditionally loads Cloudflare Analytics and Google Analytics based on cookie consent
 */
export default function AnalyticsScript() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      {/* Cloudflare Analytics */}
      {token && (
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token": "${token}"}`}
          strategy="afterInteractive"
        />
      )}
      
      {/* Google Analytics */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}

