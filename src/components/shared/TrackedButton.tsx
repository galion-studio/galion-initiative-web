'use client';

import { Button, type ButtonProps as BaseButtonProps } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

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

