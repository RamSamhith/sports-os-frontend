'use client';

import * as React from 'react';
import { CompareContext, type CompareContextValue, type CompareItem } from '@/lib/hooks/use-compare';
import { useStorageSync } from '@/lib/hooks/use-storage-sync';
import { academies } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { sports } from '@/data/sports';

const STORAGE_KEY = 'sportsos:compare';
const MAX_ITEMS = 3;

interface PersistedItem extends CompareItem {
  label: string;
  sublabel?: string;
  href: string;
  addedAt: string;
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
  setItems: (items: CompareItem[]) => void,
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
      typeof i.id === 'string' &&
      typeof i.entityType === 'string' &&
      typeof i.label === 'string',
  );
  // Provider-level cleanup: drop ids that no longer match a fixture.
  const valid = buildValidKeys();
  parsed = parsed.filter((p) => valid.has(`${p.entityType}:${p.id}`));
  setItems(parsed.map(({ id, entityType }) => ({ id, entityType })));
  const extrasMap: Record<string, { label: string; sublabel?: string; href: string }> = {};
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CompareItem[]>([]);
  const [extras, setExtras] = React.useState<Record<string, { label: string; sublabel?: string; href: string }>>({});
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    applyFromRaw(window.localStorage.getItem(STORAGE_KEY), setItems, setExtras);
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    const persisted: PersistedItem[] = items.map((it) => {
      const meta = extras[`${it.entityType}:${it.id}`];
      return {
        ...it,
        label: meta?.label ?? it.id,
        sublabel: meta?.sublabel,
        href: meta?.href ?? '#',
        addedAt: new Date().toISOString(),
      };
    });
    writePersisted(persisted);
  }, [items, extras, hydrated]);

  // Multi-tab sync.
  useStorageSync(STORAGE_KEY, (raw) => {
    applyFromRaw(raw, setItems, setExtras);
  });

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
      setItems((prev) => (canAdd(item.entityType, item.id) ? [...prev, item] : prev));
    },
    [canAdd],
  );

  // Adds with display metadata. Returns true if added.
  const addWithMeta = React.useCallback(
    (
      entityType: CompareItem['entityType'],
      id: string,
      meta: { label: string; sublabel?: string; href: string },
    ) => {
      let added = false;
      setItems((prev) => {
        if (prev.length >= MAX_ITEMS) return prev;
        if (prev.some((i) => i.entityType === entityType && i.id === id)) return prev;
        added = true;
        return [...prev, { entityType, id }];
      });
      if (added) {
        setExtras((prev) => ({ ...prev, [`${entityType}:${id}`]: meta }));
      }
      return added;
    },
    [],
  );

  const remove = React.useCallback<CompareContextValue['remove']>((entityType, id) => {
    setItems((prev) => prev.filter((i) => !(i.entityType === entityType && i.id === id)));
    setExtras((prev) => {
      const next = { ...prev };
      delete next[`${entityType}:${id}`];
      return next;
    });
  }, []);

  const clear = React.useCallback(() => {
    setItems([]);
    setExtras({});
  }, []);

  const value = React.useMemo<CompareContextValue & {
    extras: typeof extras;
    addWithMeta: typeof addWithMeta;
  }>(
    () => ({ items, canAdd, has, add, remove, clear, maxItems: MAX_ITEMS, extras, addWithMeta }),
    [items, canAdd, has, add, remove, clear, extras, addWithMeta],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}
