'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function reportClientError(error: Error, context?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureException(error);
  });
}

export function ClientErrorBoundaryReporter({ error }: { error: Error }) {
  useEffect(() => {
    reportClientError(error, { source: 'error-boundary' });
  }, [error]);
  return null;
}
