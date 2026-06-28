'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Error</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-44">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md text-balance">
        An unexpected error occurred. Please try again. If the problem persists, contact support.
      </p>
      {error.digest && (
        <p className="text-muted-foreground mt-2 text-xs">Error ID: {error.digest}</p>
      )}
      <div className="mt-8 flex gap-3">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button onClick={() => (window.location.href = '/')} variant="outline">
          Go home
        </Button>
      </div>
    </Container>
  );
}
