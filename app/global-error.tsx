'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error reporting hook — client side
    // eslint-disable-next-line no-console
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="en" className="midnight-ice">
      <body
        style={{
          background: '#0a0a0a',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ opacity: 0.7 }}>
            An unexpected error occurred. Please try again. If the problem persists, contact support.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button onClick={() => (window.location.href = '/')} variant="outline">
              Go home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
