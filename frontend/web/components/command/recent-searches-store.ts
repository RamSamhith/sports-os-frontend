'use client';

import * as React from 'react';

const STORAGE_KEY = 'sportsos:recent-searches';
const MAX = 6;

export interface RecentQuery {
  query: string;
  at: number;
}

function read(): RecentQuery[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentQuery[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((q) => q && typeof q.query === 'string' && q.query.trim().length > 0)
      .slice(0, MAX);
  } catch {
    return [];
  }
}

function write(items: RecentQuery[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    /* ignore quota / disabled */
  }
}

export function useRecentSearches() {
  const [items, setItems] = React.useState<RecentQuery[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setItems(read());
    setHydrated(true);
  }, []);

  const push = React.useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setItems((prev) => {
      const next = [
        { query: trimmed, at: Date.now() },
        ...prev.filter((p) => p.query.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, MAX);
      write(next);
      return next;
    });
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
    write([]);
  }, []);

  return { items: hydrated ? items : [], push, clear, hydrated };
}
