'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/container';

export default function OfflinePage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
        Offline
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        You&apos;re offline
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md text-balance">
        SportsOS needs an internet connection to load this page. Please check
        your connection and try again.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-border bg-background inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
        >
          Go home
        </Link>
      </div>
    </Container>
  );
}
