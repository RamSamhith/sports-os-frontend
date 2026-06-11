import type { Child } from '@/types/domain/user';
import type { ApiResponse } from './client';

export interface CreateChildRequest {
  name: string;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  sportInterests?: string[];
}

export interface UpdateChildRequest {
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  sportInterests?: string[];
}

export async function getChildren(): Promise<ApiResponse<Child[]>> {
  const { get } = await import('./client');
  return get<Child[]>('/children');
}

export async function createChild(data: CreateChildRequest): Promise<ApiResponse<Child>> {
  const { post } = await import('./client');
  return post<Child>('/children', data);
}

export async function updateChild(id: string, data: UpdateChildRequest): Promise<ApiResponse<Child>> {
  const { patch } = await import('./client');
  return patch<Child>(`/children/${id}`, data);
}

export async function deleteChild(id: string): Promise<ApiResponse<void>> {
  const { del } = await import('./client');
  return del<void>(`/children/${id}`);
}
