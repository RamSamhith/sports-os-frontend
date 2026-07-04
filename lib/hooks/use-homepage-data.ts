'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAcademies } from '@/lib/api/academies';
import { listSports } from '@/lib/api/sports';
import { sportsCatalog } from '@/data/sports-catalog';
import type { Academy } from '@/types/domain/academy';
import type { Sport } from '@/types/domain/sport';

let academiesCache: Academy[] | null = null;
let academiesPromise: Promise<Academy[]> | null = null;
let academiesTotalCache: number = 0;
let sportsCache: Sport[] | null = null;
let sportsPromise: Promise<Sport[]> | null = null;
let sportsTotalCache: number = 0;

async function fetchAcademies(): Promise<{ items: Academy[]; total: number }> {
  if (academiesCache) return { items: academiesCache, total: academiesTotalCache };
  if (academiesPromise) return academiesPromise.then((items) => ({ items, total: academiesTotalCache }));

  academiesPromise = (async () => {
    try {
      const res = await getAcademies({ pageSize: 200 });
      if (res.ok) {
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        academiesTotalCache = res.data?.pagination?.total ?? items.length;
        academiesCache = items;
        return items;
      }
      return [];
    } catch {
      return [];
    } finally {
      academiesPromise = null;
    }
  })();

  return academiesPromise.then((items) => ({ items, total: academiesTotalCache }));
}

async function fetchSports(): Promise<{ items: Sport[]; total: number }> {
  if (sportsCache) return { items: sportsCache, total: sportsTotalCache };
  if (sportsPromise) return sportsPromise.then((items) => ({ items, total: sportsTotalCache }));

  sportsPromise = (async () => {
    try {
      const res = await listSports({ status: 'published', limit: 100 });
      if (res.ok) {
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        sportsTotalCache = res.data?.pagination?.total ?? items.length;
        sportsCache = items;
        return items;
      }
    } catch {
      // API failed — fall through to static catalog
    }

    // Fallback: use the static sports catalog count (23 sports)
    sportsTotalCache = sportsCatalog.length;
    sportsCache = sportsCatalog.map((s) => ({ id: s.slug, slug: s.slug, name: s.name } as unknown as Sport));
    return sportsCache;
  })();

  return sportsPromise.then((items) => ({ items, total: sportsTotalCache }));
}

export function useHomepageData() {
  const [academies, setAcademies] = useState<Academy[]>(academiesCache ?? []);
  const [sports, setSports] = useState<Sport[]>(sportsCache ?? []);
  const [academiesTotal, setAcademiesTotal] = useState(academiesTotalCache);
  const [sportsTotal, setSportsTotal] = useState(sportsTotalCache);
  const [loading, setLoading] = useState(!academiesCache || !sportsCache);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [a, s] = await Promise.all([fetchAcademies(), fetchSports()]);
        if (!cancelled) {
          setAcademies(a.items);
          setAcademiesTotal(a.total);
          setSports(s.items);
          setSportsTotal(s.total);
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

  return { academies, sports, academiesTotal, sportsTotal, loading, error, refetch };
}
