'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ShortlistContext, type ShortlistContextValue } from '@/lib/hooks/use-shortlist';
import type { ShortlistItem, ShortlistItemType } from '@/types/domain/shortlist';

const STORAGE_KEY = 'sportsos:shortlist';

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShortlistItem[]>([]);

  const has = useCallback(
    (itemType: ShortlistItemType, itemId: string) =>
      items.some((i) => i.itemType === itemType && i.itemId === itemId),
    [items],
  );

  const add = useCallback<ShortlistContextValue['add']>((item) => {
    setItems((prev) => [
      ...prev,
      {
        ...item,
        id: crypto.randomUUID(),
        userId: 'guest',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const remove = useCallback<ShortlistContextValue['remove']>((itemType, itemId) => {
    setItems((prev) => prev.filter((i) => !(i.itemType === itemType && i.itemId === itemId)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<ShortlistContextValue>(
    () => ({ items, has, add, remove, clear }),
    [items, has, add, remove, clear],
  );

  return (
    <ShortlistContext.Provider value={value}>
      {children}
      {/* SSR-safe key reference to silence unused import in this minimal scaffold */}
      <span hidden data-storage-key={STORAGE_KEY} />
    </ShortlistContext.Provider>
  );
}
