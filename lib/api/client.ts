import type { ApiResponse, ListResponse } from '@/types/api';
import { publicEnv } from '@/config/env';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const url = new URL(path, publicEnv.siteUrl);
  if (options.params) {
    for (const [k, v] of Object.entries(options.params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  // Placeholder: real backend will be wired in a later phase.
  // This scaffold intentionally returns a typed not-implemented error to keep types honest.
  return {
    ok: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'API client is a scaffold placeholder.',
    },
  };
}

export async function apiList<T>(path: string, options?: FetchOptions): Promise<ApiResponse<ListResponse<T>>> {
  return apiFetch<ListResponse<T>>(path, options);
}
