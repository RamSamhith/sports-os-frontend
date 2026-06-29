import type { Sport } from '@/types/domain/sport';
import type { ApiResponse, ListResponse } from './client';
// TEMPORARY: Remove normalize imports and revert to direct `get<Sport>(...)` after backend fix
import { normalizeSport, normalizeSports } from './normalize';

export async function listSports(params?: {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<ListResponse<Sport>>> {
  const { get } = await import('./client');
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.status) query.set('status', params.status);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  const res = await get<Record<string, unknown>>(`/sports${qs ? `?${qs}` : ''}`);
  if (!res.ok) return res;
  const raw = res.data;
  const rawItems = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
  const rawPagination = raw?.pagination && typeof raw.pagination === 'object'
    ? raw.pagination as Record<string, unknown>
    : { page: params?.page ?? 1, pageSize: params?.limit ?? 100, total: 0, hasMore: false };
  return {
    ok: true,
    data: {
      items: normalizeSports(rawItems),
      pagination: {
        page: Number(rawPagination.page) || 1,
        pageSize: Number(rawPagination.pageSize ?? rawPagination.limit) || 100,
        total: Number(rawPagination.total) || 0,
        hasMore: Boolean(rawPagination.hasMore),
      },
    },
  };
}

export async function getSport(slug: string): Promise<ApiResponse<Sport>> {
  const { get } = await import('./client');
  const res = await get<Record<string, unknown>>(`/sports/${slug}`);
  if (!res.ok) return res;
  const raw = res.data;
  if (raw && typeof raw === 'object' && 'sport' in raw && typeof (raw as Record<string, unknown>).sport === 'object') {
    return { ok: true, data: normalizeSport((raw as Record<string, unknown>).sport) };
  }
  return { ok: true, data: normalizeSport(raw) };
}
