'use client';

import { useEffect } from 'react';

export function reportClientError(error: Error, context?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  // Placeholder hook for the real reporter. Will be wired to Sentry-style sink in a later phase.
  // eslint-disable-next-line no-console
  console.error('[client-error]', error.message, context);
}

export function ClientErrorBoundaryReporter({ error }: { error: Error }) {
  useEffect(() => {
    reportClientError(error, { source: 'error-boundary' });
  }, [error]);
  return null;
}
