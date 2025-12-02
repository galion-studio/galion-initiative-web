'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { isAnalyticsEnabled } from '@/lib/cookie-consent';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  // Check if analytics is enabled
  useEffect(() => {
    const checkConsent = () => {
      setAnalyticsEnabled(isAnalyticsEnabled());
    };

    checkConsent();

    // Listen for consent changes
    const handleConsentChange = () => {
      checkConsent();
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'galion_cookie_preferences' || e.key === 'galion_cookie_consent') {
        checkConsent();
      }
    });

    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);

  // Track page views on route change (only if analytics enabled)
  useEffect(() => {
    if (!analyticsEnabled) return;
    
    const url = `${pathname}?${searchParams.toString()}`;
    trackEvent('page_view', { path: pathname, search: searchParams.toString(), url });
    
    // Track time on page
    const startTime = Date.now();
    return () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000); // in seconds
      if (timeOnPage > 0) {
        trackEvent('page_time', { path: pathname, duration: timeOnPage });
      }
    };
  }, [pathname, searchParams, analyticsEnabled]);

  // Track scroll depth
  useEffect(() => {
    if (!analyticsEnabled) return;

    let maxScroll = 0;
    const milestones = [25, 50, 75, 90, 100];
    const trackedMilestones = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestone achievements
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
            trackedMilestones.add(milestone);
            trackEvent('scroll_depth', { 
              path: pathname, 
              depth: milestone,
              max_depth: maxScroll 
            });
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, analyticsEnabled]);

  // Global click tracker for "everything" (only if analytics enabled)
  useEffect(() => {
    if (!analyticsEnabled) return;

    const handleClick = (e: MouseEvent) => {
      // We want to track clicks on interactive elements
      const target = e.target as HTMLElement;
      
      // Find the closest interactive element
      const element = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');
      
      if (!element) return;

      const elementType = element.tagName.toLowerCase();
      let eventName = `click_${elementType}`;
      const properties: Record<string, any> = {
        tag: elementType,
        text: element.textContent?.slice(0, 50).trim() || '',
        id: element.id || undefined,
        classes: element.className || undefined,
        path: pathname,
      };

      if (element instanceof HTMLAnchorElement) {
        properties.href = element.href;
        eventName = 'click_link';
        
        // Distinguish external vs internal
        if (element.hostname !== window.location.hostname) {
            properties.type = 'external';
        } else {
            properties.type = 'internal';
        }
      } else if (element instanceof HTMLButtonElement) {
          properties.type = element.type;
      }

      // If the element has a specific tracking ID or data attribute, prioritize that
      const trackingId = element.getAttribute('data-track-id');
      if (trackingId) {
          properties.track_id = trackingId;
      }

      trackEvent(eventName, properties);
    };

    window.addEventListener('click', handleClick, { capture: true });
    
    return () => {
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, [pathname, analyticsEnabled]);

  return null;
}

export default function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}

