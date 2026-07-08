'use client';

import { useCallback, useState } from 'react';

/**
 * Browser geolocation hook — detects the user's current position
 * and reverse-geocodes it via OpenStreetMap Nominatim (free, no API key).
 *
 * For production scale, swap Nominatim for Google Geocoding API.
 */

// ─── Types ─────────────────────────────────────────────────────

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export interface GeolocationResult {
  coords: GeolocationCoords;
  address: string | null;
}

export type GeolocationStatus = 'idle' | 'loading' | 'done' | 'error';

export interface UseGeolocationReturn {
  status: GeolocationStatus;
  result: GeolocationResult | null;
  error: string | null;
  detect: () => void;
}

// ─── Hook ──────────────────────────────────────────────────────

export function useGeolocation(): UseGeolocationReturn {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [result, setResult] = useState<GeolocationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Reverse geocode using Nominatim (free, no API key)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } },
          );
          const data = await res.json();
          const address = data.display_name || null;
          setResult({ coords: { latitude, longitude }, address });
        } catch {
          // Reverse geocode failed — still return coords
          setResult({ coords: { latitude, longitude }, address: null });
        }

        setStatus('done');
      },
      (err) => {
        setError(
          err.code === 1
            ? 'Location permission denied. Please allow location access in browser settings.'
            : 'Unable to fetch location. Please try again.',
        );
        setStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return { status, result, error, detect };
}
