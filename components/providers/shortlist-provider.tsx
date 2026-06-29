'use client';

import * as React from 'react';
import { ShortlistContext, type ShortlistContextValue } from '@/lib/hooks/use-shortlist';
import { useStorageSync } from '@/lib/hooks/use-storage-sync';
import { BUILD_HASH } from '@/lib/version';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  getMyShortlistPopulated,
  addToShortlist,
  removeFromShortlistById,
  clearShortlist,
} from '@/lib/api/shortlist';
import { trackShortlistAdd, trackShortlistRemove, trackGuestShortlist } from '@/lib/analytics/events';
import type { ShortlistItem, ShortlistItemType } from '@/types/domain/shortlist';

const STORAGE_KEY = 'sportsos:shortlist';

interface PersistedItem {
  itemType: ShortlistItemType;
  itemId: string;
  label: string;
  sublabel?: string;
  href: string;
  addedAt: string;
}

interface PersistedEnvelope {
  version: string;
  items: PersistedItem[];
}

function readPersisted(): PersistedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (data && typeof data === 'object' && Array.isArray(data.items) && typeof data.version === 'string') {
      if (data.version !== BUILD_HASH) {
        window.localStorage.removeItem(STORAGE_KEY);
        return [];
      }
      return data.items;
    }
    if (Array.isArray(data)) return data;
    return [];
  } catch {
    return [];
  }
}

function writePersisted(items: PersistedItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const envelope: PersistedEnvelope = { version: BUILD_HASH, items };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch { /* ignore */ }
}

function toContextItem(p: PersistedItem): ShortlistItem {
  return {
    id: `${p.itemType}:${p.itemId}`,
    userId: 'guest',
    itemType: p.itemType,
    itemId: p.itemId,
    createdAt: p.addedAt,
  };
}

interface ShortlistProviderProps {
  children: React.ReactNode;
}

export function ShortlistProvider({ children }: ShortlistProviderProps) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = React.useState<ShortlistItem[]>([]);
  const [extras, setExtras] = React.useState<Record<string, { label: string; sublabel?: string; href: string }>>({});
  const [hydrated, setHydrated] = React.useState(false);
  const [populatedData, setPopulatedData] = React.useState<Record<string, Record<string, unknown>>>({});
  const [backendIds, setBackendIds] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const persisted = readPersisted();
    setItems(persisted.map(toContextItem));
    const map: Record<string, { label: string; sublabel?: string; href: string }> = {};
    for (const p of persisted) {
      map[`${p.itemType}:${p.itemId}`] = { label: p.label, sublabel: p.sublabel, href: p.href };
    }
    setExtras(map);
    setHydrated(true);

    if (isAuthenticated) {
      getMyShortlistPopulated().then((res) => {
        if (res.ok) {
          const apiItems: ShortlistItem[] = res.data.map((it: any) => ({
            id: `${it.itemType}:${it.itemId}`,
            userId: it.userId,
            itemType: it.itemType,
            itemId: it.itemId,
            createdAt: it.createdAt,
          }));

          const apiKeys = new Set(apiItems.map(i => `${i.itemType}:${i.itemId}`));
          const unsyncedGuest = persisted.filter(p => !apiKeys.has(`${p.itemType}:${p.itemId}`));

          for (const g of unsyncedGuest) {
            if (g.itemType === 'academy' || g.itemType === 'coach') {
              addToShortlist(g.itemType, g.itemId).catch(() => {});
            }
          }

          const merged = [
            ...apiItems,
            ...unsyncedGuest.map(p => toContextItem(p)),
          ];
          setItems(merged);

          const popMap: Record<string, Record<string, unknown>> = {};
          const extrasMap: Record<string, { label: string; sublabel?: string; href: string }> = {};
          const backendIdMap: Record<string, string> = {};
          for (const it of res.data) {
            const key = `${it.itemType}:${it.itemId}`;
            if (it.data) {
              popMap[key] = it.data;
              const d = it.data as any;
              extrasMap[key] = {
                label: d.name ?? it.itemId,
                sublabel: it.itemType === 'academy'
                  ? `${d.location?.city ?? ''}, ${d.location?.state ?? ''}`
                  : `${d.location?.city ?? ''} · ${d.experienceYears ?? ''}+ yrs`,
                href: it.itemType === 'academy'
                  ? `/academies/${d.slug ?? it.itemId}`
                  : `/coaches/${d.slug ?? it.itemId}`,
              };
            }
            backendIdMap[key] = it.id;
          }
          for (const p of unsyncedGuest) {
            const key = `${p.itemType}:${p.itemId}`;
            if (!extrasMap[key]) {
              extrasMap[key] = { label: p.label, sublabel: p.sublabel, href: p.href };
            }
          }
          setPopulatedData(popMap);
          setExtras(extrasMap);
          setBackendIds(backendIdMap);
        }
      });
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!hydrated) return;
    const persisted: PersistedItem[] = items.map((it) => ({
      itemType: it.itemType,
      itemId: it.itemId,
      label: extras[`${it.itemType}:${it.itemId}`]?.label ?? it.itemId,
      sublabel: extras[`${it.itemType}:${it.itemId}`]?.sublabel,
      href: extras[`${it.itemType}:${it.itemId}`]?.href ?? '#',
      addedAt: it.createdAt,
    }));
    writePersisted(persisted);
  }, [items, extras, hydrated]);

  useStorageSync(STORAGE_KEY, (raw) => {
    if (isAuthenticated) return;
    if (raw == null) { setItems([]); setExtras({}); return; }
    try {
      const data = JSON.parse(raw);
      const parsed: PersistedItem[] = data?.items ?? (Array.isArray(data) ? data : []);
      setItems(parsed.map(toContextItem));
      const map: Record<string, { label: string; sublabel?: string; href: string }> = {};
      for (const p of parsed) {
        map[`${p.itemType}:${p.itemId}`] = { label: p.label, sublabel: p.sublabel, href: p.href };
      }
      setExtras(map);
    } catch { setItems([]); setExtras({}); }
  });

  const has = React.useCallback(
    (itemType: ShortlistItemType, itemId: string) =>
      items.some((i) => i.itemType === itemType && i.itemId === itemId),
    [items],
  );

  const add = React.useCallback<ShortlistContextValue['add']>(
    (item) => {
      setItems((prev) => {
        if (prev.some((i) => i.itemType === item.itemType && i.itemId === item.itemId)) return prev;
        return [...prev, { ...item, id: `${item.itemType}:${item.itemId}`, userId: 'guest', createdAt: new Date().toISOString() }];
      });
    },
    [],
  );

  const remove = React.useCallback<ShortlistContextValue['remove']>((itemType, itemId) => {
    setItems((prev) => prev.filter((i) => !(i.itemType === itemType && i.itemId === itemId)));
    setExtras((prev) => {
      const next = { ...prev };
      delete next[`${itemType}:${itemId}`];
      return next;
    });
    setPopulatedData((prev) => {
      const next = { ...prev };
      delete next[`${itemType}:${itemId}`];
      return next;
    });
  }, []);

  const clear = React.useCallback(() => { setItems([]); setExtras({}); setPopulatedData({}); }, []);

  const addWithMeta = React.useCallback(
    (
      itemType: ShortlistItemType,
      itemId: string,
      meta: { label: string; sublabel?: string; href: string },
    ) => {
      const alreadyExists = items.some((i) => i.itemType === itemType && i.itemId === itemId);
      if (alreadyExists) return false;
      setItems((prev) => [
        ...prev,
        { id: `${itemType}:${itemId}`, userId: 'guest', itemType, itemId, createdAt: new Date().toISOString() },
      ]);
      setExtras((prev) => ({ ...prev, [`${itemType}:${itemId}`]: meta }));
      return true;
    },
    [items],
  );

  const addWithMetaAndSync = React.useCallback(
    (
      itemType: ShortlistItemType,
      itemId: string,
      meta: { label: string; sublabel?: string; href: string },
    ) => {
      const added = addWithMeta(itemType, itemId, meta);
      if (added) {
        if (isAuthenticated) {
          if (itemType === 'academy' || itemType === 'coach') {
            addToShortlist(itemType, itemId).catch(() => {});
          }
          trackShortlistAdd(itemId, itemType, meta.label);
        } else {
          trackGuestShortlist(itemId, itemType, meta.label);
        }
      }
      return added;
    },
    [addWithMeta, isAuthenticated],
  );

  const removeAndSync = React.useCallback(
    (itemType: ShortlistItemType, itemId: string) => {
      remove(itemType, itemId);
      trackShortlistRemove(itemId, itemType);
      if (isAuthenticated && (itemType === 'academy' || itemType === 'coach')) {
        const key = `${itemType}:${itemId}`;
        const backendId = backendIds[key];
        if (backendId) {
          removeFromShortlistById(backendId).catch(() => {});
        }
      }
    },
    [remove, isAuthenticated, backendIds],
  );

  const clearAndSync = React.useCallback(() => {
    clear();
    if (isAuthenticated) {
      clearShortlist().catch(() => {});
    }
  }, [clear, isAuthenticated]);

  const value = React.useMemo<ShortlistContextValue & {
    extras: typeof extras;
    addWithMeta: typeof addWithMetaAndSync;
    populatedData: typeof populatedData;
  }>(
    () => ({ items, has, add, remove: removeAndSync, clear: clearAndSync, extras, addWithMeta: addWithMetaAndSync, populatedData }),
    [items, has, add, removeAndSync, clearAndSync, extras, addWithMetaAndSync, populatedData],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}
