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

// ─── Refresh Queue ───────────────────────────────────────────
// When a 401 TOKEN_EXPIRED is received, we pause all in-flight requests,
// perform a single refresh, then retry them all with the new token.

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
let pendingRequests: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function onRefreshed(token: string) {
  pendingRequests.forEach((p) => p.resolve(token));
  pendingRequests = [];
}

function onRefreshFailed(err: unknown) {
  pendingRequests.forEach((p) => p.reject(err));
  pendingRequests = [];
}

async function doRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return false;
    const json = await res.json();
    if (json.ok && json.data?.token) {
      try {
        localStorage.setItem('sportsos:auth-token', json.data.token);
      } catch { /* ignore */ }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function ensureRefresh(): Promise<string> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = doRefresh().finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  }

  const success = await refreshPromise!;

  if (!success) {
    onRefreshFailed(new Error('Refresh failed'));
    throw new Error('Session expired');
  }

  const newToken = getToken();
  if (!newToken) {
    onRefreshFailed(new Error('No token after refresh'));
    throw new Error('Session expired');
  }

  onRefreshed(newToken);
  return newToken;
}

// ─── Timeout ─────────────────────────────────────────────────

const REQUEST_TIMEOUT_MS = 10_000;

// ─── Core Request Function ───────────────────────────────────

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    console.log(`[API] ${options.method ?? 'GET'} ${url}`);
    const res = await fetch(url, { ...options, headers, credentials: 'include', signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.status === 204) {
      return { ok: true, data: undefined as T };
    }

    const json = await res.json();

    if (!res.ok) {
      const err = json.error ?? json;

      // Handle TOKEN_EXPIRED: attempt refresh and retry
      if (res.status === 401 && err.code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          // Another refresh is in progress — queue this request
          try {
            const newToken = await new Promise<string>((resolve, reject) => {
              pendingRequests.push({ resolve, reject });
            });
            // Retry with new token
            const retryHeaders: Record<string, string> = {};
            retryHeaders['Authorization'] = `Bearer ${newToken}`;
            retryHeaders['Content-Type'] = 'application/json';
            const retryRes = await fetch(url, { ...options, headers: retryHeaders, credentials: 'include' });
            const retryJson = await retryRes.json();
            if (!retryRes.ok) {
              const retryErr = retryJson.error ?? retryJson;
              return {
                ok: false,
                error: {
                  code: retryErr.code ?? 'UNKNOWN_ERROR',
                  message: retryErr.message ?? retryRes.statusText,
                  details: retryErr.details,
                },
              };
            }
            return { ok: true, data: retryJson.data ?? retryJson };
          } catch {
            return {
              ok: false,
              error: { code: 'UNAUTHORIZED', message: 'Session expired' },
            };
          }
        }

        // We are the first to encounter expired token — initiate refresh
        try {
          const newToken = await ensureRefresh();
          // Retry with new token
          const retryHeaders: Record<string, string> = {};
          retryHeaders['Authorization'] = `Bearer ${newToken}`;
          retryHeaders['Content-Type'] = 'application/json';
          const retryRes = await fetch(url, { ...options, headers: retryHeaders, credentials: 'include' });
          const retryJson = await retryRes.json();
          if (!retryRes.ok) {
            const retryErr = retryJson.error ?? retryJson;
            return {
              ok: false,
              error: {
                code: retryErr.code ?? 'UNKNOWN_ERROR',
                message: retryErr.message ?? retryRes.statusText,
                details: retryErr.details,
              },
            };
          }
          return { ok: true, data: retryJson.data ?? retryJson };
        } catch {
          return {
            ok: false,
            error: { code: 'UNAUTHORIZED', message: 'Session expired' },
          };
        }
      }

      return {
        ok: false,
        error: {
          code: err.code ?? 'UNKNOWN_ERROR',
          message: err.message ?? res.statusText,
          details: err.details,
        },
      };
    }

    clearTimeout(timeoutId);
    const data = json.data ?? json;
    console.log(`[API] OK ${options.method ?? 'GET'} ${url}`, { status: res.status });
    return { ok: true, data };
  } catch (err) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : 'Network request failed';
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    console.error(`[API] FAILED ${options.method ?? 'GET'} ${url}:`, isAbort ? 'Request timed out (10s)' : message);
    return {
      ok: false,
      error: {
        code: isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: isAbort ? 'Request timed out. Please try again.' : message,
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

export function del<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>(path, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined });
}
