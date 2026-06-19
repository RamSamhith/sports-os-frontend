'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY || typeof window === 'undefined') return;

    (function (c: any, a: any) {
      c[a] = c[a] || function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    })(window as any, 'posthog');
    (window as any).posthog.q = (window as any).posthog.q || [];

    const script = document.createElement('script');
    script.src = `${POSTHOG_HOST}/static/array.js`;
    script.async = true;
    script.onload = () => {
      (window as any).posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: true,
        persistence: 'localStorage+cookie',
      });
    };
    document.head.appendChild(script);

    return () => { script.remove(); };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageTracker />
      </Suspense>
      {children}
    </>
  );
}

function PostHogPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY || typeof window === 'undefined' || !(window as any).posthog) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    (window as any).posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function track(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(event, properties);
  }
}

export function identify(distinctId: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.identify(distinctId, properties);
  }
}

export function reset() {
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.reset();
  }
}
