'use client';

import * as React from 'react';
import { CompareContext, type CompareContextValue, type CompareItem, type CompareItemMeta } from '@/lib/hooks/use-compare';
import { useStorageSync } from '@/lib/hooks/use-storage-sync';
import { BUILD_HASH } from '@/lib/version';
import { useAuth } from '@/lib/hooks/use-auth';
import { trackCompareAdd, trackCompareRemove, trackGuestCompare } from '@/lib/analytics/events';

const STORAGE_KEY = 'sportsos:compare';

/** Minimum and maximum number of items a user can compare at once. */
export const COMPARE_MIN = 2;
export const COMPARE_MAX = 4;
const MAX_ITEMS = COMPARE_MAX;

interface PersistedItem {
  entityType: CompareItem['entityType'];
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  addedAt: string;
}

interface PersistedEnvelope {
  version: string;
  items: PersistedItem[];
}

function applyFromRaw(
  raw: string | null,
  setItems: (items: CompareItem[]) => void,
  setExtras: (m: Record<string, CompareItemMeta>) => void,
): void {
  if (raw == null) {
    setItems([]);
    setExtras({});
    return;
  }
  let parsed: PersistedItem[] = [];
  try {
    const data = JSON.parse(raw);
    if (data && typeof data === 'object' && Array.isArray(data.items) && typeof data.version === 'string') {
      if (data.version !== BUILD_HASH) {
        window.localStorage.removeItem(STORAGE_KEY);
        setItems([]);
        setExtras({});
        return;
      }
      parsed = data.items;
    } else if (Array.isArray(data)) {
      parsed = data;
    } else {
      parsed = [];
    }
  } catch {
    parsed = [];
  }
  parsed = parsed.filter(
    (i) =>
      i &&
      typeof i.id === 'string' &&
      typeof i.entityType === 'string' &&
      typeof i.label === 'string',
  );

  setItems(parsed.map(({ entityType, id }) => ({ entityType, id })));
  const extrasMap: Record<string, CompareItemMeta> = {};
  for (const p of parsed) {
    extrasMap[`${p.entityType}:${p.id}`] = {
      label: p.label,
      sublabel: p.sublabel,
      href: p.href,
    };
  }
  setExtras(extrasMap);
}

function writePersisted(items: PersistedItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const envelope: PersistedEnvelope = { version: BUILD_HASH, items };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    /* ignore quota / disabled storage */
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const { isGuest, isAuthenticated } = useAuth();
  const [items, setItems] = React.useState<CompareItem[]>([]);
  const [extras, setExtras] = React.useState<Record<string, CompareItemMeta>>({});
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    applyFromRaw(window.localStorage.getItem(STORAGE_KEY), setItems, setExtras);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    let persisted: PersistedItem[];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      let existingItems: PersistedItem[] = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
          existingItems = parsed.items;
        } else if (Array.isArray(parsed)) {
          existingItems = parsed;
        }
      }
      persisted = items.map((it) => {
        const meta = extras[`${it.entityType}:${it.id}`];
        const prior = existingItems.find((e) => e.entityType === it.entityType && e.id === it.id);
        return {
          entityType: it.entityType,
          id: it.id,
          label: meta?.label ?? it.id,
          sublabel: meta?.sublabel,
          href: meta?.href ?? '#',
          addedAt: prior?.addedAt ?? new Date().toISOString(),
        };
      });
    } catch {
      persisted = items.map((it) => {
        const meta = extras[`${it.entityType}:${it.id}`];
        return {
          entityType: it.entityType,
          id: it.id,
          label: meta?.label ?? it.id,
          sublabel: meta?.sublabel,
          href: meta?.href ?? '#',
          addedAt: new Date().toISOString(),
        };
      });
    }
    writePersisted(persisted);
  }, [items, extras, hydrated]);

  const onStorageSync = React.useCallback(
    (raw: string | null) => {
      applyFromRaw(raw, setItems, setExtras);
    },
    [], // setItems and setExtras are stable React state setters
  );

  useStorageSync(STORAGE_KEY, onStorageSync);

  const canAdd = React.useCallback(
    (entityType: CompareItem['entityType'], id: string) =>
      items.length < MAX_ITEMS && !items.some((i) => i.entityType === entityType && i.id === id),
    [items],
  );

  const has = React.useCallback(
    (entityType: CompareItem['entityType'], id: string) =>
      items.some((i) => i.entityType === entityType && i.id === id),
    [items],
  );

  const add = React.useCallback<CompareContextValue['add']>(
    (item) => {
      setItems((prev) => {
        if (prev.length >= MAX_ITEMS) return prev;
        if (prev.some((i) => i.entityType === item.entityType && i.id === item.id)) return prev;
        return [...prev, item];
      });
    },
    [],
  );

  const addWithMeta = React.useCallback<CompareContextValue['addWithMeta']>(
    (entityType, id, meta) => {
      let added = false;
      setItems((prev) => {
        if (prev.length >= MAX_ITEMS) return prev;
        if (prev.some((i) => i.entityType === entityType && i.id === id)) return prev;
        added = true;
        return [...prev, { entityType, id }];
      });
      if (added) {
        setExtras((prev) => ({
          ...prev,
          [`${entityType}:${id}`]: meta,
        }));
        if (isGuest || !isAuthenticated) {
          trackGuestCompare(items.length + 1);
        } else {
          trackCompareAdd(id, entityType, meta.label);
        }
      }
      return added;
    },
    [items.length, isGuest, isAuthenticated],
  );

  const remove = React.useCallback<CompareContextValue['remove']>((entityType, id) => {
    let wasPresent = false;
    setItems((prev) => {
      const filtered = prev.filter((i) => {
        if (i.entityType === entityType && i.id === id) {
          wasPresent = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    setExtras((prev) => {
      const next = { ...prev };
      delete next[`${entityType}:${id}`];
      return next;
    });
    if (wasPresent) {
      trackCompareRemove(id, entityType);
    }
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
    setExtras({});
  }, []);

  const value = React.useMemo<CompareContextValue & {
    extras: typeof extras;
    addWithMeta: typeof addWithMeta;
  }>(
    () => ({
      items,
      canAdd,
      has,
      add,
      addWithMeta,
      remove,
      clear,
      maxItems: MAX_ITEMS,
      minItems: COMPARE_MIN,
      extras,
      hydrated,
    }),
    [items, canAdd, has, add, addWithMeta, remove, clear, extras, hydrated],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}
