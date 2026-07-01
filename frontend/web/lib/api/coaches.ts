import type { Coach } from '@/types/domain/coach';
import type { Certification } from '@/types/domain/academy';
import type { LocationSummary } from '@/types/domain/location';
import type { ApiResponse, ListResponse } from './client';
import { get, post, put, uploadFile } from './client';

export interface CoachFilterParams {
  sport?: string;
  city?: string;
  experienceYears?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateCoachPayload {
  name: string;
  avatar?: string;
  sportsCoached: string[];
  specialization: string[];
  experienceYears: number;
  certifications?: Certification[];
  bio?: string;
  achievements?: string[];
  academyId?: string;
  location: LocationSummary;
  contact: {
    phone?: string;
    email?: string;
  };
}

export type UpdateCoachPayload = Partial<CreateCoachPayload>;

export async function getCoaches(params?: CoachFilterParams): Promise<ApiResponse<ListResponse<Coach>>> {
  const query: Record<string, string> = {};
  if (params?.sport) query.sport = params.sport;
  if (params?.city) query.city = params.city;
  if (params?.experienceYears) query.experienceYears = params.experienceYears;
  if (params?.search) query.search = params.search;
  if (params?.page) query.page = String(params.page);
  if (params?.pageSize) query.pageSize = String(params.pageSize);
  return get<ListResponse<Coach>>('/coaches', query);
}

export async function getCoach(slug: string): Promise<ApiResponse<Coach>> {
  return get<Coach>(`/coaches/by-slug/${slug}`);
}

export async function getCoachById(id: string): Promise<ApiResponse<Coach>> {
  return get<Coach>(`/coaches/${id}`);
}

export async function createCoach(data: CreateCoachPayload): Promise<ApiResponse<Coach>> {
  return post<Coach>('/coaches', data);
}

export async function updateCoach(id: string, data: UpdateCoachPayload): Promise<ApiResponse<Coach>> {
  return put<Coach>(`/coaches/${id}`, data);
}

export async function getMyCoach(): Promise<ApiResponse<Coach | null>> {
  return get<Coach | null>('/coaches/me');
}

export async function uploadCoachAvatar(id: string, file: File): Promise<ApiResponse<{ url: string }>> {
  return uploadFile<{ url: string }>(`/coaches/${id}/avatar`, file);
}
