import type { Academy, Facility, TrainingLevel, Certification, AchievementSignals } from '@/types/domain/academy';
import type { LocationSummary } from '@/types/domain/location';
import type { ApiResponse, ListResponse } from './client';
import { get, post, put, uploadFile } from './client';

export interface AcademyFilterParams {
  sport?: string;
  facility?: string;
  level?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateAcademyPayload {
  name: string;
  description?: string;
  location: LocationSummary;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  sportsOffered: string[];
  facilities: Facility[];
  trainingLevels: TrainingLevel[];
  ageRange?: { min?: number; max?: number };
  batchInformation?: string;
  certifications?: Certification[];
  coverImage?: string;
  gallery?: string[];
}

export type UpdateAcademyPayload = Partial<CreateAcademyPayload>;

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

export async function createAcademy(data: CreateAcademyPayload): Promise<ApiResponse<Academy>> {
  return post<Academy>('/academies', data);
}

export async function updateAcademy(id: string, data: UpdateAcademyPayload): Promise<ApiResponse<Academy>> {
  return put<Academy>(`/academies/${id}`, data);
}

export async function getMyAcademy(): Promise<ApiResponse<Academy | null>> {
  return get<Academy | null>('/academies/me');
}

export async function uploadAcademyImage(id: string, file: File, type: 'cover' | 'gallery'): Promise<ApiResponse<{ url: string }>> {
  return uploadFile<{ url: string }>(`/academies/${id}/images?type=${type}`, file);
}
