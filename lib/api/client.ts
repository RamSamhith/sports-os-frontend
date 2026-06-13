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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('sportsos:auth-token');
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const body = options.body;
  if (body && typeof body === 'string') {
    headers['Content-Type'] = 'application/json';
  }
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 204) {
      return { ok: true, data: undefined as T };
    }

    const json = await res.json();

    if (!res.ok) {
      const err = json.error ?? json;
      return {
        ok: false,
        error: {
          code: err.code ?? 'UNKNOWN_ERROR',
          message: err.message ?? res.statusText,
          details: err.details,
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

export function put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
}

export function del<T>(path: string): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'DELETE' });
}
