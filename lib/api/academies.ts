import type { Academy } from '@/types/domain/academy';
import type { ApiResponse, ListResponse } from './client';
import { get } from './client';

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
  return get<ListResponse<Academy>>('/academies', query);
}

export async function getAcademy(slug: string): Promise<ApiResponse<Academy>> {
  return get<Academy>(`/academies/by-slug/${slug}`);
}

export async function getAcademyById(id: string): Promise<ApiResponse<Academy>> {
  return get<Academy>(`/academies/${id}`);
}
