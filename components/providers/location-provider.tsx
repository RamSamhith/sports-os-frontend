'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LocationContext, type LocationContextValue } from '@/lib/hooks/use-location';
import { DEFAULT_RADIUS, RADIUS_OPTIONS } from '@/lib/constants/radii';
import type { LocationSummary, Radius } from '@/types/domain/location';

const STORAGE_KEY = 'sportsos:location';
const RADIUS_KEY = 'sportsos:location-radius';

function readLocation(): LocationSummary | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as LocationSummary;
  } catch {
    return undefined;
  }
}

function writeLocation(loc: LocationSummary | undefined) {
  try {
    if (loc) localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

function readRadius(): Radius {
  try {
    const raw = localStorage.getItem(RADIUS_KEY);
    if (!raw) return DEFAULT_RADIUS;
    const parsed = Number(raw) as Radius;
    return RADIUS_OPTIONS.includes(parsed) ? parsed : DEFAULT_RADIUS;
  } catch {
    return DEFAULT_RADIUS;
  }
}

function writeRadius(r: Radius) {
  try {
    localStorage.setItem(RADIUS_KEY, String(r));
  } catch { /* ignore */ }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationSummary | undefined>(undefined);
  const [radius, setRadiusState] = useState<Radius>(DEFAULT_RADIUS);
  const [source, setSource] = useState<LocationContextValue['source']>(undefined);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setLocation(readLocation());
    setRadiusState(readRadius());
    setHydrated(true);
  }, []);

  // Persist location on change
  useEffect(() => {
    if (hydrated) writeLocation(location);
  }, [location, hydrated]);

  // Persist radius on change
  useEffect(() => {
    if (hydrated) writeRadius(radius);
  }, [radius, hydrated]);

  const detect = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        resolve();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            city: '',
            state: '',
            country: 'IN',
            lat: latitude,
            lng: longitude,
          });
          setSource('gps');
          resolve();
        },
        (error) => {
          reject(error);
          resolve();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    });
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
