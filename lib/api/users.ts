import type { User, UserPreferences, ConsentFlags } from '@/types/domain/user';
import type { ApiResponse } from './client';

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
  consent?: Partial<ConsentFlags>;
}

export async function getMe(): Promise<ApiResponse<User>> {
  const { get } = await import('./client');
  return get<User>('/users/me');
}

export async function updateMe(data: UpdateUserRequest): Promise<ApiResponse<User>> {
  const { patch } = await import('./client');
  return patch<User>('/users/me', data);
}
