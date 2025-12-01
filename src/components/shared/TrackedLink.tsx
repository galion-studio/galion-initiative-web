'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { ReactNode } from 'react';

interface TrackedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  eventName: string;
  eventProperties?: Record<string, any>;
  [key: string]: any;
}

export default function TrackedLink({ 
  href, 
  children, 
  className, 
  eventName, 
  eventProperties = {},
  ...props 
}: TrackedLinkProps) {
  const handleClick = () => {
    trackEvent(eventName, eventProperties);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

