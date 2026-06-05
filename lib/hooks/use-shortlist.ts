'use client';

import { createContext, useContext } from 'react';
import type { ShortlistItem, ShortlistItemType } from '@/types/domain/shortlist';

export interface ShortlistContextValue {
  items: ShortlistItem[];
  has: (itemType: ShortlistItemType, itemId: string) => boolean;
  add: (item: Omit<ShortlistItem, 'id' | 'userId' | 'createdAt'>) => void;
  remove: (itemType: ShortlistItemType, itemId: string) => void;
  clear: () => void;
}

export const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    throw new Error('useShortlist must be used within ShortlistProvider');
  }
  return ctx;
}
