import type { Coach } from '@/types/domain/coach';
import type { ApiResponse, ListResponse } from './client';
import { get } from './client';
// TEMPORARY: Remove normalize imports and revert to direct `get<Coach>(...)` after backend fix
import { normalizeCoach, normalizeCoaches } from './normalize';

export interface CoachFilterParams {
  sport?: string;
  city?: string;
  experienceYears?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getCoaches(params?: CoachFilterParams): Promise<ApiResponse<ListResponse<Coach>>> {
  const query: Record<string, string> = {};
  if (params?.sport) query.sport = params.sport;
  if (params?.city) query.city = params.city;
  if (params?.experienceYears) query.experienceYears = params.experienceYears;
  if (params?.search) query.search = params.search;
  if (params?.page) query.page = String(params.page);
  if (params?.pageSize) query.pageSize = String(params.pageSize);
  const res = await get<Record<string, unknown>>('/coaches', query);
  if (!res.ok) return res;
  const raw = res.data;
  const rawItems = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
  const rawPagination = raw?.pagination && typeof raw.pagination === 'object'
    ? raw.pagination as Record<string, unknown>
    : { page: params?.page ?? 1, pageSize: params?.pageSize ?? 12, total: 0, hasMore: false };
  return {
    ok: true,
    data: {
      items: normalizeCoaches(rawItems),
      pagination: {
        page: Number(rawPagination.page) || 1,
        pageSize: Number(rawPagination.pageSize) || 12,
        total: Number(rawPagination.total) || 0,
        hasMore: Boolean(rawPagination.hasMore),
      },
    },
  };
}

export async function getCoach(slug: string): Promise<ApiResponse<Coach>> {
  const res = await get<Record<string, unknown>>(`/coaches/by-slug/${slug}`);
  if (!res.ok) return res;
  return { ok: true, data: normalizeCoach(res.data) };
}
