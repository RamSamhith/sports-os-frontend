'use client';

import { createContext, useContext } from 'react';

export type CompareEntityType = 'academy' | 'coach' | 'sport';

export interface CompareItem {
  entityType: CompareEntityType;
  id: string;
}

export interface CompareItemMeta {
  label: string;
  sublabel?: string;
  href: string;
}

export interface CompareContextValue {
  items: CompareItem[];
  canAdd: (entityType: CompareEntityType, id: string) => boolean;
  has: (entityType: CompareEntityType, id: string) => boolean;
  add: (item: CompareItem) => void;
  addWithMeta: (
    entityType: CompareEntityType,
    id: string,
    meta: CompareItemMeta,
  ) => boolean;
  remove: (entityType: CompareEntityType, id: string) => void;
  clear: () => void;
  /** Maximum number of items a user can compare. */
  maxItems: number;
  /** Minimum number of items required to render the comparison table. */
  minItems: number;
  /** Per-item display metadata, keyed by `${entityType}:${id}`. */
  extras: Record<string, CompareItemMeta>;
}

export const CompareContext = createContext<CompareContextValue | null>(null);

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return ctx;
}
