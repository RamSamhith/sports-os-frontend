'use client';

import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AnalyticsContextValue } from '@/types/analytics/events';
import type { AnalyticsEventName } from '@/types/domain/analytics-event';
import { publicEnv } from '@/config/env';
import { createAnalyticsClient } from '@/lib/analytics/client';
import { useConsent } from '@/lib/hooks/use-consent';

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { consent, set: setConsentCategory } = useConsent();
  const clientRef = useRef<ReturnType<typeof createAnalyticsClient> | null>(null);
  const consentRef = useRef(consent);
  const [ready, setReady] = useState(false);

  consentRef.current = consent;

  useEffect(() => {
    clientRef.current = createAnalyticsClient({
      endpoint: publicEnv.analyticsEndpoint || '/api/events',
      enabled: publicEnv.analyticsEnabled,
      getConsent: () => ({ analytics: consentRef.current.analytics }),
    });
    setReady(true);
    return () => clientRef.current?.dispose();
  }, []);

  const track = useCallback<AnalyticsContextValue['track']>((input) => {
    if (!ready) return;
    clientRef.current?.track(input);
  }, [ready]);

  const flush = useCallback<AnalyticsContextValue['flush']>(async () => {
    if (!ready) return;
    await clientRef.current?.flush();
  }, [ready]);

  const setConsent = useCallback<AnalyticsContextValue['setConsent']>(
    (category, granted) => {
      setConsentCategory(category, granted);
    },
    [setConsentCategory],
  );

  const value = useMemo<AnalyticsContextValue>(
    () => ({ consent, track, flush, setConsent }),
    [consent, track, flush, setConsent],
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

// Type re-export for hook convenience
export type { AnalyticsEventName };
