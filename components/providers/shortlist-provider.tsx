'use client';

import * as React from 'react';
import { ShortlistContext, type ShortlistContextValue } from '@/lib/hooks/use-shortlist';
import { useStorageSync } from '@/lib/hooks/use-storage-sync';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { sports } from '@/data/sports';
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

function readPersisted(): PersistedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PersistedItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) =>
        i &&
        typeof i.itemId === 'string' &&
        typeof i.itemType === 'string' &&
        typeof i.label === 'string',
    );
  } catch {
    return [];
  }
}

function writePersisted(items: PersistedItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota / disabled storage */
  }
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

function buildValidKeys(): Set<string> {
  const keys = new Set<string>();
  for (const a of academies) keys.add(`academy:${a.id}`);
  for (const c of coaches) keys.add(`coach:${c.id}`);
  for (const s of sports) keys.add(`sport:${s.id}`);
  return keys;
}

function applyFromRaw(
  raw: string | null,
  setItems: (items: ShortlistItem[]) => void,
  setExtras: (m: Record<string, { label: string; sublabel?: string; href: string }>) => void,
): void {
  if (raw == null) {
    setItems([]);
    setExtras({});
    return;
  }
  let parsed: PersistedItem[] = [];
  try {
    const data = JSON.parse(raw) as PersistedItem[];
    parsed = Array.isArray(data) ? data : [];
  } catch {
    parsed = [];
  }
  parsed = parsed.filter(
    (i) =>
      i &&
      typeof i.itemId === 'string' &&
      typeof i.itemType === 'string' &&
      typeof i.label === 'string',
  );
  // Provider-level cleanup: drop ids that no longer match a fixture.
  const valid = buildValidKeys();
  parsed = parsed.filter((p) => valid.has(`${p.itemType}:${p.itemId}`));
  setItems(parsed.map(toContextItem));
  const map: Record<string, { label: string; sublabel?: string; href: string }> = {};
  for (const p of parsed) {
    map[`${p.itemType}:${p.itemId}`] = {
      label: p.label,
      sublabel: p.sublabel,
      href: p.href,
    };
  }
  setExtras(map);
}

interface ShortlistProviderProps {
  children: React.ReactNode;
}

export function ShortlistProvider({ children }: ShortlistProviderProps) {
  // We start empty on the server; hydrate from localStorage on the client.
  const [items, setItems] = React.useState<ShortlistItem[]>([]);
  const [extras, setExtras] = React.useState<Record<string, { label: string; sublabel?: string; href: string }>>({});
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    applyFromRaw(window.localStorage.getItem(STORAGE_KEY), setItems, setExtras);
    setHydrated(true);
  }, []);

  // Persist on every change once hydrated.
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

  // Multi-tab sync: when another tab writes to localStorage, re-hydrate.
  useStorageSync(STORAGE_KEY, (raw) => {
    applyFromRaw(raw, setItems, setExtras);
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
        const next: ShortlistItem = {
          ...item,
          id: `${item.itemType}:${item.itemId}`,
          userId: 'guest',
          createdAt: new Date().toISOString(),
        };
        return [...prev, next];
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
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
    setExtras({});
  }, []);

  // Helper: add with display metadata. Returns true if added, false if already present.
  const addWithMeta = React.useCallback(
    (
      itemType: ShortlistItemType,
      itemId: string,
      meta: { label: string; sublabel?: string; href: string },
    ) => {
      let added = false;
      setItems((prev) => {
        if (prev.some((i) => i.itemType === itemType && i.itemId === itemId)) return prev;
        added = true;
        return [
          ...prev,
          {
            id: `${itemType}:${itemId}`,
            userId: 'guest',
            itemType,
            itemId,
            createdAt: new Date().toISOString(),
          },
        ];
      });
      if (added) {
        setExtras((prev) => ({ ...prev, [`${itemType}:${itemId}`]: meta }));
      }
      return added;
    },
    [],
  );

  const value = React.useMemo<ShortlistContextValue & {
    extras: typeof extras;
    addWithMeta: typeof addWithMeta;
  }>(
    () => ({ items, has, add, remove, clear, extras, addWithMeta }),
    [items, has, add, remove, clear, extras, addWithMeta],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}
