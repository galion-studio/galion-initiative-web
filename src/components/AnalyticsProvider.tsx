'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { trackEvent } from '@/lib/analytics';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route change
  useEffect(() => {
    const url = `${pathname}?${searchParams.toString()}`;
    trackEvent('page_view', { path: pathname, search: searchParams.toString(), url });
  }, [pathname, searchParams]);

  // Global click tracker for "everything"
  useEffect(() => {
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
  }, [pathname]);

  return null;
}

export default function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}

