'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { LocationContext, type LocationContextValue } from '@/lib/hooks/use-location';
import { DEFAULT_RADIUS, RADIUS_OPTIONS } from '@/lib/constants/radii';
import type { LocationSummary, Radius } from '@/types/domain/location';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationSummary | undefined>();
  const [radius, setRadiusState] = useState<Radius>(DEFAULT_RADIUS);
  const [source, setSource] = useState<LocationContextValue['source']>(undefined);

  const detect = useCallback(async () => {
    // Placeholder: real geolocation flow in later phase.
    setSource('gps');
  }, []);

  const setManual = useCallback((next: LocationSummary) => {
    setLocation(next);
    setSource('manual');
  }, []);

  const setRadius = useCallback((next: Radius) => {
    if (!RADIUS_OPTIONS.includes(next)) return;
    setRadiusState(next);
  }, []);

  const clear = useCallback(() => {
    setLocation(undefined);
    setSource(undefined);
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({ location, radius, source, detect, setManual, setRadius, clear }),
    [location, radius, source, detect, setManual, setRadius, clear],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}
