'use client';

import { createContext, useContext } from 'react';
import type { LocationSource, LocationSummary, Radius } from '@/types/domain/location';

export interface LocationContextValue {
  location?: LocationSummary;
  radius: Radius;
  source?: LocationSource;
  detect: () => Promise<void>;
  setManual: (location: LocationSummary) => void;
  setRadius: (radius: Radius) => void;
  clear: () => void;
}

export const LocationContext = createContext<LocationContextValue | null>(null);

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return ctx;
}
