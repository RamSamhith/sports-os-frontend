import type { Pagination } from '@/types/domain/common';

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface ListResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface PaginatedApiResponse<T> {
  ok: true;
  data: ListResponse<T>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const json = await res.json();
    if (!res.ok) {
      return {
        ok: false,
        error: {
          code: json.code ?? 'UNKNOWN_ERROR',
          message: json.message ?? res.statusText,
          details: json.details,
        },
      };
    }
    return { ok: true, data: json.data ?? json };
  } catch (err) {
    return {
      ok: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network request failed',
      },
    };
  }
}

export function get<T>(path: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const search = params ? `?${new URLSearchParams(params).toString()}` : '';
  return request<T>(`${path}${search}`, { method: 'GET' });
}

export function post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export function patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
}

export function del<T>(path: string): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'DELETE' });
}
