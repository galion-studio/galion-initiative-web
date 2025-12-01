'use client';

import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { ReactNode } from 'react';
import { ButtonProps } from '@/components/ui/button';

interface TrackedButtonProps extends ButtonProps {
  eventName: string;
  eventProperties?: Record<string, any>;
  children: ReactNode;
}

export default function TrackedButton({ 
  eventName, 
  eventProperties = {},
  onClick,
  children,
  ...props 
}: TrackedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trackEvent(eventName, eventProperties);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

