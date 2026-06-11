import type { Academy } from '@/types/domain/academy';
import type { AcademySuggestions } from '@/lib/utils/matching';
import type { ApiResponse, ListResponse } from './client';

export interface AcademyFilterParams {
  sport?: string;
  city?: string;
  state?: string;
  facility?: string;
  trainingLevel?: string;
  verificationStatus?: string;
  minRating?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface AcademyDetailResponse extends Academy {
  coaches?: Array<{ id: string; name: string; slug: string; rating: number }>;
}

export async function getAcademies(params?: AcademyFilterParams): Promise<ApiResponse<ListResponse<Academy>>> {
  const { get } = await import('./client');
  const query: Record<string, string> = {};
  if (params?.sport) query.sport = params.sport;
  if (params?.city) query.city = params.city;
  if (params?.state) query.state = params.state;
  if (params?.facility) query.facility = params.facility;
  if (params?.trainingLevel) query.trainingLevel = params.trainingLevel;
  if (params?.verificationStatus) query.verificationStatus = params.verificationStatus;
  if (params?.minRating !== undefined) query.minRating = String(params.minRating);
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);
  if (params?.sort) query.sort = params.sort;
  return get<ListResponse<Academy>>('/academies', query);
}

export async function getAcademy(slug: string): Promise<ApiResponse<AcademyDetailResponse>> {
  const { get } = await import('./client');
  return get<AcademyDetailResponse>(`/academies/${slug}`);
}

export async function getAcademySuggestions(
  userId?: string,
  childId?: string,
): Promise<ApiResponse<AcademySuggestions>> {
  const { get } = await import('./client');
  const params: Record<string, string> = {};
  if (userId) params.userId = userId;
  if (childId) params.childId = childId;
  return get<AcademySuggestions>('/recommendations/academies', params);
}
