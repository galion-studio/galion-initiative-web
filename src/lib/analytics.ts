'use client';

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
  }
}

/**
 * Track an event using Cloudflare Zaraz (if available) or log to console in dev.
 */
export function trackEvent(name: string, properties?: Record<string, any>) {
  try {
    // 1. Cloudflare Zaraz Support
    if (typeof window !== 'undefined' && window.zaraz) {
      window.zaraz.track(name, properties);
    } 
    
    // 2. Development Logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${name}`, properties);
    }

  } catch (error) {
    // Fail silently so user experience isn't affected
    console.error('Analytics error:', error);
  }
}
