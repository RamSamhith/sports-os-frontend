'use client';

import { useReportWebVitals } from 'next/web-vitals';
import * as Sentry from '@sentry/nextjs';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === 'undefined') return;
    // Send to Sentry as custom measurement
    Sentry.setMeasurement(metric.name, metric.value, metric.unit);
  });
  return null;
}
