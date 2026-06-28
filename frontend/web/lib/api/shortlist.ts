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

export async function removeFromShortlistById(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  return del<{ id: string }>(`/shortlist/${id}`);
}

export async function removeFromShortlistBySlug(
  itemType: 'academy' | 'coach',
  slug: string,
): Promise<ApiResponse<{ itemType: string; itemId: string }>> {
  return del<{ itemType: string; itemId: string }>(`/shortlist/by-slug/${itemType}/${slug}`);
}

export async function clearShortlist(): Promise<ApiResponse<{ cleared: boolean }>> {
  return del<{ cleared: boolean }>('/shortlist/clear-all');
}

export async function checkShortlist(
  itemType: 'academy' | 'coach',
  slug: string,
): Promise<ApiResponse<{ inShortlist: boolean }>> {
  return get<{ inShortlist: boolean }>(`/shortlist/check/${itemType}/${slug}`);
}

// Legacy alias — use removeFromShortlistById or removeFromShortlistBySlug
export const removeFromShortlist = removeFromShortlistById;
