'use client';

import * as React from 'react';

/**
 * Subscribes to `storage` events for the given `key` and reports whether
 * the storage has changed in another tab. Use this to re-hydrate provider
 * state when another tab/window writes to the same key.
 */
export function useStorageSync(
  key: string,
  onExternalChange: (raw: string | null) => void,
) {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: StorageEvent) => {
      if (e.key !== key) return;
      onExternalChange(e.newValue);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, onExternalChange]);
}
