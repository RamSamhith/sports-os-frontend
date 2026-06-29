'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAcademies } from '@/lib/api/academies';
import { listSports } from '@/lib/api/sports';
import type { Academy } from '@/types/domain/academy';
import type { Sport } from '@/types/domain/sport';

let academiesCache: Academy[] | null = null;
let academiesPromise: Promise<Academy[]> | null = null;
let sportsCache: Sport[] | null = null;
let sportsPromise: Promise<Sport[]> | null = null;

async function fetchAcademies(): Promise<Academy[]> {
  if (academiesCache) return academiesCache;
  if (academiesPromise) return academiesPromise;

  academiesPromise = (async () => {
    try {
      const res = await getAcademies({ pageSize: 200 });
      if (res.ok) {
        academiesCache = Array.isArray(res.data?.items) ? res.data.items : [];
        return academiesCache;
      }
      return [];
    } catch {
      return [];
    } finally {
      academiesPromise = null;
    }
  })();

  return academiesPromise;
}

async function fetchSports(): Promise<Sport[]> {
  if (sportsCache) return sportsCache;
  if (sportsPromise) return sportsPromise;

  sportsPromise = (async () => {
    try {
      const res = await listSports({ status: 'published', limit: 100 });
      if (res.ok) {
        sportsCache = Array.isArray(res.data?.items) ? res.data.items : [];
        return sportsCache;
      }
      return [];
    } catch {
      return [];
    } finally {
      sportsPromise = null;
    }
  })();

  return sportsPromise;
}

export function useHomepageData() {
  const [academies, setAcademies] = useState<Academy[]>(academiesCache ?? []);
  const [sports, setSports] = useState<Sport[]>(sportsCache ?? []);
  const [loading, setLoading] = useState(!academiesCache || !sportsCache);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [a, s] = await Promise.all([fetchAcademies(), fetchSports()]);
        if (!cancelled) {
          setAcademies(a);
          setSports(s);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (academiesCache && sportsCache) {
      setLoading(false);
      return;
    }

    load();
    return () => { cancelled = true; };
  }, [retryKey]);

  const refetch = useCallback(() => {
    academiesCache = null;
    sportsCache = null;
    setLoading(true);
    setError(null);
    setRetryKey((k) => k + 1);
  }, []);

  return { academies, sports, loading, error, refetch };
}
