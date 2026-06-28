'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from './use-debounce';

/**
 * Shared hook for URL-driven search query state.
 * Reads `?q` from URL, debounces updates, and syncs back via router.replace.
 */
export function useSearchQuery(debounceMs = 150) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(() => searchParams.get('q') ?? '');
  const debouncedQuery = useDebounce(query, debounceMs);

  useEffect(() => {
    const current = searchParams.get('q') ?? '';
    if ((debouncedQuery || '') === current) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set('q', debouncedQuery);
    else params.delete('q');
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return { query, setQuery, debouncedQuery };
}
