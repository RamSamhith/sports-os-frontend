export type ShortlistItemType = 'academy' | 'coach' | 'sport';

export interface ShortlistItem {
  id: string;
  userId: string;
  contextChildId?: string;
  itemType: ShortlistItemType;
  itemId: string;
  createdAt: string;
}
