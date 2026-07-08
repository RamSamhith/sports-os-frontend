'use client';

import type { AnalyticsEventInput } from '@/types/domain/analytics-event';

interface QueuedEvent extends AnalyticsEventInput {
  ts: number;
}

const QUEUE_KEY = 'sportsos:event-queue';
const FLUSH_INTERVAL = 15_000;

export function createAnalyticsClient(opts: { endpoint: string; enabled: boolean; getConsent: () => { analytics: boolean } }) {
  let buffer: QueuedEvent[] = [];

  function enqueue(event: AnalyticsEventInput) {
    if (!opts.enabled) return;
    if (!opts.getConsent().analytics) return;
    buffer.push({ ...event, ts: Date.now() });
    persist();
  }

  function persist() {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(QUEUE_KEY, JSON.stringify(buffer));
    } catch {
      /* ignore */
    }
  }

  function restore() {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.sessionStorage.getItem(QUEUE_KEY);
      if (raw) buffer = JSON.parse(raw) as QueuedEvent[];
    } catch {
      buffer = [];
    }
  }

  async function flush() {
    if (!opts.enabled) return;
    if (!buffer.length) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    const batch = buffer.slice();
    buffer = [];
    persist();
    try {
      await fetch(opts.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ events: batch }),
        keepalive: true,
      });
    } catch {
      // Re-queue on failure
      buffer = [...batch, ...buffer].slice(-200);
      persist();
    }
  }

  if (typeof window !== 'undefined') {
    restore();
    const interval = window.setInterval(flush, FLUSH_INTERVAL);
    const onHide = () => {
      void flush();
    };
    window.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onHide);
    return {
      track: enqueue,
      flush,
      dispose: () => {
        window.clearInterval(interval);
        window.removeEventListener('visibilitychange', onHide);
        window.removeEventListener('pagehide', onHide);
      },
    };
  }

  return {
    track: enqueue,
    flush: async () => undefined,
    dispose: () => undefined,
  };
}
