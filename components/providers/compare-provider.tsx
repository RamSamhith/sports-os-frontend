'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CompareContext, type CompareContextValue, type CompareItem } from '@/lib/hooks/use-compare';

const MAX_ITEMS = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  const canAdd = useCallback(
    (entityType: CompareItem['entityType'], id: string) =>
      items.length < MAX_ITEMS && !items.some((i) => i.entityType === entityType && i.id === id),
    [items],
  );

  const has = useCallback(
    (entityType: CompareItem['entityType'], id: string) =>
      items.some((i) => i.entityType === entityType && i.id === id),
    [items],
  );

  const add = useCallback<CompareContextValue['add']>(
    (item) => {
      setItems((prev) => (canAdd(item.entityType, item.id) ? [...prev, item] : prev));
    },
    [canAdd],
  );

  const remove = useCallback<CompareContextValue['remove']>((entityType, id) => {
    setItems((prev) => prev.filter((i) => !(i.entityType === entityType && i.id === id)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CompareContextValue>(
    () => ({ items, canAdd, has, add, remove, clear, maxItems: MAX_ITEMS }),
    [items, canAdd, has, add, remove, clear],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}
