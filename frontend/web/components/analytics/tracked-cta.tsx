'use client';

import * as React from 'react';
import { useAnalytics } from '@/lib/hooks/use-analytics';
import { Button, type ButtonProps } from '@/components/ui/button';
import type { AnalyticsEventName } from '@/types/domain/analytics-event';

export interface TrackedCTAProps extends ButtonProps {
  event: AnalyticsEventName;
  properties?: Record<string, unknown>;
}

export function TrackedCTA({ event, properties, onClick, ...props }: TrackedCTAProps) {
  const { track } = useAnalytics();
  return (
    <Button
      {...props}
      onClick={(e) => {
        track({ name: event, properties });
        onClick?.(e);
      }}
    />
  );
}
