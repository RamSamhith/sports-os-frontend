import type { Academy } from '@/types/domain/academy';
import type { ApiResponse, ListResponse } from './client';
import { get } from './client';
// TEMPORARY: Remove normalize imports and revert to direct `get<Academy>(...)` after backend fix
import { normalizeAcademy, normalizeAcademies } from './normalize';

export interface AcademyFilterParams {
  sport?: string;
  facility?: string;
  level?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getAcademies(params?: AcademyFilterParams): Promise<ApiResponse<ListResponse<Academy>>> {
  const query: Record<string, string> = {};
  if (params?.sport) query.sport = params.sport;
  if (params?.facility) query.facility = params.facility;
  if (params?.level) query.level = params.level;
  if (params?.status) query.status = params.status;
  if (params?.search) query.search = params.search;
  if (params?.page) query.page = String(params.page);
  if (params?.pageSize) query.pageSize = String(params.pageSize);
  const res = await get<Record<string, unknown>>('/academies', query);
  if (!res.ok) return res;
  const raw = res.data;
  const rawItems = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
  const rawPagination = raw?.pagination && typeof raw.pagination === 'object'
    ? raw.pagination as Record<string, unknown>
    : { page: params?.page ?? 1, pageSize: params?.pageSize ?? 12, total: 0, hasMore: false };
  return {
    ok: true,
    data: {
      items: normalizeAcademies(rawItems),
      pagination: {
        page: Number(rawPagination.page) || 1,
        pageSize: Number(rawPagination.pageSize) || 12,
        total: Number(rawPagination.total) || 0,
        hasMore: Boolean(rawPagination.hasMore),
      },
    },
  };
}

export async function getAcademy(slug: string): Promise<ApiResponse<Academy>> {
  const res = await get<Record<string, unknown>>(`/academies/by-slug/${slug}`);
  if (!res.ok) return res;
  return { ok: true, data: normalizeAcademy(res.data) };
}

export async function getAcademyById(id: string): Promise<ApiResponse<Academy>> {
  const res = await get<Record<string, unknown>>(`/academies/${id}`);
  if (!res.ok) return res;
  return { ok: true, data: normalizeAcademy(res.data) };
}
