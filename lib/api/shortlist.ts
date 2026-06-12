import { get, post, del } from './client';
import type { ApiResponse } from './client';
import type { ShortlistItem } from '@/types/domain/shortlist';

export interface PopulatedShortlistItem extends ShortlistItem {
  data: Record<string, unknown> | null;
}

export async function getMyShortlist(): Promise<ApiResponse<ShortlistItem[]>> {
  return get<ShortlistItem[]>('/shortlist/me');
}

export async function getMyShortlistPopulated(): Promise<ApiResponse<PopulatedShortlistItem[]>> {
  return get<PopulatedShortlistItem[]>('/shortlist/me/populated');
}

export async function addToShortlist(
  itemType: 'academy' | 'coach',
  itemId: string,
): Promise<ApiResponse<ShortlistItem>> {
  return post<ShortlistItem>('/shortlist', { itemType, itemId });
}

export async function removeFromShortlist(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  return del<{ id: string }>(`/shortlist/${id}`);
}
