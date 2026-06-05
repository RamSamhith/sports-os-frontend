'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line no-console
    console.debug('[web-vital]', metric.name, metric.value);
  });
  return null;
}
