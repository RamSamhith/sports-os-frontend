import type { Academy } from '@/types/domain/academy';
import type { Coach } from '@/types/domain/coach';
import type { ApiResponse, ListResponse } from './client';
import { get } from './client';
import type { UserRole } from '@/types/domain/user';

// ─── Dashboard ──────────────────────────────────────────────

export interface DashboardStats {
  totalAcademies: number;
  totalCoaches: number;
  totalUsers: number;
  pendingVerifications: number;
  totalEnquiries: number;
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return get<DashboardStats>('/admin/dashboard/stats');
}

// ─── Users ──────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface UserListResponse {
  items: AdminUser[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}

export async function getUsers(params?: { page?: number; limit?: number }): Promise<ApiResponse<UserListResponse>> {
  const query: Record<string, string> = {};
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);
  return get<UserListResponse>('/admin/users', query);
}

// ─── Academies (public endpoint, admin uses same) ───────────

export async function getAdminAcademies(params?: {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<ListResponse<Academy>>> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.status) query.status = params.status;
  if (params?.page) query.page = String(params.page);
  if (params?.pageSize) query.pageSize = String(params.pageSize);
  return get<ListResponse<Academy>>('/academies', query);
}

// ─── Coaches (public endpoint, admin uses same) ─────────────

export async function getAdminCoaches(params?: {
  search?: string;
  sport?: string;
  city?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<ListResponse<Coach>>> {
  const query: Record<string, string> = {};
  if (params?.search) query.search = params.search;
  if (params?.sport) query.sport = params.sport;
  if (params?.city) query.city = params.city;
  if (params?.page) query.page = String(params.page);
  if (params?.pageSize) query.pageSize = String(params.pageSize);
  return get<ListResponse<Coach>>('/coaches', query);
}

// ─── Enquiries (admin) ──────────────────────────────────────

export interface AdminEnquiry {
  id: string;
  targetType: string;
  targetId: string;
  intent: string;
  parentInfo: { name: string; email: string; phone: string };
  sportInterest: string;
  status: string;
  createdAt: string;
}

export async function getAdminEnquiries(): Promise<ApiResponse<AdminEnquiry[]>> {
  return get<AdminEnquiry[]>('/enquiries');
}
