import type { Coach } from '@/types/domain/coach';
import type { ApiResponse, ListResponse } from './client';
import { get } from './client';

export interface CoachFilterParams {
  sport?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getCoaches(params?: CoachFilterParams): Promise<ApiResponse<ListResponse<Coach>>> {
  const query: Record<string, string> = {};
  if (params?.sport) query.sport = params.sport;
  if (params?.search) query.search = params.search;
  if (params?.page) query.page = String(params.page);
  if (params?.pageSize) query.pageSize = String(params.pageSize);
  return get<ListResponse<Coach>>('/coaches', query);
}

export async function getCoach(slug: string): Promise<ApiResponse<Coach>> {
  return get<Coach>(`/coaches/by-slug/${slug}`);
}
