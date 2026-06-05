'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAnalytics } from '@/lib/hooks/use-analytics';
import type { AnalyticsEventName } from '@/types/domain/analytics-event';

export interface TrackedLinkProps extends React.ComponentProps<typeof Link> {
  event: AnalyticsEventName;
  properties?: Record<string, unknown>;
}

export function TrackedLink({ event, properties, onClick, ...props }: TrackedLinkProps) {
  const { track } = useAnalytics();
  return (
    <Link
      {...props}
      onClick={(e) => {
        track({ name: event, properties });
        onClick?.(e);
      }}
    />
  );
}
