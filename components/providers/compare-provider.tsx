'use client';

import * as React from 'react';
import { CompareContext, type CompareContextValue, type CompareItem, type CompareItemMeta } from '@/lib/hooks/use-compare';
import { useStorageSync } from '@/lib/hooks/use-storage-sync';
import { BUILD_HASH } from '@/lib/version';
import { useAuth } from '@/lib/hooks/use-auth';
import { trackCompareAdd, trackCompareRemove, trackGuestCompare } from '@/lib/analytics/events';
import { academies } from '@/data/academies';
import { academiesById } from '@/data/academies';
import { academiesBySlug } from '@/data/academies';
import { coaches } from '@/data/coaches';
import { coachesById } from '@/data/coaches';
import { coachesBySlug } from '@/data/coaches';
import { sports } from '@/data/sports';
import { sportsById } from '@/data/sports';
import { sportsBySlug } from '@/data/sports';

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
  /** Original addition timestamp; preserved across writes so order is stable. */
  addedAt: string;
}

/** Resolve display metadata for an item directly from the source fixtures.
 * Used on hydration to repair persisted state that was written before the
 * add-with-meta path was used. */
function resolveMeta(entityType: CompareItem['entityType'], id: string): CompareItemMeta | null {
  if (entityType === 'academy') {
    const a = academiesById(id) ?? academiesBySlug(id);
    if (!a) return null;
    return {
      label: a.name,
      sublabel: `${a.location.city}, ${a.location.state}`,
      href: `/academies/${a.slug}`,
    };
  }
  if (entityType === 'coach') {
    const c = coachesById(id) ?? coachesBySlug(id);
    if (!c) return null;
    return {
      label: c.name,
      sublabel: `${c.location.city} · ${c.experienceYears}+ yrs`,
      href: `/coaches/${c.slug}`,
    };
  }
  const s = sportsById(id) ?? sportsBySlug(id);
  if (!s) return null;
  return { label: s.name, sublabel: s.category, href: `/sports/${s.slug}` };
}

function buildValidKeys(): Set<string> {
  const keys = new Set<string>();
  for (const a of academies) keys.add(`academy:${a.id}`);
  for (const c of coaches) keys.add(`coach:${c.id}`);
  for (const s of sports) keys.add(`sport:${s.id}`);
  return keys;
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
    // Support both versioned envelope and legacy plain-array format.
    if (data && typeof data === 'object' && Array.isArray(data.items) && typeof data.version === 'string') {
      if (data.version !== BUILD_HASH) {
        // Stale deployment — clear persisted compare state.
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
  // Provider-level cleanup: drop ids that no longer match a fixture.
  const valid = buildValidKeys();
  parsed = parsed.filter((p) => valid.has(`${p.entityType}:${p.id}`));

  setItems(parsed.map(({ entityType, id }) => ({ entityType, id })));
  const extrasMap: Record<string, CompareItemMeta> = {};
  for (const p of parsed) {
    // Always prefer the freshest metadata from the source fixtures so the
    // tray never shows a stale label after a refresh.
    const fresh = resolveMeta(p.entityType, p.id);
    extrasMap[`${p.entityType}:${p.id}`] = fresh ?? {
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

  // Persist on every change once hydrated. We refresh `addedAt` for items
  // that have never been persisted, but keep the original timestamp for
  // items that already have one — so the user-visible order is stable.
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
      setItems((prev) => {
        if (prev.length >= MAX_ITEMS) return prev;
        if (prev.some((i) => i.entityType === item.entityType && i.id === item.id)) return prev;
        return [...prev, item];
      });
      // Repair metadata from source fixtures immediately so the tray shows
      // the right label even if no meta was passed in.
      const fresh = resolveMeta(item.entityType, item.id);
      if (fresh) {
        setExtras((prev) => ({ ...prev, [`${item.entityType}:${item.id}`]: fresh }));
      }
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
        // Prefer fresh metadata from the source fixtures; only fall back
        // to the caller-supplied meta if the entity is unknown.
        const fresh = resolveMeta(entityType, id);
        const label = fresh?.label ?? meta.label;
        setExtras((prev) => ({
          ...prev,
          [`${entityType}:${id}`]: fresh ?? meta,
        }));
        if (isGuest || !isAuthenticated) {
          trackGuestCompare(items.length + 1);
        } else {
          trackCompareAdd(id, entityType, label);
        }
      }
      return added;
    },
    [items.length, isGuest, isAuthenticated],
  );

  const remove = React.useCallback<CompareContextValue['remove']>((entityType, id) => {
    setItems((prev) => prev.filter((i) => !(i.entityType === entityType && i.id === id)));
    setExtras((prev) => {
      const next = { ...prev };
      delete next[`${entityType}:${id}`];
      return next;
    });
    trackCompareRemove(id, entityType);
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
