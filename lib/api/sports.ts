import type { Sport } from '@/types/domain/sport';
import type { ApiResponse, ListResponse } from './client';
import { get } from './client';

export async function listSports(params?: {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<ListResponse<Sport>>> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.status) query.set('status', params.status);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return get<ListResponse<Sport>>(`/sports${qs ? `?${qs}` : ''}`);
}

export async function getSport(slug: string): Promise<ApiResponse<Sport>> {
  const res = await get<Sport | { sport: Sport }>(`/sports/${slug}`);
  if (!res.ok) return res;
  const data = res.data;
  if (data && typeof data === 'object' && 'sport' in data && typeof (data as { sport: unknown }).sport === 'object') {
    return { ok: true, data: (data as { sport: Sport }).sport };
  }
  return { ok: true, data: data as Sport };
}
