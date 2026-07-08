'use client';

import { useContext } from 'react';
import type { AnalyticsContextValue } from '@/types/analytics/events';
import { AnalyticsContext } from '@/components/providers/analytics-provider';

export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return ctx;
}
