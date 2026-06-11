import type { ShortlistItem } from '@/types/domain/shortlist';
import type { ApiResponse } from './client';

export interface AddFavoriteRequest {
  itemType: 'academy' | 'coach' | 'sport';
  itemId: string;
  contextChildId?: string;
}

export async function getFavorites(): Promise<ApiResponse<ShortlistItem[]>> {
  const { get } = await import('./client');
  return get<ShortlistItem[]>('/favorites');
}

export async function addFavorite(data: AddFavoriteRequest): Promise<ApiResponse<ShortlistItem>> {
  const { post } = await import('./client');
  return post<ShortlistItem>('/favorites', data);
}

export async function removeFavorite(itemType: string, itemId: string): Promise<ApiResponse<void>> {
  const { del } = await import('./client');
  return del<void>(`/favorites/${itemType}/${itemId}`);
}
