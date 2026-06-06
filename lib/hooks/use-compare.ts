'use client';

import { createContext, useContext } from 'react';

export type CompareEntityType = 'academy' | 'coach' | 'sport';

export interface CompareItem {
  entityType: CompareEntityType;
  id: string;
}

export interface CompareContextValue {
  items: CompareItem[];
  canAdd: (entityType: CompareEntityType, id: string) => boolean;
  has: (entityType: CompareEntityType, id: string) => boolean;
  add: (item: CompareItem) => void;
  remove: (entityType: CompareEntityType, id: string) => void;
  clear: () => void;
  maxItems: number;
  extras: Record<string, { label: string; sublabel?: string; href: string }>;
  addWithMeta: (
    entityType: CompareEntityType,
    id: string,
    meta: { label: string; sublabel?: string; href: string },
  ) => boolean;
}

export const CompareContext = createContext<CompareContextValue | null>(null);

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return ctx;
}
