import type { Coach } from '@/types/domain/coach';
import type { ApiResponse, ListResponse } from './client';

export interface CoachFilterParams {
  sport?: string;
  city?: string;
  state?: string;
  academyId?: string;
  minRating?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export async function getCoaches(params?: CoachFilterParams): Promise<ApiResponse<ListResponse<Coach>>> {
  const { get } = await import('./client');
  const query: Record<string, string> = {};
  if (params?.sport) query.sport = params.sport;
  if (params?.city) query.city = params.city;
  if (params?.state) query.state = params.state;
  if (params?.academyId) query.academyId = params.academyId;
  if (params?.minRating !== undefined) query.minRating = String(params.minRating);
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);
  if (params?.sort) query.sort = params.sort;
  return get<ListResponse<Coach>>('/coaches', query);
}

export async function getCoach(slug: string): Promise<ApiResponse<Coach>> {
  const { get } = await import('./client');
  return get<Coach>(`/coaches/${slug}`);
}
