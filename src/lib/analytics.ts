'use client';

import { isAnalyticsEnabled } from './cookie-consent';

// Define the shape of a tracking event
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

declare global {
  interface Window {
    zaraz?: {
      track: (eventName: string, properties?: Record<string, any>) => void;
    };
    cloudflare?: {
      analytics?: {
        track: (eventName: string, properties?: Record<string, any>) => void;
      };
    };
  }
}

/**
 * Track an event using Cloudflare Zaraz (if available) or log to console in dev.
 * Respects cookie consent preferences - only tracks if analytics cookies are enabled.
 */
export function trackEvent(name: string, properties?: Record<string, any>) {
  try {
    // Check if analytics cookies are enabled
    if (!isAnalyticsEnabled()) {
      // Still log in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${name} (blocked - analytics disabled)`, properties);
      }
      return;
    }

    // 1. Cloudflare Zaraz Support
    if (typeof window !== 'undefined' && window.zaraz) {
      window.zaraz.track(name, properties);
    }
    
    // 2. Cloudflare Web Analytics (if available)
    if (typeof window !== 'undefined' && window.cloudflare?.analytics) {
      window.cloudflare.analytics.track(name, properties);
    }
    
    // 3. Development Logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${name}`, properties);
    }

  } catch (error) {
    // Fail silently so user experience isn't affected
    console.error('Analytics error:', error);
  }
}
